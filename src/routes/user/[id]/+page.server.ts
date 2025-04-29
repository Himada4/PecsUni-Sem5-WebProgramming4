import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies, params }) => {
    const cookieUserId = cookies.get('user_id');     // who is logged in
    const pageUserId = params.id;                    // which page is visited (from the URL)

    const isOwner = cookieUserId === pageUserId;      // true if logged-in user is visiting their own page

    return { isOwner };
};
