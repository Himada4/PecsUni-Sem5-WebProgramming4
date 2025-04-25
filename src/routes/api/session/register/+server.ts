//Adds new user
import bcrypt from 'bcrypt';
import { db } from '$lib/databaseManagement/accessDB'

export async function POST({ request }) {
	try {
		const data = await request.json();
		const { username, password } = data;

		if (!username || !password) return new Response(JSON.stringify({ message: 'Missing username or password.' }), {	status: 400 });

		const existingUser = await db.get('SELECT user_id FROM users WHERE username = ?', username);

		if (existingUser)	return new Response(JSON.stringify({ message: 'Username already exists.' }), { status: 409 });

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await db.run('INSERT INTO users (username) VALUES (?)', username);

		const userId = result.lastID;
		await db.run('INSERT INTO auth (user_id, password_hash) VALUES (?, ?)', userId, hashedPassword);

		return new Response(JSON.stringify({ message: 'User registered successfully!' }), {	status: 201	});

	} catch (error) {
		console.error('Registration error:', error);
		return new Response(JSON.stringify({ message: 'Internal server error.' }), {
			status: 500
		});
	}
}
