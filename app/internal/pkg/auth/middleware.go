package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"
)

// UserContextKey is the context key for user information
type UserContextKey string

const (
	UserIDContextKey UserContextKey = "user_id"
)

// GoogleUserInfo represents the user info from Google OAuth
type GoogleUserInfo struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	Name          string `json:"name"`
	Picture       string `json:"picture"`
	VerifiedEmail bool   `json:"verified_email"`
}

// AuthMiddleware handles Google OAuth token verification
type AuthMiddleware struct {
	httpClient *http.Client
}

// NewAuthMiddleware creates a new auth middleware instance
func NewAuthMiddleware() *AuthMiddleware {
	return &AuthMiddleware{
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// RequireAuth is a middleware that requires Google OAuth authentication
func (m *AuthMiddleware) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := extractTokenFromHeader(r)
		if token == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		userInfo, err := m.verifyGoogleToken(r.Context(), token)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Add Google user ID to context
		ctx := context.WithValue(r.Context(), UserIDContextKey, userInfo.ID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// verifyGoogleToken verifies the Google OAuth token and returns user info
func (m *AuthMiddleware) verifyGoogleToken(ctx context.Context, token string) (*GoogleUserInfo, error) {
	// Call Google's userinfo endpoint to verify token and get user info
	req, err := http.NewRequestWithContext(ctx, "GET", "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", "Bearer "+token)

	resp, err := m.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("invalid token: status %d", resp.StatusCode)
	}

	var userInfo GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}

// extractTokenFromHeader extracts the Bearer token from Authorization header
func extractTokenFromHeader(r *http.Request) string {
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return ""
	}

	// Expected format: "Bearer <token>"
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return ""
	}

	return parts[1]
}

// GetUserIDFromContext extracts the Google user ID from the request context
func GetUserIDFromContext(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(UserIDContextKey).(string)
	return userID, ok
}
