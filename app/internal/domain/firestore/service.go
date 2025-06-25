package firestore

import "cloud.google.com/go/firestore"

type Service struct {
	collection *firestore.CollectionRef
}

func NewService(f *firestore.Client, collection string) *Service {
	return &Service{
		collection: f.Collection(collection),
	}
}
