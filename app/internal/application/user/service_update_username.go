package user

import (
	"context"
	"fmt"
	"regexp"
	"strings"
)

// UpdateUsername updates a user's username (requires authentication and uniqueness check)
func (s *Service) UpdateUsername(ctx context.Context, userID, username string) error {
	// Validate username format
	if err := validate(username); err != nil {
		return err
	}

	exists, err := s.firestoreSvc.IsUsernameExists(ctx, username)
	if err != nil {
		return fmt.Errorf("failed to check username availability: %w", err)
	}
	if exists {
		return fmt.Errorf("username '%s' is already taken", username)
	}

	// Get existing user
	existingUser, err := s.firestoreSvc.GetUser(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get user: %w", err)
	}

	// Update username
	existingUser.Username = username
	return s.firestoreSvc.UpdateUser(ctx, existingUser)
}

func validate(u string) error {
	// Remove leading/trailing whitespace
	u = strings.TrimSpace(u)

	// Check length (1-30 characters)
	if len(u) < 1 || len(u) > 30 {
		return fmt.Errorf("username must be between 1 and 30 characters")
	}

	v := regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)
	if !v.MatchString(u) {
		return fmt.Errorf("username can only contain letters, numbers, underscores, and hyphens")
	}

	if strings.HasPrefix(u, "_") || strings.HasPrefix(u, "-") ||
		strings.HasSuffix(u, "_") || strings.HasSuffix(u, "-") {
		return fmt.Errorf("username cannot start or end with underscore or hyphen")
	}

	return nil
}
