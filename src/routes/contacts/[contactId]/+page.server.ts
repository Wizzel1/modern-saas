import { createContactSchema } from "$lib/schemas.js"
import { error, fail, redirect } from "@sveltejs/kit"
import { setError, superValidate } from "sveltekit-superforms/server"

///Load function for the contact page
export const load = async (event) => {
	///Redirect to login if session is null
	const session = await event.locals.getSession()
	if (!session) throw redirect(302, "/login")

	async function getContact(contactId: string) {
		const { data: contact, error: contactError } = await event.locals.supabase
			.from("contacts")
			.select("*")
			.eq("id", contactId)
			.maybeSingle()

		if (contactError) throw error(500, "Error fetching contact")
		if (!contact) throw error(404, "Contact not found")

		return contact
	}

	const contact = await getContact(event.params.contactId)
	return {
		updateContactForm: superValidate(contact, createContactSchema)
	}
}

///Actions for the updateContact form
export const actions = {
	updateContact: async (event) => {
		///Redirect to login if session is null
		const session = await event.locals.getSession()
		if (!session) throw error(401, "Unauthorized")

		const updateContactForm = await superValidate(event, createContactSchema)
		if (!updateContactForm.valid) return fail(400, { updateContactForm })

		const { error: updateContactError } = await event.locals.supabase
			.from("contacts")
			.update(updateContactForm.data)
			.eq("id", event.params.contactId)
			.single()

		if (updateContactError) return setError(updateContactForm, "Error updating contact")

		return { updateContactForm }
	}
}
