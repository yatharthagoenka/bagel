package user

import (
	"context"

	"app/internal/domain/firestore"
)

// GetUserMetadata retrieves a user's metadata by Google OAuth UID (fallback for direct ID access)
func (s *Service) GetUserMetadata(ctx context.Context, userID string) (*firestore.User, error) {
	return s.firestoreSvc.GetUser(ctx, userID)
}
