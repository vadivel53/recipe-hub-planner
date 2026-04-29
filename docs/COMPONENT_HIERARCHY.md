# Frontend Component Hierarchy

## Route-level hierarchy

```text
App
├─ AuthProvider
├─ BrowserRouter
│  ├─ Navbar
│  ├─ Routes
│  │  ├─ / -> Home
│  │  ├─ /login -> Login
│  │  ├─ /register -> Register
│  │  ├─ /recipes/:id -> RecipeDetail
│  │  ├─ /recipes/new -> ProtectedRoute -> RecipeForm
│  │  ├─ /recipes/:id/edit -> ProtectedRoute -> RecipeForm
│  │  ├─ /planner -> ProtectedRoute -> MealPlanner
│  │  ├─ /profile -> ProtectedRoute -> Profile
│  │  ├─ /bookmarks -> ProtectedRoute -> Bookmarks
│  │  └─ /admin -> ProtectedRoute(adminOnly) -> AdminDashboard
│  └─ Footer
└─ Toaster
```

## Shared and reusable components

- `ProtectedRoute` enforces authentication and optional admin access.
- `RecipeCard` is reused for recipe listing and discovery flows.
- `Navbar` and `Footer` provide app-wide navigation and branding.

## Frontend service modules

- `api/axios.js`: configured Axios instance + auth interceptors
- `api/auth.js`: login/register/current user APIs
- `api/recipes.js`: recipe CRUD and rating APIs
- `api/users.js`: profile, bookmarks, and admin APIs
