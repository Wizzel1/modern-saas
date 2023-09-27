import { freePrice, lookupKeys } from "$lib/config.js"
import { priceListSchema } from "$lib/schemas.js"
import { stripe } from "$lib/server/stripe.js"
import { z } from "zod"

const intervalSchema = z.enum(["month", "year"]).catch("month")

export const load = async (event) => {
	const interval = intervalSchema.parse(event.url.searchParams.get("interval"))

	const stripePrices = await stripe.prices.list({
		expand: ["data.product"],
		recurring: { interval },
		lookup_keys: [...lookupKeys]
	})

	const prices = priceListSchema
		.parse(stripePrices.data)
		.sort((a, b) => a.unit_amount - b.unit_amount)

	return {
		prices: [freePrice, ...prices],
		interval
	}
}
