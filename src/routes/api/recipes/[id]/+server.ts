// +server.ts in api/recipes/[id].ts

import { db } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const { id } = event.params;

    try {
        // Fetch the recipe based on the recipeId
        const recipe = await db.get("SELECT * FROM recipes WHERE recipe_id = ?", [id]);

        if (!recipe) {
            return new Response(JSON.stringify({ error: "Recipe not found" }), { status: 404 });
        }

        // Return the recipe details
        return new Response(JSON.stringify(recipe), { status: 200 });
    } catch (error) {
        console.error("Error fetching recipe:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch recipe" }), { status: 500 });
    }
}
