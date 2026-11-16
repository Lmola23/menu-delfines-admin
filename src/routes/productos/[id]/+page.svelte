<script lang="ts">
	import ProductForm from "$lib/components/ProductForm.svelte";
	import { priceValue } from "$lib/price";
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
			apiUrl: string;
			saved: boolean;
			created: boolean;
			foto: string;
			fotoError: string;
		};
		form: FormState | null;
	} = $props();

	const product = $derived(data.product);
	const values = $derived(form?.values ?? productToValues(data.product));
</script>

<svelte:head>
	<title>{product.name}</title>
</svelte:head>

<div class="page-head">
	<div>
		<h1>{product.name}</h1>
		<p class="muted">
			{priceValue(product.price, product.detail)} {product.currency}
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

{#if data.foto === "ok"}
	<p class="alert ok" role="status">Foto actualizada.</p>
{/if}

{#if data.foto === "error" && data.fotoError}
	<p class="alert" role="alert">{data.fotoError}</p>
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
		<section class="photo-block">
			<h2>Foto</h2>
			{#if product.imageUrl}
				<img
					class="photo-preview"
					src={product.imagePreviewUrl ?? product.imageUrl}
					alt={product.name}
					width="430"
					height="430"
					loading="lazy"
					decoding="async"
				/>
			{:else}
				<div class="photo-empty">Sin foto</div>
			{/if}

			<form
				method="POST"
				action={`${data.apiUrl}/api/products/${product.id}/image`}
				enctype="multipart/form-data"
				class="side-action photo-form"
			>
				<input
					type="hidden"
					name="return"
					value={`/productos/${product.id}`}
				/>
				<label class="field">
					<span>{product.imageUrl ? "Reemplazar foto" : "Subir foto"}</span>
					<input
						type="file"
						name="image"
						accept="image/jpeg,image/png,image/webp,image/avif"
						required
					/>
				</label>
				<button class="btn full" type="submit">
					{product.imageUrl ? "Cambiar foto" : "Subir foto"}
				</button>
			</form>

			{#if product.imageUrl}
				<form
					method="POST"
					action={`${data.apiUrl}/api/products/${product.id}/image`}
					enctype="multipart/form-data"
					class="side-action"
				>
					<input
						type="hidden"
						name="return"
						value={`/productos/${product.id}`}
					/>
					<input type="hidden" name="remove" value="1" />
					<button class="btn full danger" type="submit">Quitar foto</button>
				</form>
			{/if}

			<p class="hint">
				La foto se sube directo al API. ImageKit genera las versiones
				optimizadas para la carta.
			</p>
		</section>

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
