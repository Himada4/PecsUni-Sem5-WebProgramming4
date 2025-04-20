import type {RequestEvent} from "@sveltejs/kit";
import {db} from "$lib/db";


export async function GET(event: RequestEvent) {
    try {
        // Fetch all users as an example. You can adjust this to fetch from any table.
        const data = await db.all("SELECT * FROM users");

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
    }
}

export async function POST(event: RequestEvent) {
    try {
        const data = await event.request.json();

        // Insert new user
        await db.run(
            `INSERT INTO users (username, email, total_score) VALUES (?, ?, ?)`,
            data.username,
            data.email,
            data.total_score ?? 0 // fallback if not provided
        );

        return new Response(JSON.stringify({ success: true }), { status: 201 });

    } catch (error) {
        console.error("Error posting data:", error);
        return new Response(JSON.stringify({ error: "Failed to post user" }), { status: 500 });
    }
}
/*
export async function POST(event: RequestEvent){
    let data = await event.request.json();
    await db.run("INSERT INTO tasks (task, status) VALUES (?, ?)", data.task, "todo");
    return new Response(JSON.stringify(data), {status: 200});
}


export async function DELETE(event: RequestEvent){
    let id = event.url.searchParams.get("id");
    await db.run("DELETE FROM tasks WHERE id = ?", id);
    return new Response("", {status: 200});

}

export async function PATCH(event: RequestEvent){
    let id = event.url.searchParams.get("id");
    await db.run(`UPDATE tasks SET status = CASE WHEN tasks.status = "done" THEN "todo" ELSE "done" END WHERE id = ?`, id);
    return new Response("", {status: 200});
}
*/