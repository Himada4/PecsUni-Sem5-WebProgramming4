# Food Recipe Sharing Website (University Project)

## Purpose of the Project

This small-scale project aims to create a platform for food lovers to share, discover, and manage their own culinary creations. It provides a platform where users can easily upload their favorite recipes, browse recipes shared by others, and build their personal collection of go-to dishes.

## Implementation

### Technology Stack

This project utilizes the following technologies:

* **Frontend Framework:** SvelteKit
* **Styling:** CSS
* **Backend:** Node.js 
* **Backend Language:** TypeScript 
* **Database/Data Storage:** SQLite
* **External Node.js Modules:**
    * **bcrypt:** Used for securely hashing user passwords for authentication.
    * **bbcode:** Used for parsing and rendering BBCode formatting in recipe descriptions.

### Routing

* `/`: The homepage, displaying a list of recipes made by the entire userbase.
* `/login`: Route for user login.
* `/recipe/{id}`: Displays the details of a specific recipe, where `{id}` is a dynamic parameter representing the recipe ID.
* `/recipe/add`: Route for adding a new recipe.
* `/register`: Route for user registration.
* `/user/{id}`: Displays the profile of a specific user, where `{id}` is a dynamic parameter representing the user ID.

### API Endpoints

* `recipes/[id]/+server.ts`:
    * `GET`: Retrieves recipe data for a specific recipe ID.
    * `PUT`: Edits an existing recipe.
    * `DELETE`: Deletes a recipe.
* `recipes/+server.ts`:
    * `GET`: Retrieves a list of all recipes.
    * `POST`: Adds a new recipe to the database.
* `session/login/+server.ts`:
    * `POST`: Sets a `user_id` cookie to manage user sessions after login.
* `session/logout/+server.ts`:
    * `POST`: Clears the `user_id` cookie, effectively logging the user out.
* `session/register/+server.ts`:
    * `POST`: Adds a new user to the database.
* `users/[id]/getUserRecipes/+server.ts`:
  * `GET`: Retrieves a list of recipes created by a specific user.
* `users/[id]/+server.ts`:
    * `GET`: Retrieves user data for a specific user ID.

### External API: Spoonacular

