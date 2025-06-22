package pinboard

import (
	"context"
	"fmt"

	"app/internal/domain/firestore"
)

func (s *Service) AddPin(ctx context.Context, pin *firestore.PinboardRecord) error {
	if err := s.firestoreSvc.PutPinboardRecord(ctx, pin); err != nil {
		return fmt.Errorf("put pinboard record: %w", err)
	}
	return nil
}
