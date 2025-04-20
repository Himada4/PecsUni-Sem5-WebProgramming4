// GET LIST OF ALL RECIPES
// ADD RECIPES

import { db } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

// GET method: Retrieve all recipes
export async function GET(event: RequestEvent) {
    try {
        // Query to get all recipes with title, description, and user_id
        const recipes = await db.all(
            `SELECT recipe_id, title, description, user_id, created_at FROM recipes`
        );

        // Return the recipes data as JSON
        return new Response(JSON.stringify(recipes), { status: 200 });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return new Response(
            JSON.stringify({ error: "Failed to fetch recipes" }),
            { status: 500 }
        );
    }
}