package firestore

import (
	"context"
	"fmt"

	"google.golang.org/api/iterator"
)

func (s *Service) GetAllPinboardRecords(ctx context.Context) ([]*PinboardRecord, error) {
	var records []*PinboardRecord

	iter := s.collection.Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("get pinboard records: %w", err)
		}

		var record PinboardRecord
		if err := doc.DataTo(&record); err != nil {
			// log error but continue if this record is not valid
			fmt.Printf("unmarshal pinboard record: %v\n", err)
			continue
		}

		records = append(records, &record)
	}

	return records, nil
}
