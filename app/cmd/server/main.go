package main

import (
	"context"
	"log"

	"app/internal/pkg/config"
)

func main() {
	ctx := context.Background()

	app, err := config.ReadFromEnv()
	if err != nil {
		log.Fatalf("Failed to read app config: %v", err)
	}

	server, err := NewServer(ctx, app)
	if err != nil {
		log.Fatalf("failed to create server: %v", err)
	}

	log.Fatal(server.Serve())
}
