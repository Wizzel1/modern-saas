import type { Database } from "$lib/supabase-types.ts"
import type { Session, SupabaseClient } from "@supabase/supabase-js"

declare global {
	///<reference types="stripe-event-types" />
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			getSession(): Promise<Session | null>
		}
		interface PageData {
			session: Session | null
		}
		// interface Error {}
		// interface Platform {}
	}
}
export {}