This project integrates with the [Spoonacular API](https://spoonacular.com/food-api) to retrieve recipe data. The following endpoints are used:

* `https://api.spoonacular.com/food/ingredients/search?apiKey=${apiKey}&query=${query}`: This endpoint searches the Spoonacular database for ingredient IDs based on a query.
* `https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${apiKey}&amount=${amt}${unit ? `&unit=${unit}` : ''}`: This endpoint retrieves detailed information about a specific ingredient, given its ID, including the amount and optional unit.

### External Node.js Modules

* **[bbcode](https://www.npmjs.com/package/bbcode):** This module is used for parsing and rendering BBCode formatted text. BBCode allows users to add simple formatting (like bold, italics, lists) to their recipe descriptions and instructions in a user-friendly way.

* **[bcrypt](https://www.npmjs.com/package/bcrypt):** This module provides cryptographic hash functions for securely hashing passwords. When users register, their passwords are not stored directly in the database but are instead transformed into irreversible hash values using bcrypt, significantly improving security.

### Structure of the Codebase (Simplified Overview)

* **`.env`:** Stores environment variables such as the Spoonacular API key. This is *NOT* part of the repository.
* **`src/lib/`:** This directory contains reusable modules and utilities for the frontend of the application:
    * **`assets/`:** Stores static assets like images (e.g., `logo.png`).
    * **`components/`:** Houses all the custom Svelte components that make up the user interface (e.g., `Navbar.svelte`, `RecipeCatalogItem.svelte`, `EditRecipeModal.svelte`, etc.).
    * **`databaseManagement/`:** Contains files related to the local SQLite database (`database.db`), including the database file itself and potentially TypeScript modules (`accessDB.ts`, `DBInterfaces.ts`) for interacting with it.
    * **`fontfamily/`:** Stores custom font files used for styling.
* **`src/routes/api/`:** This directory contains the server-side API endpoints.
    * **`recipes/`:** Manages recipe data (fetching lists, adding new recipes, retrieving, updating, and deleting specific recipes by `[id]`).
    * **`session/`:** Handles user authentication-related actions (login, logout, registration).
    * **`users/`:** Manages user data (fetching user profiles by `[id]`, fetching a user's recipes).
* `src/routes/` 
    * `/`: The homepage.
    * `/login`: User login page.
    * `/recipe/[id]`: Displays details for a specific recipe.
    * `/recipe/add`: Page for adding new recipes.
    * `/register`: User registration page.
    * `/user/[id]`: Displays user profiles.
    * `+layout.svelte` and `+layout.server.ts`: Define the overall application layout and server-side layout logic.
    * `+page.svelte` and `+page.server.ts` (in various subdirectories): Define the Svelte components and server-side logic for individual pages.


### Description of Components

This project utilizes several custom Svelte components to build the user interface:

* **`AddRecipeButton.svelte`:** A simple button located on the homepage (`/`) that, when clicked, navigates the user to the `/recipe/add` route, allowing them to create a new recipe.

* **`Background.svelte`:** This component is responsible for rendering the overall background of the website, providing a consistent visual theme across different pages.

* **`BccodeNoticePanel.svelte`:** This component displays a panel or section that teaches users how to use BBCode formatting when writing recipe descriptions or instructions, enhancing the richness of their content.

* **`EditRecipeModal.svelte`:** This component implements a modal (popup) that appears when a user wants to edit one of their existing recipes. It contains form fields to modify the recipe's details (title, description, ingredients, instructions, etc.) and handles the save/cancel actions.

* **`Navbar.svelte`:** This component renders the main navigation bar of the website, providing links to different sections such as the homepage, login, registration, and potentially user profiles.

* **`RecipeCatalogItem.svelte`:** This component is used to display a preview of a single recipe in a list format on the homepage (`/`). It likely shows key information like the recipe title, a thumbnail image, and perhaps a brief description.

* **`SearchBar.svelte`:** This component provides a search input field that allows users to search for recipes based on keywords. It likely interacts with an API endpoint to fetch and display search results.

* **`UserRecipeItem.svelte`:** This component is used to display a single recipe created by a specific user, particularly on the user's profile page (`/user/[id]`). It includes options for the logged-in user to edit or delete their own recipes.

### Description of Stored Data

The project utilizes an SQLite database (`database.db`) to store application data. The database schema consists of the following tables:

* **`users` Table:**
    * `user_id` (INTEGER PRIMARY KEY AUTOINCREMENT): A unique identifier for each user, automatically generated.
    * `username` (TEXT UNIQUE NOT NULL): The unique username chosen by the user.
    * `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP): The timestamp indicating when the user account was created, defaulting to the current time.

* **`auth` Table:**
    * `user_id` (INTEGER PRIMARY KEY): Foreign key referencing the `user_id` in the `users` table. This links the authentication information to a specific user.
    * `password_hash` (TEXT NOT NULL): A securely hashed version of the user's password.
    * `FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE`: This ensures that if a user is deleted from the `users` table, their corresponding authentication information is also deleted.

* **`recipes` Table:**
    * `recipe_id` (INTEGER PRIMARY KEY AUTOINCREMENT): A unique identifier for each recipe, automatically generated.
    * `user_id` (INTEGER): Foreign key referencing the `user_id` of the user who created the recipe in the `users` table.
    * `title` (TEXT NOT NULL): The title of the recipe.
    * `description` (TEXT NOT NULL): A brief description of the recipe.
    * `ingredients` (TEXT NOT NULL): A string containing the list of ingredients for the recipe. This is likely stored in a structured format (e.g., JSON) within the text field.
    * `instructions` (TEXT NOT NULL): The step-by-step instructions for preparing the recipe.
    * `thumbnail_url` (TEXT): An optional URL pointing to a thumbnail image for the recipe.
    * `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP): The timestamp indicating when the recipe was created, defaulting to the current time.
    * `FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE`: This ensures that if a user is deleted, all their associated recipes are also deleted.


#
#
#
#
#

# SV
Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.




