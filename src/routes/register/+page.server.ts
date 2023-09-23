import { fail, type Actions } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';


const registerUserSchema = z.object({
    full_name: z.string().max(140).nullish(),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    password_confirmation: z.string().min(6).max(100),
});



export const load = (async (event) => {
    return {
        form: superValidate(registerUserSchema),
    };
});

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, registerUserSchema);

        if (!form.valid) return fail(400, { form });

        if (form.data.password !== form.data.password_confirmation) {
            return setError(form, "password_confirmation", "Passwords don't match");
        }

        const { error: authError } = await event.locals.supabase.auth.signUp({
            email: form.data.email,
            password: form.data.password,
            options: {
                data: {
                    full_name: form.data.full_name ?? "",
                }
            }
        });

        if (authError) {
            return setError(form, null, "An error occurred while registering. Please try again later.");
        }

        return { form }
    }
};