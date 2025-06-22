.PHONY: test build vet run

test:
	go test ./...

build:
	go build -o bin/server ./cmd/server

vet:
	go vet ./...

run:
	go run ./cmd/server
