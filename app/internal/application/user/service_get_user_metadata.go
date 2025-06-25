package user

import (
	"context"

	"app/internal/domain/firestore"
)

// GetUserLinks retrieves a user's links by username (public access, no auth required)
func (s *Service) GetUserLinks(ctx context.Context, username string) (*firestore.User, error) {
	return s.firestoreSvc.GetUserByUsername(ctx, username)
}

// GetUserByID retrieves a user's links by Firebase UID (fallback for direct ID access)
func (s *Service) GetUserByID(ctx context.Context, userID string) (*firestore.User, error) {
	return s.firestoreSvc.GetUser(ctx, userID)
}
