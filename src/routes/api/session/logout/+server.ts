// Backend logout endpoint (using SvelteKit)
import { cookies } from '@sveltejs/kit';

export async function POST() {
	// Clear the user_id cookie
	cookies.delete('user_id');

	return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
}
