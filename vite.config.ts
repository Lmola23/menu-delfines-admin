import adapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			preprocess: vitePreprocess(),
			// SvelteKit 3 retiró el alias $lib; se mantiene para no cambiar los imports.
			alias: { $lib: "src/lib" },
		}),
	],
});
