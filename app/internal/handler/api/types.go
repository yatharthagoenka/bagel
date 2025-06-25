package api

import "app/internal/domain/firestore"

// GetUserPublicDataResponse represents the response body for getting a user's public data
type GetUserPublicDataResponse struct {
	Username string           `json:"username"`
	Links    []firestore.Link `json:"links"`
}

// GetUserResponse represents the response body for getting a user's metadata
type GetUserResponse struct {
	User *firestore.User `json:"user"`
}

// UpdateUserRequest represents the request body for updating user data (username and/or links)
type UpdateUserRequest struct {
	Username *string           `json:"username,omitempty"`
	Links    *[]firestore.Link `json:"links,omitempty"`
}

// UpdateUserResponse represents the response body for updating user data
type UpdateUserResponse struct {
	User *firestore.User `json:"user"`
}

// InitUserRequest represents the request body for initializing a user from auth data
type InitUserRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

// InitUserResponse represents the response body for initializing a user
type InitUserResponse struct {
	User *firestore.User `json:"user"`
}
