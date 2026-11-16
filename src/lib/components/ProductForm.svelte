<script lang="ts">
	import type { Category, ProductInput } from "$lib/types";

	interface Props {
		action: string;
		values: ProductInput;
		errors?: Record<string, string>;
		categories: Category[];
		submitLabel?: string;
		cancelHref?: string;
		enctype?: "application/x-www-form-urlencoded" | "multipart/form-data";
		showPhoto?: boolean;
	}

	let {
		action,
		values,
		errors = {},
		categories,
		submitLabel = "Guardar",
		cancelHref = "/productos",
		enctype,
		showPhoto = false,
	}: Props = $props();
</script>

<form method="POST" {action} {enctype} class="form">
	{#if errors.general}
		<p class="alert" role="alert">{errors.general}</p>
	{/if}

	<div class="grid">
		<label class="field">
			<span>Nombre</span>
			<input name="name" value={values.name} required />
			{#if errors.name}<small class="error">{errors.name}</small>{/if}
		</label>

		<label class="field">
			<span>Categoría</span>
			<select name="category" required>
				{#each categories as category (category.id)}
					<option value={category.id} selected={values.category === category.id}>
						{category.label}
					</option>
				{/each}
			</select>
			{#if errors.category}<small class="error">{errors.category}</small>{/if}
		</label>

		<label class="field">
			<span>Moneda</span>
			<input name="currency" value={values.currency} maxlength="3" required />
			{#if errors.currency}<small class="error">{errors.currency}</small>{/if}
		</label>

		<label class="field">
			<span>Precio</span>
			<input
				name="price"
				type="number"
				min="0"
				step="1"
				value={values.price}
				required
			/>
			{#if errors.price}<small class="error">{errors.price}</small>{/if}
			<small class="hint">La API ordena por precio dentro de cada categoría.</small>
			<small class="hint">
				Si el plato tiene dos raciones, escribe en el detalle los dos precios así:
				“Ración de 5: 1100 CUP. Ración de 10: 2200 CUP.” El menú mostrará
				1100-2200 CUP.
			</small>
		</label>

		<label class="field check">
			<input type="checkbox" name="available" checked={values.available} />
			<span>Disponible (con stock)</span>
		</label>
	</div>

	<label class="field">
		<span>Descripción corta</span>
		<textarea name="description" rows="2" value={values.description}></textarea>
	</label>

	<label class="field">
		<span>Detalle</span>
		<textarea name="detail" rows="3" value={values.detail}></textarea>
	</label>

	<label class="field">
		<span>Ingredientes / detalles (uno por línea)</span>
		<textarea
			name="ingredients"
			rows="5"
			value={values.ingredients.join("\n")}
		></textarea>
	</label>

	{#if showPhoto}
		<label class="field">
			<span>Foto (opcional)</span>
			<input
				type="file"
				name="image"
				accept="image/jpeg,image/png,image/webp,image/avif"
			/>
			<small class="hint">
				Puedes subirla ahora o después desde la ficha del producto.
			</small>
		</label>
	{/if}

	<div class="form-actions">
		<button class="btn primary" type="submit">{submitLabel}</button>
		<a class="btn ghost" href={cancelHref}>Cancelar</a>
	</div>
</form>
