import { ENV } from "$lib/server/env";
import { createSupabaseServerClient } from "@supabase/auth-helpers-sveltekit";
import type { Session } from "@supabase/supabase-js";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.supabase = createSupabaseServerClient({
        supabaseUrl: ENV.PUBLIC_SUPABASE_URL,
        supabaseKey: ENV.PUBLIC_SUPABASE_ANON_KEY,
        event,
    });

    event.locals.getSession = async (): Promise<Session | null> => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession();
        return session;
    };

    return resolve(event);
};