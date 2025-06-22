package main

import (
	"context"
	"fmt"
	"net/http"

	"cloud.google.com/go/firestore"

	applicationpinboard "app/internal/application/pinboard"
	domainfirestore "app/internal/domain/firestore"
	"app/internal/handler"
	"app/internal/pkg/config"
)

type Server struct {
	http            *http.Server
	firestoreClient *firestore.Client
}

func NewServer(ctx context.Context, app *config.App) (*Server, error) {
	firestoreClient, err := firestore.NewClient(ctx, app.GCPProjectID)
	if err != nil {
		return nil, fmt.Errorf("failed to create firestore client: %w", err)
	}

	fs := domainfirestore.NewService(firestoreClient, app.FirestoreConfig.PinboardCollection)
	ps := applicationpinboard.NewService(fs)

	h := handler.NewHandler(ps)
	handler := http.StripPrefix("/api", h)

	http := &http.Server{
		Addr:    app.Port,
		Handler: handler,
	}

	return &Server{
		http:            http,
		firestoreClient: firestoreClient,
	}, nil
}

func (s *Server) Serve() error {
	fmt.Printf("Server starting on port %s\n", s.http.Addr)
	return s.http.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	defer s.firestoreClient.Close()
	return s.http.Shutdown(ctx)
}
