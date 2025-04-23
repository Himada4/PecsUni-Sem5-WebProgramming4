// Get full recipe list
// Add new recipe

import { db } from '$lib/databaseManagement/accessDB';

export async function GET() {
    try {
        const recipes = await db.all(`SELECT recipe_id, title, description, user_id, created_at FROM recipes`);
        return new Response(JSON.stringify(recipes), { status: 200 });
    } catch (error) {
        console.error("Error fetching full recipe list:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch full recipe list" }),{ status: 500 });
    }
}

export async function POST({ request }) {
    //TODO: Before adding new recipe, make sure they are logged in.
    try {
        const data = await request.json();
        const { user_id, title, description, ingredients, instructions, thumbnail_url} = data;

        if (!user_id || !title || !description || !ingredients || !instructions)
            return new Response(JSON.stringify({ message: 'Missing Field on recipe' }), {status: 400});

        const existingRecipeBySameUser = await db.get('SELECT recipe_id FROM recipes WHERE title = ? AND user_id = ?', title, user_id);

        if (existingRecipeBySameUser) return new Response(JSON.stringify({ message: 'Same user cannot have duplicate recipe dish titles.' }), {status: 409});

        await db.run('INSERT INTO recipes (user_id, title, description, ingredients, instructions, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?)',
          user_id, title, description, ingredients, instructions, thumbnail_url);

        return new Response(JSON.stringify({ message: 'New recipe registered successfully!' }), { status: 201 });

    } catch (error) {
        console.error("Error fetching full recipe list:", error);
    }
}