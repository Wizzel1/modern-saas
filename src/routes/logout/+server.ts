import { error, redirect, type RequestHandler } from "@sveltejs/kit";


export const POST: RequestHandler = async (request) => {
    const { error: logoutError } = await request.locals.supabase.auth.signOut();

    if (logoutError) {
        throw error(500, "An error occurred while logging out.");
    }

    throw redirect(302, "/login");
};