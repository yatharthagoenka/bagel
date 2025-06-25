package user

import (
	"context"

	"app/internal/domain/firestore"
)

// CreateUserFromAuth creates or updates user from Google Auth data (first time login)
func (s *Service) CreateUserFromAuth(ctx context.Context, userID, email, name string) error {
	// Check if user already exists
	existingUser, err := s.firestoreSvc.GetUser(ctx, userID)
	if err != nil && !isNotFoundError(err) {
		return err
	}

	// If user exists, just update the email/name in case they changed
	if existingUser != nil {
		existingUser.Email = email
		existingUser.Name = name
		return s.firestoreSvc.UpdateUser(ctx, existingUser)
	}

	// Create new user with Auth data
	user := &firestore.User{
		ID:    userID,
		Email: email,
		Name:  name,
		Links: []firestore.Link{}, // Empty links array initially
	}

	return s.firestoreSvc.UpdateUser(ctx, user)
}
