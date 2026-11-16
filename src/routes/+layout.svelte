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
	<header class="admin-bar">
		<details class="admin-menu" data-admin-menu>
			<summary class="admin-menu-trigger">
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					aria-hidden="true"
				>
					<path d="M4 7h16M4 12h16M4 17h16"></path>
				</svg>
				<span>Secciones</span>
			</summary>
			<nav class="admin-menu-panel" aria-label="Secciones">
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
		</details>
	</header>
	<main class="main">
		{@render children()}
	</main>
</div>
