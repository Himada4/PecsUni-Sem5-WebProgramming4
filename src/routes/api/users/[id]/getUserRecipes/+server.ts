// RETRIEVE ALL USER'S RECIPES

import { db } from '$lib/db';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const { id } = event.params;

    try {
        const recipes = await db.all(`SELECT recipe_id, title, description, user_id, created_at FROM recipes WHERE user_id = ?`, [id]);

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




