package user

import "app/internal/domain/firestore"

type Service struct {
	firestoreSvc *firestore.Service
}

func NewService(f *firestore.Service) *Service {
	return &Service{
		firestoreSvc: f,
	}
}
