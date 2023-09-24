import { emailSchema, passwordSchema, profileSchema } from "$lib/schemas.js";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms/server";


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


export const actions: Actions = {
    updateProfile: async (event) => {
        const session = await event.locals.getSession();
        if (!session) { throw error(401, "Unauthorized"); }

        const profileForm = await superValidate(event, profileSchema, { id: "profile" });
        if (!profileForm.valid) { return fail(400, { profileForm }); }

        const { error: profileError } = await event.locals.supabase.from("profiles").update(profileForm.data).eq("id", session.user.id);
        if (profileError) {
            return setError(profileForm, "An error occurred while updating your profile.");
        }

        return { profileForm };
    },
    updateEmail: async (event) => {
        const session = await event.locals.getSession();
        if (!session) { throw error(401, "Unauthorized"); }

        const emailForm = await superValidate(event, emailSchema, { id: "email" });
        if (!emailForm.valid) { return fail(400, { emailForm }); }

        const { error: emailError } = await event.locals.supabase.auth.updateUser({ email: emailForm.data.email });
        if (emailError) {
            return setError(emailForm, "email", "An error occurred while updating your email.");
        }

        return { emailForm };
    },
    updatePasword: async (event) => {
        const session = await event.locals.getSession();
        if (!session) { throw error(401, "Unauthorized"); }

        const passwordForm = await superValidate(event, passwordSchema, { id: "email" });
        if (!passwordForm.valid) { return fail(400, { passwordForm: passwordForm }); }

        if (passwordForm.data.password !== passwordForm.data.passwordConfirm) {
            return setError(passwordForm, "passwordConfirm", "Passwords do not match");
        }

        const { error: passwordError } = await event.locals.supabase.auth.updateUser({ password: passwordForm.data.password });
        if (passwordError) {
            return setError(passwordForm, "An error occurred while updating your email.");
        }

        return { passwordForm: passwordForm };
    },
};