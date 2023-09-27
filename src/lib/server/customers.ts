import { stripeCustomerSchema } from "$lib/schemas"
import type Stripe from "stripe"
import { stripe } from "./stripe"
import { supabaseAdmin } from "./supabase-admin"

export async function updateCustomerRecord(stripeCustomer: Stripe.Customer) {
	const customer = stripeCustomerSchema.parse(stripeCustomer)

	const { error } = await supabaseAdmin
		.from("billing_customers")
		.update(customer)
		.eq("id", stripeCustomer.id)

	if (error) throw error
}

export async function deleteCustomerRecord(stripeCustomer: Stripe.Customer) {
	const { error } = await supabaseAdmin
		.from("billing_customers")
		.delete()
		.eq("id", stripeCustomer.id)

	if (error) throw error
}

export async function getCustomerRecord(userId: string) {
	const { data: existingCustomer } = await supabaseAdmin
		.from("billing_customers")
		.select("*")
		.eq("user_id", userId)
		.limit(1)
		.single()
	if (existingCustomer) return existingCustomer

	const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
	if (userError || !(userData && userData.user.email)) {
		throw userError || new Error("User not found")
	}

	const stripeCustomer = await stripe.customers.create({
		email: userData.user.email,
		metadata: { userId: userId }
	})
	if (!stripeCustomer) throw new Error("Failed to create Stripe customer")

	const { error: newCustomerError, data: newCustomer } = await supabaseAdmin
		.from("billing_customers")
		.insert({
			id: stripeCustomer.id,
			user_id: userData.user.id,
			email: userData.user.email
		})
		.select("*")
		.single()
	if (newCustomerError) throw newCustomerError
	return newCustomer
}
