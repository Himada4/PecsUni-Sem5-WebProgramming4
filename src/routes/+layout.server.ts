import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
    const userId = cookies.get('user_id');

    return {
        loggedIn: !!userId,
        userId
    };
};
