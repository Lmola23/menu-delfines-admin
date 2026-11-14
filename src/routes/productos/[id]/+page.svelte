<script lang="ts">
	import ProductForm from "$lib/components/ProductForm.svelte";
	import {
		productToValues,
		type Category,
		type FormState,
		type Product,
	} from "$lib/types";

	let {
		data,
		form,
	}: {
		data: {
			product: Product;
			categories: Category[];
			saved: boolean;
			created: boolean;
		};
		form: FormState | null;
	} = $props();

	const product = $derived(data.product);
	const values = $derived(form?.values ?? productToValues(data.product));
</script>

<svelte:head>
	<title>{product.name} · Delfines admin</title>
</svelte:head>

<div class="page-head">
	<div>
		<h1>{product.name}</h1>
		<p class="muted">
			<code class="slug">{product.slug}</code>
			· {product.price} {product.currency}
			· {product.available ? "con stock" : "sin stock"}
		</p>
	</div>
	<a class="btn ghost" href="/productos">Volver</a>
</div>

{#if data.saved || data.created}
	<p class="alert ok" role="status">
		{data.created ? "Producto creado." : "Cambios guardados."}
	</p>
{/if}

{#if form?.message}
	<p class="alert" role="alert">{form.message}</p>
{/if}

<div class="detail-layout">
	<section>
		<ProductForm
			action="?/update"
			{values}
			errors={form?.errors ?? {}}
			categories={data.categories}
			submitLabel="Guardar cambios"
		/>
	</section>

	<aside class="side">
		<h2>Stock</h2>
		<p class="muted">
			{product.available
				? "El producto se muestra en el menú público."
				: "El producto está oculto en el menú público."}
		</p>

		<form method="POST" action="?/toggle" class="side-action">
			<input
				type="hidden"
				name="available"
				value={product.available ? "false" : "true"}
			/>
			<button class="btn full" type="submit">
				{product.available ? "Ocultar del menú" : "Mostrar en el menú"}
			</button>
		</form>

		<hr />

		<h2>Eliminar</h2>
		<p class="muted">Esta acción no se puede deshacer.</p>
		<form
			method="POST"
			action="?/delete"
			class="side-action"
			data-confirm={`¿Eliminar "${product.name}"?`}
		>
			<button class="btn full danger" type="submit">Eliminar producto</button>
		</form>
	</aside>
</div>
