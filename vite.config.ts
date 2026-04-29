import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import cloudflareDoExporter from 'sveltekit-cloudflare-durable-objects';
export default defineConfig({
	plugins: [
		sveltekit(),
		cloudflareDoExporter({ durableObjects: ['src/lib/durable-objects.ts'] })
	]
});
