import type { registerUserSchema } from "$lib/schemas"
import { ENV } from "$lib/server/env"
import { supabaseAdmin } from "$lib/server/supabase-admin"
import * as faker from "@faker-js/faker"
import { execSync } from "child_process"
import detect from "detect-port"
import pg from "pg"
import type { z } from "zod"
export async function startSupabase() {
	const port = await detect(64337)

	if (port !== 64337) {
		return
	}
	execSync("npx supabase start")
}

export async function clearSupabaseData() {
	const client = new pg.Client({
		connectionString: ENV.SUPABASE_DB_URL
	})
	await client.connect()
	await client.query("TRUNCATE auth.users CASCADE")
}

type CreateUser = Omit<z.infer<typeof registerUserSchema>, "passwordConfirm">

export async function createUser(user: CreateUser) {
	const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
		email: user.email,
		password: user.password,
		options: {
			data: {
				full_name: user.full_name ?? "Test User"
			}
		}
	})

	await supabaseAdmin.auth.signOut()
	if (authError || !authData.user) {
		throw new Error("Error creating user")
	}
	return authData.user
}

export async function createContact(user_id: string) {
	const firstName = faker.fakerDE.person.firstName()
	const lastName = faker.fakerDE.person.lastName()
	const contact = {
		name: `${firstName} ${lastName}`,
		email: faker.fakerDE.internet.exampleEmail({ firstName, lastName }),
		company: faker.fakerDE.company.name(),
		phone: faker.fakerDE.phone.number(),
		user_id
	}

	const { error, data } = await supabaseAdmin.from("contacts").insert(contact)
	if (error) throw error
	return data
}
