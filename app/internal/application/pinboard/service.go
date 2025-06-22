package pinboard

import "app/internal/domain/firestore"

type Service struct {
	firestoreSvc *firestore.Service
}

func NewService(d *firestore.Service) *Service {
	return &Service{
		firestoreSvc: d,
	}
}
