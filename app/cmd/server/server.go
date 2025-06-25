package main

import (
	"context"
	"fmt"
	"net/http"
	"slices"

	"cloud.google.com/go/firestore"

	applicationuser "app/internal/application/user"
	domainfirestore "app/internal/domain/firestore"
	"app/internal/handler"
	"app/internal/pkg/auth"
	"app/internal/pkg/config"
)

type Server struct {
	http    *http.Server
	closeFn func()
}

const (
	apiPrefix = "/api"
)

func NewServer(ctx context.Context, app *config.App) (*Server, error) {
	var closeFns []func() error
	closeFn := func() {
		slices.Reverse(closeFns)
		for _, fn := range closeFns {
			if err := fn(); err != nil {
				fmt.Printf("error closing: %v\n", err)
			}
		}
	}

	fc, err := firestore.NewClient(ctx, app.GCPProjectID)
	if err != nil {
		return nil, fmt.Errorf("failed to create firestore client: %w", err)
	}
	closeFns = append(closeFns, fc.Close)

	fs := domainfirestore.NewService(fc, app.FirestoreConfig.UserCollection)
	us := applicationuser.NewService(fs)

	authMiddleware := auth.NewAuthMiddleware()

	h := handler.NewHandler(us, authMiddleware)

	mux := http.NewServeMux()
	mux.HandleFunc(apiPrefix+"/user/init", h.WrapHandler(h.HandleInit))
	mux.HandleFunc(apiPrefix+"/user/p", h.WrapHandler(h.HandleUserPublicData))
	mux.HandleFunc(apiPrefix+"/user", h.WrapHandler(h.HandleUser))

	httpServer := &http.Server{
		Addr:    app.Port,
		Handler: mux,
	}

	return &Server{
		http:    httpServer,
		closeFn: closeFn,
	}, nil
}

func (s *Server) Serve() error {
	fmt.Printf("Server starting on port %s\n", s.http.Addr)
	return s.http.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	err := s.http.Shutdown(ctx)
	s.closeFn()
	return err
}
