import { db } from '$lib/databaseManagement/accessDB';
import bcrypt from 'bcrypt';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const { username, password } = await request.json();

		if (!username?.trim() || !password?.trim()) {
			return new Response(JSON.stringify({ message: 'Missing username or password' }), { status: 400 });
		}

		const user = await db.get(
			`SELECT u.user_id, a.password_hash
			 FROM users u
			 JOIN auth a ON u.user_id = a.user_id
			 WHERE u.username = ?`,
			username
		);

		if (!user) {
			return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
		}

		const isValid = await bcrypt.compare(password, user.password_hash);
		if (!isValid) {
			return new Response(JSON.stringify({ message: 'Invalid username or password' }), { status: 401 });
		}

		cookies.set('user_id', user.user_id.toString(), {
			path: '/',
			httpOnly: true,
			// sameSite: 'strict',
			sameSite: 'lax',
			secure: true
		});

		return new Response(JSON.stringify({ message: 'Login successful!' }), { status: 200 });

	} catch (error) {
		console.error('Login error:', error);
		return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
	}
};
