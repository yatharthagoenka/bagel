package main

import (
	"context"
	"fmt"
	"net/http"

	"cloud.google.com/go/firestore"

	applicationuser "app/internal/application/user"
	domainfirestore "app/internal/domain/firestore"
	"app/internal/handler"
	"app/internal/pkg/auth"
	"app/internal/pkg/config"
)

type Server struct {
	http            *http.Server
	firestoreClient *firestore.Client
}

func NewServer(ctx context.Context, app *config.App) (*Server, error) {
	// Initialize Firestore client
	firestoreClient, err := firestore.NewClient(ctx, app.GCPProjectID)
	if err != nil {
		return nil, fmt.Errorf("failed to create firestore client: %w", err)
	}

	// Initialize services (using users collection for the user service)
	fs := domainfirestore.NewService(firestoreClient, app.FirestoreConfig.UserCollection)
	us := applicationuser.NewService(fs)

	// Initialize Google OAuth middleware
	authMiddleware := auth.NewAuthMiddleware()

	// Initialize handler
	h := handler.NewHandler(us, authMiddleware)
	handlerWithPrefix := http.StripPrefix("/api", h)

	httpServer := &http.Server{
		Addr:    app.Port,
		Handler: handlerWithPrefix,
	}

	return &Server{
		http:            httpServer,
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
