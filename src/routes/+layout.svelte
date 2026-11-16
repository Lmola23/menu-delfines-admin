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
			<summary
				class="admin-menu-trigger"
				aria-label="Menú de secciones"
				aria-controls="admin-menu-panel"
			>
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
			</summary>

			<button
				type="button"
				class="admin-menu-backdrop"
				data-menu-close
				aria-label="Cerrar menú"
				tabindex="-1"
			></button>

			<div
				id="admin-menu-panel"
				class="admin-menu-panel"
				role="dialog"
				aria-modal="true"
				aria-labelledby="admin-menu-title"
			>
				<div class="admin-menu-head">
					<span id="admin-menu-title">Secciones</span>
					<button
						type="button"
						class="admin-menu-close"
						data-menu-close
						aria-label="Cerrar menú"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							aria-hidden="true"
						>
							<path d="M6 6l12 12M18 6 6 18"></path>
						</svg>
					</button>
				</div>

				<nav class="admin-menu-links" aria-label="Secciones">
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
			</div>
		</details>
	</header>
	<main class="main">
		{@render children()}
	</main>
</div>
