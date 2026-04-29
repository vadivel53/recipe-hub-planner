# 🍴 RecipeHub — Community Recipe & Meal Planner

A full-stack web application where users can share, discover, rate, and plan meals using community-contributed recipes.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Axios, React Hot Toast, React Icons |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Validation | express-validator |
| API Docs | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| Styling | Custom CSS Modules (warm editorial design system) |

---

## 📁 Project Structure

```
recipe-hub/
├── backend/
│   ├── src/
│   │   ├── config/       → db.js, swagger.js
│   │   ├── middleware/   → auth.middleware.js
│   │   ├── models/       → User.js, Recipe.js, MealPlan.js
│   │   └── routes/       → auth, recipe, planner, user routes
│   ├── seed.js           → Database seeder
│   ├── .env              → Environment variables
│   └── package.json
│
└── frontend/
    └── src/
        ├── api/          → axios.js, auth.js, recipes.js, users.js
        ├── components/   → RecipeCard, ProtectedRoute, Navbar, Footer
        ├── context/      → AuthContext.jsx
        ├── pages/        → Home, Login, Register, RecipeDetail, RecipeForm,
        │                   MealPlanner, Profile, Bookmarks, AdminDashboard
        └── App.jsx       → Routes configuration
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB (local) or MongoDB Atlas URI
- Docker Desktop (optional, recommended for quick local MongoDB)

---

## 🐳 Quick MongoDB Setup (Docker)

If you do not have MongoDB installed locally:

```bash
docker compose up -d mongo
```

This starts MongoDB on `127.0.0.1:27017` with database name `recipe_hub`.

---

## 🚀 Setup & Running

## ⚡ Quick Start (Local)

```bash
# from project root
docker compose up -d mongo

# backend (terminal 1)
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev

# frontend (terminal 2)
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Swagger: `http://localhost:5000/api/docs`

---

### 1. Backend

```bash
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed
# Default MongoDB: mongodb://127.0.0.1:27017/recipe_hub

# Seed the database with sample data
npm run seed

# Start the backend server
npm start
# or for development with hot reload:
npm run dev
```

Backend runs on: **http://localhost:5000**
API Docs (Swagger): **http://localhost:5000/api/docs**

### 2. Frontend

```bash
cd frontend
npm install
# Optional API override
cp .env.example .env
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 📚 Assignment Deliverables Pack

Submission artifacts are organized in `docs/`:

- `docs/CONSOLIDATED_SUBMISSION.md` (Points 1, 2, 4)
- `docs/SUBMISSION_READY_DOCUMENT.md` (rubric/marks + LMS-ready checklist)
- `docs/API_DOCUMENTATION.md` (Markdown API reference)
- `docs/DELIVERABLES.md`
- `docs/ARCHITECTURE.md`
- `docs/DB_SCHEMA.md`
- `docs/COMPONENT_HIERARCHY.md`
- `docs/ASSUMPTIONS.md`
- `docs/AI_USAGE_LOG_AND_REFLECTION.md`
- `docs/DEMO_VIDEO_CHECKLIST.md`

---

## 🚢 Deployment Procedure

### Option A: Local Deployment (Recommended for evaluation)

1. Start MongoDB:
   - Local MongoDB service, or
   - `docker compose up -d mongo`
2. Deploy backend locally:
   - `cd backend`
   - `cp .env.example .env`
   - Update `MONGO_URI` and `JWT_SECRET`
   - `npm install`
   - `npm run seed` (first time)
   - `npm start`
3. Deploy frontend locally:
   - `cd frontend`
   - `cp .env.example .env`
   - Set `VITE_API_URL=http://localhost:5000/api`
   - `npm install`
   - `npm run build` (production check)
   - `npm run dev` (or serve static build with preferred hosting)

### Option B: Cloud Deployment (Frontend + Backend split)

#### 1) Backend deployment (Render/Railway/any Node host)

