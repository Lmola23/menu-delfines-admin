<script lang="ts">
	import type { Category, ProductInput } from "$lib/types";

	interface Props {
		action: string;
		values: ProductInput;
		errors?: Record<string, string>;
		categories: Category[];
		submitLabel?: string;
		cancelHref?: string;
	}

	let {
		action,
		values,
		errors = {},
		categories,
		submitLabel = "Guardar",
		cancelHref = "/productos",
	}: Props = $props();
</script>

<form method="POST" {action} class="form">
	{#if errors.general}
		<p class="alert" role="alert">{errors.general}</p>
	{/if}

	<div class="grid">
		<label class="field">
			<span>Slug / archivo</span>
			<input
				name="slug"
				value={values.slug}
				required
				pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
				placeholder="croquetas-jamon"
				autocomplete="off"
			/>
			{#if errors.slug}<small class="error">{errors.slug}</small>{/if}
			<small class="hint">Debe coincidir con el archivo en src/assets, sin extensión.</small>
		</label>

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

	<div class="form-actions">
		<button class="btn primary" type="submit">{submitLabel}</button>
		<a class="btn ghost" href={cancelHref}>Cancelar</a>
	</div>
</form>
