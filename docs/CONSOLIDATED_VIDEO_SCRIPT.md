# Consolidated Demonstration Video Script

Use this as a single continuous narration script for the final demo recording.

## Target duration

- 12 to 15 minutes total
- Speaking pace: slow and clear (~120 words/minute)
- Pause 1-2 seconds between sections

## Recording setup before you start

- Keep three terminals ready:
  - Terminal 1: project root (docker)
  - Terminal 2: `backend/`
  - Terminal 3: `frontend/`
- Keep browser ready with:
  - App URL: `http://localhost:5173`
  - Swagger URL: `http://localhost:5000/api/docs`

## 0:00 - 1:10 | Introduction + architecture

### On-screen actions

- Show project root with `backend`, `frontend`, and `docs`.

### Voice-over

"Hello, this is the consolidated demonstration of RecipeHub, a full-stack community recipe and meal planner platform.

In this video, I will show setup, authentication, recipe management, bookmarks, meal planner, admin workflows, API proof, and deployment proof in one end-to-end flow.

The frontend is built using React with Vite and React Router.
The backend uses Node.js with Express REST APIs.
The database is MongoDB with Mongoose ODM.
Authentication uses JWT and bcryptjs.
API documentation is integrated using Swagger."

## 1:10 - 2:20 | Environment + service startup

### On-screen actions

- Show `.env` from `backend/.env.example`.
- Show `.env` from `frontend/.env.example`.
- Run:
  - `docker compose up -d mongo`
  - backend: `npm start`
  - frontend: `npm run dev`
- Open app home page.

### Voice-over

"Now I am starting the full stack locally.
MongoDB runs through Docker Compose.
Backend runs on port 5000.
Frontend runs on port 5173.

This startup flow demonstrates environment-based configuration and local deployment readiness."

## 2:20 - 3:40 | User registration and login

### On-screen actions

- Register a new user.
- Login with that user.
- Logout and login again.

### Voice-over

"I am now demonstrating user onboarding.
First, I register a new user account.
Next, I log in and verify successful authentication.
Then I log out and log in again to show stable session behavior.

Technically, passwords are hashed using bcryptjs.
JWT tokens are issued after login and used for protected API access through authorization headers."

## 3:40 - 4:30 | Role-based access control

### On-screen actions

- As normal user, attempt admin route and show restriction.
- Login as admin `admin@recipehub.com`.
- Open admin dashboard.

### Voice-over

"Now I am validating role-based access control.
As a normal user, admin routes are restricted.
After logging in as admin, the dashboard is accessible.

This is protected in two layers:
frontend route guards and backend role authorization middleware."

## 4:30 - 6:10 | Recipe discovery + CRUD

### On-screen actions

- Browse recipes on home.
- Search/filter recipes.
- Open details page.
- Create recipe.
- Edit the same recipe.
- Delete the same recipe.

### Voice-over

"This section covers recipe lifecycle.
I begin with discovery using search and filters.
Then I open recipe detail for full metadata.

Next, I create a new recipe with ingredients and steps.
I update the same recipe to demonstrate edit workflow.
Finally, I delete it to complete CRUD.

Under the hood, frontend calls Axios APIs, backend uses Express route handlers, input is validated with express-validator, and data is persisted via Mongoose models."

## 6:10 - 7:10 | Rating and bookmarks

### On-screen actions

- Rate a recipe.
- Bookmark recipe.
- Open bookmarks page.
- Remove bookmark.

### Voice-over

"Now I demonstrate user engagement workflows.
I rate a recipe and then bookmark it.
In bookmarks page, we can see personalized saved content.
I also remove the bookmark to confirm toggle behavior.

These are protected user actions and require JWT-authenticated requests."

## 7:10 - 8:30 | Weekly meal planner

### On-screen actions

- Add recipe to day and meal slot.
- Add another slot.
- Remove one slot.
- Clear all planner entries.

### Voice-over

"This is the weekly meal planner workflow.
I add recipes into specific day and meal-type slots.
Then I remove one slot and clear all entries.

The planner data is stored per user in MongoDB and synchronized with the React planner grid through REST endpoints."

## 8:30 - 9:30 | Profile management

### On-screen actions

- Open profile.
- Update name, bio, avatar URL.
- Save and refresh.

### Voice-over

"Here I am updating profile details including name, bio, and avatar URL.
After saving, I refresh to verify persistence.

This confirms authenticated profile update APIs and frontend state refresh behavior."

## 9:30 - 10:50 | Admin operations

### On-screen actions

- Open admin stats.
- Open users list.
- Delete one demo user.
- Open admin recipes view.

### Voice-over

"Now I demonstrate admin capabilities.
Admin can view platform-level statistics, manage users, and monitor recipes.
I am deleting one non-critical demo user to show administrative moderation flow.

These endpoints are role-restricted and accessible only to admin accounts."

## 10:50 - 12:00 | Swagger API proof + frontend/backend mapping

### On-screen actions

- Open `http://localhost:5000/api/docs`.
- Execute one public API.
- Execute one protected API.
- Do matching action from frontend.

### Voice-over

"This section proves API integration.
I open Swagger documentation and execute one public endpoint and one protected endpoint.
Then I perform the corresponding frontend action to show end-to-end consistency.

Swagger here is generated using swagger-jsdoc and served with swagger-ui-express."

## 12:00 - 13:00 | Deployment proof

### On-screen actions

- Show frontend production build output (`npm run build`).
- Show backend running.
- Show MongoDB container running.
- Show one complete working user action in app.

### Voice-over

"Now I am showing deployment readiness.
Frontend production build completes successfully.
Backend service is running and connected to MongoDB.
I perform one full user action to verify the system is operational after deployment steps."

## 13:00 - 14:00 | Closing statement

### Voice-over

"To conclude, this demo covered full user and admin workflows including authentication, role-based access, recipe CRUD, ratings, bookmarks, meal planning, profile updates, API documentation, and deployment proof.

The integrated technology stack is React plus Vite, Node plus Express, MongoDB plus Mongoose, JWT authentication, and Swagger API docs.

Thank you. I will include the final hosted video link in the submission."

## Quick checklist before final export

- Audio is clear and no background noise
- Pace is slow and understandable
- Every workflow includes stack mention
- Cursor movement is stable and readable
- Browser zoom is readable (100% to 125%)
- Final video link uploaded and accessible
