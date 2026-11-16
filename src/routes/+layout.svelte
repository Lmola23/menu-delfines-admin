<script lang="ts">
	import { page } from "$app/state";

	import "../app.css";

	let { children } = $props();

	const path = $derived(page.url.pathname);
	const inProducts = $derived(
		path === "/productos" || path.startsWith("/productos/"),
	);
	const inCategories = $derived(
		path === "/categorias" || path.startsWith("/categorias/"),
	);
</script>

<div class="app" id="top">
	<nav class="admin-nav" aria-label="Secciones">
		<a
			href="/productos"
			aria-current={inProducts ? "page" : undefined}
			data-sveltekit-reload
		>
			Productos
		</a>
		<a
			href="/categorias"
			aria-current={inCategories ? "page" : undefined}
			data-sveltekit-reload
		>
			Categorías
		</a>
	</nav>
	<main class="main">
		{@render children()}
	</main>
</div>
