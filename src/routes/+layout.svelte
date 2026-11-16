<script lang="ts">
	import "../app.css";

	let { children } = $props();
</script>

<div class="app" id="top">
	<main class="main">
		{@render children()}
	</main>
</div>
