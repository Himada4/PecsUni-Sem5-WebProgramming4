//Get recipe data of specific ID
//Delete recipe data of specific ID
//Edit recipe data of specific ID

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

export async function DELETE(event: RequestEvent) {
    const { id } = event.params;

    try {
        const recipe = await db.get("SELECT * FROM recipes WHERE recipe_id = ?", [id]);
        if (!recipe) return new Response(JSON.stringify({ error: "Recipe not found" }), { status: 404 });

        await db.run("DELETE FROM recipes WHERE recipe_id = ?", [id]);

        return new Response(JSON.stringify({ message: "Recipe deleted successfully" }), { status: 200 });

    } catch (error) {
        console.error("Error deleting recipe ID(" + id + "):", error);
        return new Response(JSON.stringify({ error: "Failed to delete recipe" }), { status: 500 });
    }
}

export async function PUT(event: RequestEvent) {
    const { id } = event.params;
    const data = await event.request.json();

    try {
        const existingRecipe = await db.get("SELECT * FROM recipes WHERE recipe_id = ?", [id]);

        if (!existingRecipe) return new Response(JSON.stringify({ error: "Recipe not found" }), { status: 404 });

        await db.run(`
            UPDATE recipes
            SET 
                title = ?, 
                description = ?, 
                ingredients = ?, 
                instructions = ?, 
                thumbnail_url = ?, 
                created_at = ?
            WHERE recipe_id = ?`,
          [data.title, data.description, data.ingredients, data.instructions, data.thumbnail_url, data.created_at, id]
        );

        return new Response(JSON.stringify({ message: "Recipe updated successfully" }), { status: 200 });

    } catch (error) {
        console.error("Error updating recipe ID(" + id + "):", error);
        return new Response(JSON.stringify({ error: "Failed to update recipe" }), { status: 500 });
    }
}

