<script lang="ts">
	import ProductForm from "$lib/components/ProductForm.svelte";
	import type { Category, FormState, ProductInput } from "$lib/types";

	let {
		data,
		form,
	}: {
		data: { categories: Category[] };
		form: FormState | null;
	} = $props();

	const defaults = $derived<ProductInput>({
		slug: "",
		name: "",
		category: data.categories[0]?.id ?? "",
		price: 0,
		currency: "CUP",
		description: "",
		detail: "",
		ingredients: [],
		available: true,
	});

	const values = $derived(form?.values ?? defaults);
</script>

<svelte:head>
	<title>Nuevo producto · Delfines admin</title>
</svelte:head>

<div class="page-head">
	<div>
		<h1>Nuevo producto</h1>
		<p class="muted">Después de crearlo podrás subirle la foto.</p>
	</div>
	<a class="btn ghost" href="/productos">Volver</a>
</div>

<section class="panel">
	<ProductForm
		action="?/create"
		{values}
		errors={form?.errors ?? {}}
		categories={data.categories}
		submitLabel="Crear producto"
	/>
</section>
