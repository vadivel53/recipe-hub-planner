# Assumptions and Constraints

## Functional assumptions

- A single user has one active meal plan document (`MealPlan.user` unique).
- Bookmarks and ratings require authenticated users.
- Public visitors can browse published recipes only.
- Recipe moderation is simplified to role-based delete/view access via admin routes.

## Technical assumptions

- Backend runs on `http://localhost:5000`.
- Frontend runs on `http://localhost:5173`.
- Frontend API base URL defaults to `http://localhost:5000/api` unless overridden by `VITE_API_URL`.
- MongoDB is reachable via `MONGO_URI` in backend environment config.

## Security assumptions

- JWT secrets are provided per deployment and not committed to version control.
- Local storage token strategy is acceptable for this academic assignment scope.
- Password hashing uses bcrypt and is sufficient for assignment-level authentication.

## Non-goals for this submission

- No microservices decomposition (implemented as a modular monolith backend).
- No external object storage for image uploads (image URL field only).
- No automated test suite included in this baseline submission.
