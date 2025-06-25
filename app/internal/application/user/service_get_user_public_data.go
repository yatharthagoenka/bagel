package user

import (
	"context"

	"app/internal/domain/firestore"
)

type UserPublicData struct {
	Username string
	Links    []firestore.Link
}

// GetUserPublicData retrieves a user's public data by their custom username (public access, no auth required)
func (s *Service) GetUserPublicData(ctx context.Context, username string) (*UserPublicData, error) {
	u, err := s.firestoreSvc.GetUserByUsername(ctx, username)
	if err != nil {
		return nil, err
	}
	return &UserPublicData{
		Username: u.Username,
		Links:    u.Links,
	}, nil
}
