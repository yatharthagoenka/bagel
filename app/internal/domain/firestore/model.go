package firestore

type PinboardRecord struct {
	Message string `json:"message"`
}

// User is all metadata on a user - created when user first logs in with Google
type User struct {
	ID        string `json:"id" firestore:"id"`             // Google OAuth user ID
	Username  string `json:"username" firestore:"username"` // Custom username for public URL
	Email     string `json:"email" firestore:"email"`       // From Google OAuth
	Name      string `json:"name" firestore:"name"`         // From Google OAuth
	Links     []Link `json:"links" firestore:"links"`       // User's links
	CreatedAt int64  `json:"created_at" firestore:"created_at"`
	UpdatedAt int64  `json:"updated_at" firestore:"updated_at"`
}

// Link represents a single link in the user's link tree
type Link struct {
	Title string `json:"title" firestore:"title"`
	URL   string `json:"url" firestore:"url"`
	Order int    `json:"order" firestore:"order"` // For ordering links
}
