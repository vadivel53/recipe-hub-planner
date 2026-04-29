# API Documentation (Markdown)

This document provides a markdown API reference for RecipeHub.

- Base URL (local): `http://localhost:5000`
- Swagger UI (interactive): `http://localhost:5000/api/docs`
- API prefix: `/api`

## Authentication

Protected routes require Bearer token:

`Authorization: Bearer <jwt_token>`

### Auth Endpoints

#### POST `/api/auth/register`

Register a new user.

Request body:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "secret123"
}
```

Response `201`:

```json
{
  "_id": "user_id",
  "name": "Test User",
  "email": "test@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

#### POST `/api/auth/login`

Login user.

Request body:

```json
{
  "email": "admin@recipehub.com",
  "password": "admin123"
}
```

Response `200`: user profile + token.

#### GET `/api/auth/me` (Protected)

Get current authenticated user.

Response `200`: current user object.

## Recipes

#### GET `/api/recipes`

Get all published recipes (supports filters).

Query params:

- `category` (string)
- `search` (string)
- `maxCookTime` (number)

#### GET `/api/recipes/:id`

Get recipe detail by ID.

#### POST `/api/recipes` (Protected)

Create recipe.

Request body (sample):

```json
{
  "title": "Paneer Wrap",
  "description": "Quick wrap",
  "cookTime": 20,
  "category": "Lunch",
  "servings": 2,
  "ingredients": [{ "name": "Paneer", "quantity": "200g" }],
  "steps": [{ "stepNumber": 1, "instruction": "Cook and assemble" }],
  "tags": ["quick", "veg"]
}
```

#### PUT `/api/recipes/:id` (Protected; owner/admin)

Update recipe fields.

#### DELETE `/api/recipes/:id` (Protected; owner/admin)

Delete a recipe.

#### POST `/api/recipes/:id/rate` (Protected)

Rate recipe between 1 and 5.

Request body:

```json
{ "value": 5 }
```

#### GET `/api/recipes/admin/all` (Protected; admin)

Get all recipes including unpublished.

## Meal Planner

#### GET `/api/planner` (Protected)

Get current user meal plan.

#### POST `/api/planner/add` (Protected)

Add/replace meal in a specific day + slot.

Request body:

```json
{
  "day": "Monday",
  "mealType": "Dinner",
  "recipeId": "recipe_object_id"
}
```

#### DELETE `/api/planner/remove` (Protected)

Remove meal by day + slot.

Request body:

```json
{
  "day": "Monday",
  "mealType": "Dinner"
}
```

#### DELETE `/api/planner/clear` (Protected)

Clear all meals in current user's plan.

## Users

#### PUT `/api/users/profile` (Protected)

Update profile.

Request body (sample):

```json
{
  "name": "Priya S",
  "bio": "Home cook",
  "avatar": "https://example.com/avatar.png"
}
```

#### POST `/api/users/bookmarks/:recipeId` (Protected)

Toggle bookmark for a recipe.

#### GET `/api/users/bookmarks` (Protected)

Get all bookmarked recipes.

#### GET `/api/users/my-recipes` (Protected)

Get current user's recipes.

## Admin

#### GET `/api/users/admin/stats` (Protected; admin)

Get dashboard statistics.

#### GET `/api/users/admin/users` (Protected; admin)

Get all users.

#### DELETE `/api/users/admin/users/:id` (Protected; admin)

Delete user by ID.

## Common Error Responses

- `400` Validation error / bad request
- `401` Unauthorized (missing/invalid token)
- `403` Forbidden (role restriction)
- `404` Resource not found
- `500` Internal server error
