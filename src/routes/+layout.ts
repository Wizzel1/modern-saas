import { ENV } from '$lib/server/env';
import type { Database } from '$lib/supabase-types';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = (async ({ fetch, data, depends }) => {
    depends('supabase:auth')

    const supabase = createSupabaseLoadClient<Database>({
        supabaseUrl: ENV.PUBLIC_SUPABASE_URL,
        supabaseKey: ENV.PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data.session,
    });

    const { data: { session } } = await supabase.auth.getSession();

    return {
        supabase,
        session,
    };
});