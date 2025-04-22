import bcrypt from 'bcrypt';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


const dbPath = "src/lib/database.db"
const dbPromise = open({
	filename: dbPath,  // Path to your SQLite database file
	driver: sqlite3.Database,
});

export async function POST({ request }) {
	try {
		const data = await request.json();
		const { username, password } = data;

		// Simple validation
		if (!username || !password) {
			return new Response(JSON.stringify({ message: 'Missing username or password.' }), {
				status: 400
			});
		}

		// Open the database
		const db = await dbPromise;

		// Check if the username already exists in the database
		const existingUser = await db.get('SELECT user_id FROM users WHERE username = ?', username);
		if (existingUser) {
			return new Response(JSON.stringify({ message: 'Username already exists.' }), {
				status: 409
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert the new user into the "users" table
		const result = await db.run('INSERT INTO users (username) VALUES (?)', username);

		// Insert the hashed password into the "auth" table
		const userId = result.lastID; // Get the last inserted user_id
		await db.run('INSERT INTO auth (user_id, password_hash) VALUES (?, ?)', userId, hashedPassword);

		// Respond with a success message
		return new Response(JSON.stringify({ message: 'User registered successfully!' }), {
			status: 201
		});

	} catch (error) {
		console.error('Registration error:', error);
		return new Response(JSON.stringify({ message: 'Internal server error.' }), {
			status: 500
		});
	}
}
