# Database Schema (MongoDB + Mongoose)

## User

- Collection: `users`
- Purpose: authentication, profile, role, bookmarks
- Fields:
  - `name` (String, required)
  - `email` (String, required, unique)
  - `password` (String, required, hashed with bcrypt pre-save hook)
  - `role` (Enum: `user|admin`, default `user`)
  - `avatar` (String)
  - `bio` (String)
  - `bookmarks` (ObjectId[], refs `Recipe`)
  - timestamps (`createdAt`, `updatedAt`)

## Recipe

- Collection: `recipes`
- Purpose: publish and discover recipes
- Fields:
  - `title` (String, required)
  - `description` (String, required)
  - `ingredients` ([{ `name`, `quantity` }])
  - `steps` ([{ `stepNumber`, `instruction` }])
  - `category` (Enum, default `Other`)
  - `cookTime` (Number, required)
  - `servings` (Number, default 2)
  - `imageUrl` (String)
  - `author` (ObjectId, ref `User`, required)
  - `ratings` ([{ `user` ref `User`, `value` 1..5 }])
  - `isPublished` (Boolean, default true)
  - `tags` (String[])
  - timestamps
- Computed:
  - `avgRating` virtual field

## MealPlan

- Collection: `mealplans`
- Purpose: personal weekly meal planning
- Fields:
  - `user` (ObjectId, ref `User`, required, unique)
  - `weekLabel` (String, default `This Week`)
  - `meals` ([{ `day`, `mealType`, `recipe` ref `Recipe` }])
  - timestamps

## Relationship summary

- One `User` -> many `Recipe` (as `author`)
- One `User` -> one `MealPlan` (enforced by unique `user`)
- Many-to-many `User` <-> `Recipe` through `bookmarks`
- Many-to-many `User` <-> `Recipe` through `ratings` subdocuments
