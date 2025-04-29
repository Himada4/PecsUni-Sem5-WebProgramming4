import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies, params }) => {
    const cookieUserId = cookies.get('user_id');
    const pageUserId = params.id;

    const isOwner = cookieUserId === pageUserId;

    return { isOwner };
};
