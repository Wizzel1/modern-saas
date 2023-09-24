import { clearSupabaseData, createUser, startSupabase } from "./utils";

async function seed() {
    try {
        await startSupabase();
        await clearSupabaseData();
        await createUser({
            email: "t@t.com",
            full_name: "Test user",
            password: "password",
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
    process.exit(0);
}

seed();