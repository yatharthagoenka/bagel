package firestore

import (
	"context"
	"fmt"
)

func (s *Service) PutPinboardRecord(ctx context.Context, record *PinboardRecord) error {
	_, _, err := s.collection.Add(ctx, record)
	if err != nil {
		return fmt.Errorf("add pinboard record: %w", err)
	}
	return nil
}
