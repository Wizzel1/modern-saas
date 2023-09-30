import { getCustomerBillingRecord } from "$lib/server/customers.js"
import { ENV } from "$lib/server/env"
import { stripe } from "$lib/server/stripe"
import { error, redirect } from "@sveltejs/kit"

export const GET = async (event) => {
    const session = await event.locals.getSession()
    if (!session) throw redirect(302, "/login")

    const customer = await getCustomerBillingRecord(session.user.id)
    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${ENV.PUBLIC_BASE_URL}/account`
    })

    if (!portalSession) throw error(500, "Error creating portal session")

    throw redirect(302, portalSession.url)
}
