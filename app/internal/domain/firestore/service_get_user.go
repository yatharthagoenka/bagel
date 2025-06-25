package firestore

import (
	"context"
	"fmt"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// GetUser retrieves a user by their Google OAuth UID.
// Used to get a user's profile data when they are logged in.
func (s *Service) GetUser(ctx context.Context, userID string) (*User, error) {
	doc, err := s.collection.Doc(userID).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	var user User
	if err := doc.DataTo(&user); err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %w", err)
	}

	return &user, nil
}
