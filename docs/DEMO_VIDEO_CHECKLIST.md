# Demonstration Video Checklist

Use this flow to record a complete prototype demonstration with clear voice-over, slower pace, and explicit tech-stack mention in each workflow.

## Voice-over quality standard (apply to entire video)

- Speak slowly: target ~120 words per minute
- Pause 1-2 seconds between workflow transitions
- State 3 items in each workflow intro: user goal, feature shown, tech stack used
- Use simple sentence pattern: "Action -> API call -> database/state update -> visible result"
- Keep cursor movements deliberate and avoid fast scrolling

## 1) Setup and startup

- Show repository structure (`backend`, `frontend`, `docs`)
- Show `backend/.env` creation from `backend/.env.example`
- Show `frontend/.env` creation from `frontend/.env.example`
- Start MongoDB (`docker compose up -d mongo`)
- Start backend (`npm start`) and frontend (`npm run dev`)
- Open app in browser and verify home page load
- Voice-over stack line: "This project uses React + Vite in frontend, Node + Express REST API in backend, and MongoDB with Mongoose for persistence."

## 2) User onboarding and authentication flow

- Register a new user
- Login as the newly created user
- Call out JWT token session behavior
- Logout and login again to show persistent authenticated state
- Voice-over stack line: "Authentication uses bcryptjs for password hashing and jsonwebtoken for token-based authorization, integrated through Express middleware."

## 3) Access control and role-based routing

- Login as normal user and attempt admin route (access blocked)
- Login as admin (`admin@recipehub.com`)
- Open admin dashboard successfully
- Show frontend route guard + backend role check concept
- Voice-over stack line: "Role-based access is protected in two layers: React route guards on UI and Express authorization middleware on API endpoints."

## 4) Recipe discovery and filtering workflow

- Browse recipe list on home page
- Search by keyword
- Filter by category or cook time
- Open recipe detail page
- Voice-over stack line: "This workflow uses React state for filter controls, Axios for API calls, and Express query handling to return filtered MongoDB records."

## 5) Recipe creation and edit workflow (CRUD)

- Create a new recipe with ingredients and steps
- Confirm new recipe appears in list/details
- Edit the same recipe and save
- Delete the recipe
- Voice-over stack line: "Recipe CRUD uses REST endpoints in Express, input validation via express-validator, and persistence with Mongoose models."

## 6) Recipe engagement workflow (rating + bookmarks)

- Rate a recipe (1-5 stars)
- Bookmark the recipe
- Open bookmarks page and verify it appears
- Unbookmark and verify removal
- Voice-over stack line: "User engagement features call protected APIs with JWT headers and update user-recipe relationship data in MongoDB."

## 7) Meal planner workflow (weekly planning)

- Add recipe to a specific day and meal slot
- Add another recipe to another slot
- Remove one slot
- Clear full planner
- Explain weekly grid UX outcome
- Voice-over stack line: "Meal planning is modeled as user-linked weekly entries in MongoDB and rendered in a React planner grid with live API synchronization."

## 8) Profile management workflow

- Open profile page
- Update name, bio, and avatar URL
- Save and refresh to prove persistence
- Voice-over stack line: "Profile updates are handled through authenticated user APIs, validated server-side, then reflected in React context and UI."

## 9) Admin operations workflow

- Open admin stats overview
- Show users list
- Delete one user (non-critical demo user)
- Show admin recipe management page
- Voice-over stack line: "Admin workflows reuse the same REST architecture with role-restricted endpoints and dashboard metrics fetched from aggregated MongoDB data."

## 10) API documentation and integration proof

- Open Swagger UI at `/api/docs`
- Execute one public endpoint and one protected endpoint
- Perform equivalent action in frontend and show matching backend behavior
- Voice-over stack line: "Swagger is generated with swagger-jsdoc and served by swagger-ui-express, proving contract-level API clarity."

## 11) Deployment proof section

- Show successful frontend production build (`npm run build`)
- Show backend start command and running API URL
- Show MongoDB service running
- Show final working app URL and one complete end-to-end action
- Voice-over stack line: "Deployment-ready stack is split frontend static build and backend Node service, connected through environment-configured API base URL."

## 12) Closing section

- Recap key workflows covered
- Recap integrated technologies
- Mention testing/smoke verification done
- Mention AI assistance areas and what was learned
- Share final hosted video link in submission
