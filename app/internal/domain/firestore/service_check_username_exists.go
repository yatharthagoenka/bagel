package firestore

import (
	"context"

	"google.golang.org/api/iterator"
)

// IsUsernameExists checks if a username already exists in the database.
// Required to prevent users from using usernames that already exist.
func (s *Service) IsUsernameExists(ctx context.Context, username string) (bool, error) {
	iter := s.collection.Where("username", "==", username).Limit(1).Documents(ctx)
	defer iter.Stop()

	_, err := iter.Next()
	if err != nil {
		if err == iterator.Done {
			return false, nil
		}
		return false, err
	}

	return true, nil
}
