import { createCheckoutSession } from "$lib/server/subscriptions"
import { error, redirect, type RequestHandler } from "@sveltejs/kit"

export const GET: RequestHandler = async (event) => {
	const session = await event.locals.getSession()

	if (!session) throw redirect(302, "/login")

	const price_id = event.url.searchParams.get("id")
	if (!price_id) throw error(400, "No price id provided")

	let checkoutUrl: string

	try {
		checkoutUrl = await createCheckoutSession(session.user.id, price_id)
	} catch (e) {
		console.log(error)
		throw error(500, "Error creating checkout session")
	}

	throw redirect(302, checkoutUrl)
}
