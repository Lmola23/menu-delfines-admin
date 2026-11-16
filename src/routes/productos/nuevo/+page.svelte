<script lang="ts">
	import ProductForm from "$lib/components/ProductForm.svelte";
	import type { Category, ProductInput } from "$lib/types";

	let {
		data,
	}: {
		data: { categories: Category[]; apiUrl: string; error: string };
	} = $props();

	const values = $derived<ProductInput>({
		name: "",
		category: data.categories[0]?.id ?? "",
		price: 0,
		currency: "CUP",
		description: "",
		detail: "",
		ingredients: [],
		available: true,
	});
</script>

<svelte:head>
	<title>Nuevo producto</title>
</svelte:head>

<div class="page-head">
	<div>
		<h1>Nuevo producto</h1>
		<p class="muted">Puedes subir la foto ahora o después desde la ficha.</p>
	</div>
	<a class="btn ghost" href="/productos">Volver</a>
</div>

{#if data.error}
	<p class="alert" role="alert">{data.error}</p>
{/if}

<section class="panel">
	<ProductForm
		action={`${data.apiUrl}/api/products`}
		enctype="multipart/form-data"
		showPhoto
		{values}
		categories={data.categories}
		submitLabel="Crear producto"
	/>
</section>
