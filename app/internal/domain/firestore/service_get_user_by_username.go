package firestore

import (
	"context"
	"fmt"

	"google.golang.org/api/iterator"
)

// GetUserByUsername retrieves a user by their custom username.
func (s *Service) GetUserByUsername(ctx context.Context, username string) (*User, error) {
	iter := s.collection.Where("username", "==", username).Documents(ctx)
	defer iter.Stop()

	doc, err := iter.Next()
	if err != nil {
		if err == iterator.Done {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to query user by username: %w", err)
	}

	var user User
	if err := doc.DataTo(&user); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %w", err)
	}

	return &user, nil
}
