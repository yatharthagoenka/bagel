package handler

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"app/internal/application/pinboard"
	"app/internal/domain/firestore"
	"app/internal/handler/api"
)

type Handler struct {
	pinboardSvc *pinboard.Service
}

func NewHandler(p *pinboard.Service) *Handler {
	return &Handler{
		pinboardSvc: p,
	}
}

// HandlerResponse represents a unified response structure
type HandlerResponse struct {
	Data   interface{} `json:"data,omitempty"`
	Error  string      `json:"error,omitempty"`
	Status int         `json:"-"`
}

func (h *Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var response HandlerResponse

	switch r.URL.Path {
	case "/pin":
		response = h.handlePin(r)
	default:
		response = HandlerResponse{
			Error:  "not found",
			Status: http.StatusNotFound,
		}
	}

	w.Header().Set("Content-Type", "application/json")
	if response.Status == 0 {
		response.Status = http.StatusOK
	}
	w.WriteHeader(response.Status)
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) handlePin(r *http.Request) HandlerResponse {
	switch r.Method {
	case http.MethodPost:
		var req api.CreatePinRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			return HandlerResponse{
				Error:  "invalid JSON body",
				Status: http.StatusBadRequest,
			}
		}

		if err := h.createPin(r.Context(), req); err != nil {
			return HandlerResponse{
				Error:  err.Error(),
				Status: http.StatusInternalServerError,
			}
		}
		return HandlerResponse{
			Status: http.StatusCreated,
		}
	case http.MethodGet:
		pins, err := h.getAllPins(r.Context())
		if err != nil {
			return HandlerResponse{
				Error:  err.Error(),
				Status: http.StatusInternalServerError,
			}
		}
		return HandlerResponse{
			Data: api.GetAllPinsResponse{Pins: pins},
		}
	default:
		return HandlerResponse{
			Error:  "method not allowed",
			Status: http.StatusMethodNotAllowed,
		}
	}
}

func (h *Handler) createPin(ctx context.Context, req api.CreatePinRequest) error {
	if req.Message == "" {
		return errors.New("message is required")
	}

	if err := h.pinboardSvc.AddPin(ctx, &firestore.PinboardRecord{
		Message: req.Message,
	}); err != nil {
		return err
	}

	return nil
}

func (h *Handler) getAllPins(ctx context.Context) ([]*firestore.PinboardRecord, error) {
	pins, err := h.pinboardSvc.GetAllPins(ctx)
	if err != nil {
		return nil, err
	}
	return pins, nil
}