- Create a backend service from `backend/`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables:
  - `PORT=5000` (or provider default)
  - `MONGO_URI=<your_mongodb_atlas_uri>`
  - `JWT_SECRET=<secure_secret>`
- Confirm Swagger is reachable at `<backend-url>/api/docs`

#### 2) Frontend deployment (Vercel/Netlify/any static host)

- Deploy from `frontend/`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable:
  - `VITE_API_URL=<backend-url>/api`
- Redeploy and validate login + planner + admin flows

### Post-deployment smoke test checklist

- Open frontend URL and load home page
- Register/login works
- Create recipe works
- Add to meal planner works
- Swagger API docs open successfully

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@recipehub.com | admin123 |
| User | user@recipehub.com | user123 |
| User | marco@recipehub.com | user123 |

---

## ✨ Features

### User Features
- **Browse & Discover** — View all published recipes with search and filters (category, cook time, keyword)
- **Recipe Detail** — Full recipe view with ingredients, step-by-step instructions, author info
- **Rate Recipes** — Give 1–5 star ratings; average displayed on cards
- **Bookmark Recipes** — Save favourite recipes to your personal bookmarks
- **Add to Meal Planner** — Schedule any recipe to a specific day and meal type
- **Weekly Meal Planner** — Visual 7-day grid with Breakfast / Lunch / Dinner / Snack slots
- **Create Recipes** — Rich form with ingredients list builder and step builder
- **Edit / Delete Own Recipes** — Full CRUD for user's own content
- **User Profile** — View and edit name, bio, avatar; see all your published recipes

### Admin Features
- **Admin Dashboard** — Stats overview (users, total/published recipes)
- **Manage All Users** — View and delete any user
- **Manage All Recipes** — View, delete any recipe on the platform

### System
- **JWT Authentication** — Secure token-based auth with 7-day expiry
- **Role-Based Access Control** — User vs Admin routes protected both on frontend and backend
- **Input Validation** — express-validator on all POST routes
- **Swagger API Docs** — All endpoints documented at `/api/docs`
- **Responsive Design** — Mobile-friendly layout with hamburger nav

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /register | Register new user | No |
| POST | /login | Login | No |
| GET | /me | Get current user | Yes |

### Recipes (`/api/recipes`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | / | List recipes (search, filter) | No |
| GET | /:id | Get single recipe | No |
| POST | / | Create recipe | Yes |
| PUT | /:id | Update recipe | Yes (owner/admin) |
| DELETE | /:id | Delete recipe | Yes (owner/admin) |
| POST | /:id/rate | Rate a recipe | Yes |
| GET | /admin/all | All recipes (admin) | Admin |

### Meal Planner (`/api/planner`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | / | Get user's meal plan | Yes |
| POST | /add | Add meal to plan | Yes |
| DELETE | /remove | Remove meal from plan | Yes |
| DELETE | /clear | Clear entire plan | Yes |

### Users (`/api/users`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| PUT | /profile | Update profile | Yes |
| POST | /bookmarks/:id | Toggle bookmark | Yes |
| GET | /bookmarks | Get bookmarked recipes | Yes |
| GET | /my-recipes | Get own recipes | Yes |
| GET | /admin/stats | Dashboard stats | Admin |
| GET | /admin/users | All users | Admin |
| DELETE | /admin/users/:id | Delete user | Admin |

---

## 🗄️ Data Models

### User
```
name, email, password (hashed), role (user|admin),
avatar, bio, bookmarks[]
```

### Recipe
```
title, description, ingredients[{name, quantity}],
steps[{stepNumber, instruction}], category, cookTime,
servings, imageUrl, author, ratings[{user, value}],
isPublished, tags[]
```

### MealPlan
```
user, weekLabel,
meals[{day, mealType, recipe}]
```

---

## 🎨 Design System

The UI uses a warm, editorial design language:
- **Fonts**: Playfair Display (headings) + DM Sans (body)
- **Palette**: Cream, parchment, saffron, bark, sage, terracotta
- **Components**: CSS Modules with custom design tokens
