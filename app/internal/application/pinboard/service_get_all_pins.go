package pinboard

import (
	"context"
	"fmt"

	"app/internal/domain/firestore"
)

func (s *Service) GetAllPins(ctx context.Context) ([]*firestore.PinboardRecord, error) {
	records, err := s.firestoreSvc.GetAllPinboardRecords(ctx)
	if err != nil {
		return nil, fmt.Errorf("get all pinboard records: %w", err)
	}
	return records, nil
}
