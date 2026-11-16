<script lang="ts">
	import type { FormState, ProductSummary } from "$lib/types";

	type Estado = "todos" | "disponibles" | "agotados";

	let {
		data,
		form,
	}: {
		data: {
			products: ProductSummary[];
			totals: { todos: number; disponibles: number; agotados: number };
			filter: Estado;
			query: string;
		};
		form: FormState | null;
	} = $props();

	const filters = $derived([
		{ id: "todos", label: "Todos", count: data.totals.todos, href: "/productos" },
		{
			id: "disponibles",
			label: "Disponibles",
			count: data.totals.disponibles,
			href: "/productos?estado=disponibles",
		},
		{
			id: "agotados",
			label: "Sin stock",
			count: data.totals.agotados,
			href: "/productos?estado=agotados",
		},
	]);

	const visibleCount = $derived(
		data.products.filter((product) => product.matches).length,
	);
	const defaultLabel = $derived(
		`${data.totals.todos} en total · ${data.totals.disponibles} con stock`,
	);
	const scopeLabel = $derived(
		data.filter === "disponibles"
			? " con stock"
			: data.filter === "agotados"
				? " sin stock"
				: "",
	);
	const countLabel = $derived(
		data.query
			? `${visibleCount} ${visibleCount === 1 ? "resultado" : "resultados"}${scopeLabel}`
			: defaultLabel,
	);
	const clearHref = $derived(
		data.filter === "todos" ? "/productos" : `/productos?estado=${data.filter}`,
	);
</script>

<svelte:head>
	<title>Productos</title>
</svelte:head>

<div class="products-page" data-search-root>
	<div class="page-head">
		<div>
			<h1>Productos</h1>
			<p
				class="muted"
				data-search-count
				data-default-label={defaultLabel}
				data-scope-label={scopeLabel}
			>
				{countLabel}
			</p>
		</div>
	</div>

	{#if form?.message}
		<p class="alert" role="alert">{form.message}</p>
	{/if}

	<form class="search" method="GET" action="/productos" role="search">
		{#if data.filter !== "todos"}
			<input type="hidden" name="estado" value={data.filter} />
		{/if}

		<label class="sr-only" for="admin-search">Buscar producto</label>
		<input
			id="admin-search"
			data-search-input
			type="search"
			name="q"
			value={data.query}
			placeholder="Buscar producto o categoría"
			autocomplete="off"
			enterkeyhint="search"
		/>

		<button
			class="search-submit"
			data-search-submit
			type="submit"
			aria-label="Buscar"
			hidden={data.query.length > 0}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="7"></circle>
				<path d="m16.5 16.5 4 4" stroke-linecap="round"></path>
			</svg>
		</button>

		<a
			class="search-clear"
			data-search-clear
			href={clearHref}
			aria-label="Limpiar búsqueda"
			hidden={data.query.length === 0}
		>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path d="M6 6l12 12M18 6 6 18" stroke-linecap="round"></path>
			</svg>
		</a>
	</form>

	<nav
		class="filters"
		data-filters
		aria-label="Filtrar productos"
		hidden={data.query.length > 0}
	>
		{#each filters as item (item.id)}
			<a
				class="chip"
				class:active={data.filter === item.id}
				href={item.href}
				aria-current={data.filter === item.id ? "page" : undefined}
			>
				{item.label} ({item.count})
			</a>
		{/each}
	</nav>

	<p class="sr-only" role="status" aria-live="polite" data-search-status></p>

	{#if data.products.length === 0}
		<p class="empty">
			No hay productos en este filtro. <a href="/productos">Ver todos</a>
		</p>
	{:else}
		<ul class="products">
			{#each data.products as product (product.id)}
				<li
					class="product"
					class:off={!product.available}
					data-product
					data-search={product.search}
					hidden={data.query.length > 0 && !product.matches}
				>
					<div class="product-head">
						<div class="product-info">
							{#if product.imageThumbUrl}
								<img
									class="product-thumb"
									src={product.imageThumbUrl}
									alt=""
									width="60"
									height="60"
									loading="lazy"
									decoding="async"
								/>
							{:else}
								<span class="product-thumb product-thumb-empty" aria-hidden="true">
									Sin foto
								</span>
							{/if}
							<div class="product-copy">
								<h2 class="product-name">{product.name}</h2>
								<p class="product-meta">
									<span>{product.categoryLabel}</span>
									<span class="price">{product.priceLabel}</span>
								</p>
							</div>
						</div>
						<span class="badge" class:ok={product.available} class:no={!product.available}>
							{product.available ? "Disponible" : "Sin stock"}
						</span>
					</div>

					<div class="product-actions">
						<form method="POST" action="?/toggle">
							<input type="hidden" name="id" value={product.id} />
							<input type="hidden" name="estado" value={data.filter} />
							<input
								type="hidden"
								name="q"
								value={data.query}
								data-search-query
							/>
							<input
								type="hidden"
								name="available"
								value={product.available ? "false" : "true"}
							/>
							<button class="btn small" type="submit">
								{product.available ? "Ocultar" : "Mostrar"}
							</button>
						</form>

						<a class="btn small ghost" href={`/productos/${product.id}`}>Editar</a>

						<form
							method="POST"
							action="?/delete"
							data-confirm={`¿Eliminar "${product.name}"?`}
						>
							<input type="hidden" name="id" value={product.id} />
							<input type="hidden" name="estado" value={data.filter} />
							<input
								type="hidden"
								name="q"
								value={data.query}
								data-search-query
							/>
							<button class="btn small danger" type="submit">Eliminar</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>

		<div
			class="empty search-empty"
			data-search-empty
			hidden={!data.query || visibleCount > 0}
		>
			<p>Sin resultados</p>
			<p>Prueba con otro nombre o revisa la ortografía.</p>
		</div>
	{/if}

	<div class="floating-actions">
		<a class="fab secondary" href="#top" aria-label="Volver arriba">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M12 19V5"></path>
				<path d="m6 11 6-6 6 6"></path>
			</svg>
		</a>
		<a class="fab" href="/productos/nuevo" aria-label="Nuevo producto">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M12 5v14"></path>
				<path d="M5 12h14"></path>
			</svg>
		</a>
	</div>
</div>
