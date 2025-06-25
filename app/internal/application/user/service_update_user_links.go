package user

import (
	"context"
	"fmt"

	"app/internal/domain/firestore"
)

// UpdateUserLinks updates a user's links (requires authentication)
func (s *Service) UpdateUserLinks(ctx context.Context, authenticatedUserID string, links []firestore.Link) error {
	// Get existing user or create new one
	existingUser, err := s.firestoreSvc.GetUser(ctx, authenticatedUserID)
	if err != nil && !isNotFoundError(err) {
		return fmt.Errorf("failed to get user: %w", err)
	}

	var user *firestore.User
	if existingUser != nil {
		// Update existing user
		user = existingUser
		user.Links = links
	} else {
		// Create new user (first time login)
		user = &firestore.User{
			ID:    authenticatedUserID,
			Links: links,
		}
	}

	return s.firestoreSvc.UpdateUser(ctx, user)
}

// isNotFoundError checks if error is a "not found" error
func isNotFoundError(err error) bool {
	return err != nil && (err.Error() == "user not found" ||
		err.Error() == "document not found")
}
