//Get recipe data of specific ID

import { db } from '$lib/databaseManagement/accessDB';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const { id } = event.params;
    try {

        const recipe = await db.get("SELECT * FROM recipes WHERE recipe_id = ?", [id]);


        if (!recipe) return new Response(JSON.stringify({ error: "Recipe not found" }), { status: 404 });

        return new Response(JSON.stringify(recipe), { status: 200 });

    } catch (error) {
        console.error("Error fetching recipe ID(" + id + "): ", error);
        return new Response(JSON.stringify({ error: "Failed to fetch recipe" }), { status: 500 });
    }
}
