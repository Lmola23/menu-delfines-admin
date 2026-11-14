<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<div class="app">
	<header class="topbar">
		<a class="brand" href="/productos">
			<span class="dot" aria-hidden="true"></span>
			Delfines <small>admin</small>
		</a>
	</header>

	<main class="main">
		{@render children()}
	</main>
</div>
