import { emailSchema, passwordSchema, profileSchema } from "$lib/schemas.js";
import { error, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";


export const load = async (event) => {
    const session = await event.locals.getSession();

    if (!session) {
        throw redirect(302, "/login");
    }

    async function getUserProfile() {
        const { data: profile, error: profileError } = await event.locals.supabase
            .from("profiles")
            .select("*")
            .single();

        if (profileError) {
            throw error(500, "An error occurred while fetching your profile.");
        }

        return profile;
    }

    const profile = await getUserProfile();
    return {
        profileForm: superValidate(profile, profileSchema, { id: "profile" }),
        emailForm: superValidate({ email: session.user.email }, emailSchema, { id: "email" }),
        passwordForm: superValidate(passwordSchema, { id: "password" }),
    }
};