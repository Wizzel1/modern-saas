<script lang="ts">
	import { Button, Card } from "flowbite-svelte";
	import { superForm } from "sveltekit-superforms/client";
	import type { PageData } from "./$types";
	export let data: PageData;
	const { form, errors, enhance } = superForm(data.form, {
		resetForm: true
	});
</script>

<div class="py-20">
	<div class="flex w-full flex-col items-center">
		<div class="max-w-2xl text-center">
			<h1 class="text-4xl font-semibold">Register for an account</h1>
		</div>
		<Card class="mt-6 w-full" padding="xl" size="md">
			<form method="POST" class="flex flex-col space-y-6" use:enhance>
				<label class="space-y-2" for="full_name">
					<span>Name</span>
					<input type="text" name="full_name" bind:value={$form.full_name} />
					{#if $errors.full_name}
						<span class="block text-red-600 dark:text-red-500">{$errors.full_name}</span>
					{/if}
				</label>
				<label class="space-y-2" for="email">
					<span>Email</span>
					<input type="email" name="email" bind:value={$form.email} />
					{#if $errors.email}
						<span class="block text-red-600 dark:text-red-500">{$errors.email}</span>
					{/if}
				</label>
				<label class="space-y-2" for="password">
					<span>Password</span>
					<input type="password" name="password" bind:value={$form.password} />
					{#if $errors.password}
						<span class="block text-red-600 dark:text-red-500">{$errors.password}</span>
					{/if}
				</label>
				<label class="space-y-2" for="passwordConfirm">
					<span>Confirm Password</span>
					<input type="password" name="passwordConfirm" bind:value={$form.passwordConfirm} />
					{#if $errors.passwordConfirm}
						<span class="block text-red-600 dark:text-red-500">{$errors.passwordConfirm}</span>
					{/if}
				</label>
				<Button type="submit" class="w-full">Register</Button>
				<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
					Already have an account? <a
						href="/login"
						class="text-blue-700 hover:underline dark:text-blue-500">Sign in</a>
				</div>
			</form>
		</Card>
	</div>
</div>
