package api

import "app/internal/domain/firestore"

// CreatePinRequest represents the request body for creating a pin
type CreatePinRequest struct {
	Message string `json:"message"`
}

// GetAllPinsResponse represents the response body for getting all pins
type GetAllPinsResponse struct {
	Pins []*firestore.PinboardRecord `json:"pins"`
}
