// Retrieves specific user's data

import { db } from '$lib/databaseManagement/accessDB';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent) {
    const { id } = event.params;

    try {
        const data = await db.get("SELECT * FROM users WHERE user_id = ?", [id]);
        if (!data) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        console.error("Error fetching user data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch user data" }), { status: 500 });
    }

}
