package firestore

import "cloud.google.com/go/firestore"

type Service struct {
	client     *firestore.Client
	collection *firestore.CollectionRef
}

func NewService(f *firestore.Client, collection string) *Service {
	return &Service{
		client:     f,
		collection: f.Collection(collection),
	}
}
