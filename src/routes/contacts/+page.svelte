<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from "flowbite-svelte"
	import CreateContactModal from "./CreateContactModal.svelte"
	import DeleteContactsModal from "./DeleteContactsModal.svelte"

	export let data
	let createContactOpen = false
	let deleteContactOpen = false
	let contactToDelete: string

	function handleContactDelete(contact_id: string) {
		contactToDelete = contact_id
		deleteContactOpen = true
	}
</script>

<div class="py-20">
	<!-- Contacts Page Header -->
	<div class="flex w-full items-center justify-between pb-6">
		<h1 class="text-3xl">Contacts</h1>
		<Button on:click={() => (createContactOpen = true)} size="sm">New Contact</Button>
	</div>
	<!-- Contacts Table -->
	<Table shadow divClass="min-h-full">
		<TableHead>
			<TableHeadCell>Name</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell>Phone</TableHeadCell>
			<TableHeadCell>Company</TableHeadCell>
			<TableHeadCell />
		</TableHead>
		<TableBody>
			{#each data.contacts as contact, _i (contact.id)}
				<TableBodyRow>
					<TableBodyCell>{contact.name ?? "--"}</TableBodyCell>
					<TableBodyCell>{contact.email ?? "--"}</TableBodyCell>
					<TableBodyCell>{contact.phone ?? "--"}</TableBodyCell>
					<TableBodyCell>{contact.company ?? "--"}</TableBodyCell>
					<TableBodyCell>
						<Button class="dots-menu dark:text-white" vertical name="Contact Menu" />
						<Dropdown placement="left-start">
							<DropdownItem href="/contacts/{contact.id}">Edit</DropdownItem>
							<DropdownItem on:click={() => handleContactDelete(contact.id)} slot="footer"
								>Delete</DropdownItem>
						</Dropdown>
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</div>
<CreateContactModal bind:open={createContactOpen} data={data.createContactForm} />
<DeleteContactsModal
	bind:open={deleteContactOpen}
	data={data.deleteContactForm}
	contactId={contactToDelete}>
</DeleteContactsModal>
