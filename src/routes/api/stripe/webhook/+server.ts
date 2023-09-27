import { ENV } from "$lib/server/env"
import { deleteProductRecord, upsertProductRecord } from "$lib/server/products"
import { stripe } from "$lib/server/stripe"
import { json, type RequestHandler } from "@sveltejs/kit"
import type Stripe from "stripe"

export const POST: RequestHandler = async (event) => {
	const stripeSignature = event.request.headers.get("stripe-signature")
	if (!stripeSignature) {
		return json("Unauthorized", { status: 401 })
	}

	const body = await event.request.text()
	let stripeEvent: Stripe.DiscriminatedEvent

	try {
		stripeEvent = stripe.webhooks.constructEvent(
			body,
			stripeSignature,
			ENV.STRIPE_SIGNING_SECRET
		) as Stripe.DiscriminatedEvent
	} catch (error) {
		return json("Invalid signature", { status: 401 })
	}

	try {
		switch (stripeEvent.type) {
			case "product.created":
			case "product.updated":
				await upsertProductRecord(stripeEvent.data.object)
				break
			case "product.deleted":
				await deleteProductRecord(stripeEvent.data.object)
				break
			case "customer.updated":
				console.log("customer updated", stripeEvent)
				break
			case "customer.deleted":
				console.log("Customer deleted", stripeEvent)
				break
			case "customer.subscription.created":
				console.log("Customer Subscription created", stripeEvent)
				break
			case "customer.subscription.updated":
				console.log("Customer Subscription updated", stripeEvent)
				break
			case "customer.subscription.deleted":
				console.log("Customer Subscription deleted", stripeEvent)
				break
			case "customer.subscription.trial_will_end":
				console.log("Customer Subscription trial will end", stripeEvent)
				break
			default:
				console.warn(`Unhandled event type: ${stripeEvent.type}`)
				return json({ received: true }, { status: 200 })
		}
	} catch (e) {
		console.log(e)
		return json(`Error processing event ${stripeEvent.type}`, { status: 500 })
	}

	return json({ received: true }, { status: 200 })
}
