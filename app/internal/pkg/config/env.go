package config

import (
	"fmt"
	"strings"

	"github.com/kelseyhightower/envconfig"
)

type FirestoreConfig struct {
	UserCollection string `envconfig:"BAGEL_FS_USER_COLLECTION" required:"true"`
}

type App struct {
	Port            string          `envconfig:"BAGEL_APP_PORT" required:"true"`
	GCPProjectID    string          `envconfig:"BAGEL_GCP_PROJECT_ID" required:"true"`
	FirestoreConfig FirestoreConfig `required:"true"`
}

func ReadFromEnv() (*App, error) {
	var app App
	if err := envconfig.Process("", &app); err != nil {
		return nil, fmt.Errorf("process envconfig: %w", err)
	}

	// Ensure port has colon prefix
	if !strings.HasPrefix(app.Port, ":") {
		app.Port = ":" + app.Port
	}

	return &app, nil
}
