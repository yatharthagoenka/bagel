package handler

import (
	"encoding/json"
	"net/http"
	"strings"

	"app/internal/application/user"
	"app/internal/handler/api"
	"app/internal/pkg/auth"
)

type Handler struct {
	userSvc        *user.Service
	authMiddleware *auth.AuthMiddleware
}

func NewHandler(u *user.Service, authMiddleware *auth.AuthMiddleware) *Handler {
	return &Handler{
		userSvc:        u,
		authMiddleware: authMiddleware,
	}
}

type HandlerResponse struct {
	Data   interface{} `json:"data,omitempty"`
	Error  string      `json:"error,omitempty"`
	Status int         `json:"-"`
}

func (h *Handler) WrapHandler(handler func(*http.Request) HandlerResponse) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		response := handler(r)

		w.Header().Set("Content-Type", "application/json")
		if response.Status == 0 {
			response.Status = http.StatusOK
		}
		w.WriteHeader(response.Status)
		json.NewEncoder(w).Encode(response)
	}
}

func (h *Handler) HandleUserPublicData(r *http.Request) HandlerResponse {
	if r.Method != http.MethodGet {
		return HandlerResponse{
			Error:  "method not allowed",
			Status: http.StatusMethodNotAllowed,
		}
	}
	return h.getUserPublicData(r, r.URL.Query().Get("username"))
}

func (h *Handler) HandleUser(r *http.Request) HandlerResponse {
	switch r.Method {
	case http.MethodGet:
		return h.withAuth(r, h.getUser)
	case http.MethodPut:
		return h.withAuth(r, h.updateUser)
	default:
		return HandlerResponse{
			Error:  "method not allowed",
			Status: http.StatusMethodNotAllowed,
		}
	}
}

func (h *Handler) HandleInit(r *http.Request) HandlerResponse {
	if r.Method != http.MethodPost {
		return HandlerResponse{
			Error:  "method not allowed",
			Status: http.StatusMethodNotAllowed,
		}
	}
	return h.withAuth(r, h.initUser)
}

func (h *Handler) getUserPublicData(r *http.Request, username string) HandlerResponse {
	if username == "" {
		return HandlerResponse{
			Error:  "username is required",
			Status: http.StatusBadRequest,
		}
	}
	u, err := h.userSvc.GetUserPublicData(r.Context(), username)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return HandlerResponse{
				Error:  "user not found",
				Status: http.StatusNotFound,
			}
		}
		return HandlerResponse{
			Error:  err.Error(),
			Status: http.StatusInternalServerError,
		}
	}
	return HandlerResponse{
		Data: api.GetUserPublicDataResponse{
			Username: u.Username,
			Links:    u.Links,
		},
	}
}

func (h *Handler) getUser(r *http.Request, userID string) HandlerResponse {
	u, err := h.userSvc.GetUserMetadata(r.Context(), userID)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			return HandlerResponse{
				Error:  "user not found",
				Status: http.StatusNotFound,
			}
		}
		return HandlerResponse{
			Error:  err.Error(),
			Status: http.StatusInternalServerError,
		}
	}
	return HandlerResponse{
		Data: api.GetUserResponse{User: u},
	}
}

func (h *Handler) updateUser(r *http.Request, userID string) HandlerResponse {
	var req api.UpdateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return HandlerResponse{
			Error:  "invalid JSON body",
			Status: http.StatusBadRequest,
		}
	}

	if req.Username != nil {
		if err := h.userSvc.UpdateUsername(r.Context(), userID, *req.Username); err != nil {
			return HandlerResponse{
				Error:  err.Error(),
				Status: http.StatusInternalServerError,
			}
		}
	}

	if req.Links != nil {
		if err := h.userSvc.UpdateUserLinks(r.Context(), userID, *req.Links); err != nil {
			return HandlerResponse{
				Error:  err.Error(),
				Status: http.StatusInternalServerError,
			}
		}
	}

	u, err := h.userSvc.GetUserMetadata(r.Context(), userID)
	if err != nil {
		return HandlerResponse{
			Error:  err.Error(),
			Status: http.StatusInternalServerError,
		}
	}

	return HandlerResponse{
		Data: api.UpdateUserResponse{User: u},
	}
}

func (h *Handler) initUser(r *http.Request, userID string) HandlerResponse {
	var req api.InitUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return HandlerResponse{
			Error:  "invalid JSON body",
			Status: http.StatusBadRequest,
		}
	}

	if err := h.userSvc.CreateUserFromAuth(r.Context(), userID, req.Email, req.Name); err != nil {
		return HandlerResponse{
			Error:  err.Error(),
			Status: http.StatusInternalServerError,
		}
	}

	u, err := h.userSvc.GetUserMetadata(r.Context(), userID)
	if err != nil {
		return HandlerResponse{
			Error:  err.Error(),
			Status: http.StatusInternalServerError,
		}
	}

	return HandlerResponse{
		Data: api.InitUserResponse{User: u},
	}
}

func (h *Handler) withAuth(r *http.Request, handler func(*http.Request, string) HandlerResponse) HandlerResponse {
	userID, ok := h.extractAuthenticatedUser(r)
	if !ok {
		return HandlerResponse{
			Error:  "unauthorized",
			Status: http.StatusUnauthorized,
		}
	}
	return handler(r, userID)
}

func (h *Handler) extractAuthenticatedUser(r *http.Request) (string, bool) {
	var userID string
	var authenticated bool

	h.authMiddleware.RequireAuth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if id, ok := auth.GetUserIDFromContext(r.Context()); ok {
			userID = id
			authenticated = true
		}
	})).ServeHTTP(&discardResponseWriter{}, r)

	return userID, authenticated
}

type discardResponseWriter struct{}

func (d *discardResponseWriter) Header() http.Header        { return make(http.Header) }
func (d *discardResponseWriter) Write([]byte) (int, error)  { return 0, nil }
func (d *discardResponseWriter) WriteHeader(statusCode int) {}
