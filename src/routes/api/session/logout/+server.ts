export async function POST({ cookies }) {

	cookies.delete('user_id', { path: '/' });

	return new Response(JSON.stringify({ message: 'Logged out successfully' }), { status: 200 });
}
