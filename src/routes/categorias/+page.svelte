<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
	import { flip } from "svelte/animate";
	import {
		dragHandle,
		dragHandleZone,
		type DndEvent,
	} from "svelte-dnd-action";

	import type { Category, CategoryFormState } from "$lib/types";

	let {
		data,
		form,
	}: {
		data: { categories: Category[] };
		form: CategoryFormState | null;
	} = $props();

	let localItems = $state<Category[] | null>(null);
	const items = $derived(localItems ?? data.categories);
	let reorderForm = $state<HTMLFormElement | null>(null);
	let orderInput = $state<HTMLInputElement | null>(null);
	let saving = $state(false);
	let reorderStatus = $state("");
	let reorderError = $state("");

	const flipDurationMs = 180;

	// Al crear o renombrar, el load devuelve el orden del servidor y se
	// descarta cualquier orden local pendiente.
	$effect(() => {
		data.categories;
		localItems = null;
	});

	function handleConsider(event: CustomEvent<DndEvent<Category>>) {
		localItems = event.detail.items;
	}

	function handleFinalize(event: CustomEvent<DndEvent<Category>>) {
		localItems = event.detail.items;
		saveOrder(event.detail.items);
	}

	function saveOrder(nextItems: Category[] = items) {
		if (!reorderForm || !orderInput || saving) return;
		orderInput.value = nextItems.map((category) => category.id).join(",");
		saving = true;
		reorderError = "";
		reorderStatus = "Guardando orden…";
		reorderForm.requestSubmit();
	}

	const reorderEnhance: SubmitFunction = () => async ({ result }) => {
		saving = false;

		if (result.type === "success") {
			reorderStatus = "Orden guardado.";
			reorderError = "";
			return;
		}

		// Si falla, se descarta el orden local y se vuelve al que tenía el
		// servidor antes de arrastrar.
		localItems = null;
		reorderStatus = "";
		const message =
			result.type === "failure" ? result.data?.message : undefined;
		reorderError =
			typeof message === "string"
				? message
				: result.type === "error"
					? "No se pudo conectar con el servidor."
					: "No se pudo guardar el orden.";
	};
</script>

<svelte:head>
	<title>Categorías</title>
</svelte:head>

<div class="category-page">
	<div class="page-head">
		<div>
			<h1>Categorías</h1>
			<p class="muted">Solo el nombre y el orden. Arrastra desde el asa.</p>
		</div>
	</div>

	{#if form?.message}
		<p class="alert" class:ok={form.success} role="alert">{form.message}</p>
	{/if}

	<form method="POST" action="?/create" use:enhance class="category-create">
		<label class="field">
			<span>Nueva categoría</span>
			<input
				name="label"
				value={!form?.values?.id ? (form?.values?.label ?? "") : ""}
				placeholder="Postres"
				required
				autocomplete="off"
			/>
			{#if !form?.values?.id && form?.errors?.label}
				<small class="error">{form.errors.label}</small>
			{/if}
		</label>
		<button class="btn primary" type="submit">Agregar categoría</button>
	</form>

	{#if items.length === 0}
		<p class="empty">Todavía no hay categorías.</p>
	{:else}
		<ul
			class="category-list"
			use:dragHandleZone={{
				items,
				flipDurationMs,
				delayTouchStart: true,
				dragDisabled: saving,
			}}
			onconsider={handleConsider}
			onfinalize={handleFinalize}
			aria-label="Categorías"
		>
			{#each items as category, index (category.id)}
				<li
					class="category-row"
					animate:flip={{ duration: flipDurationMs }}
					aria-label={category.label}
				>
					<button
						type="button"
						class="drag-handle"
						use:dragHandle
						aria-label={`Mover ${category.label}`}
						title="Arrastrar para cambiar el orden"
					>
						<svg
							viewBox="0 0 24 24"
							fill="currentColor"
							aria-hidden="true"
						>
							<circle cx="9" cy="6" r="1.5"></circle>
							<circle cx="15" cy="6" r="1.5"></circle>
							<circle cx="9" cy="12" r="1.5"></circle>
							<circle cx="15" cy="12" r="1.5"></circle>
							<circle cx="9" cy="18" r="1.5"></circle>
							<circle cx="15" cy="18" r="1.5"></circle>
						</svg>
					</button>

					<span class="category-position" aria-hidden="true">{index + 1}</span>

					<form method="POST" action="?/update" use:enhance class="category-edit">
						<input type="hidden" name="id" value={category.id} />
						<input
							name="label"
							value={category.label}
							required
							autocomplete="off"
							aria-label={`Nombre de ${category.label}`}
						/>
						<button class="btn small" type="submit">Guardar</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}

	<p
		class="category-status"
		class:error={reorderError.length > 0}
		role="status"
		aria-live="polite"
	>
		{reorderError || reorderStatus}
	</p>

	<form
		method="POST"
		action="?/reorder"
		use:enhance={reorderEnhance}
		bind:this={reorderForm}
		hidden
	>
		<input type="hidden" name="order" bind:this={orderInput} />
	</form>
</div>
