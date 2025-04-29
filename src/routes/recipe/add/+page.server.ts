import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ cookies }) => {
    const userIdString = cookies.get('user_id');
    const userId = userIdString ? Number(userIdString) : undefined;

    return { userId };
};
