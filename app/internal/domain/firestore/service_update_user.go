package firestore

import (
	"context"
	"fmt"
	"time"
)

// UpdateUser updates a user's data in the database.
func (s *Service) UpdateUser(ctx context.Context, user *User) error {
	now := time.Now().Unix()
	if user.CreatedAt == 0 {
		user.CreatedAt = now
	}
	user.UpdatedAt = now

	_, err := s.collection.Doc(user.ID).Set(ctx, user)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}
