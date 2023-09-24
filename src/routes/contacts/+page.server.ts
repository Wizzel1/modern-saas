import { createContactSchema } from '$lib/schemas.js';
import { error, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export const load = async (event) => {
    const session = await event.locals.getSession();
    if (!session) throw redirect(302, '/login');


    async function getContacts() {
        const { data: contacts, error: contactsError } =
            await event.locals.supabase
                .from('contacts')
                .select('*').limit(10);

        if (contactsError) {
            throw error(500, "Error fetching contacts");
        }

        return contacts;
    }


    return {
        createContactForm: superValidate(createContactSchema),
        contacts: getContacts()
    }

};

