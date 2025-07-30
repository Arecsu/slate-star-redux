// @ts-check
import { defineConfig } from "astro/config"
import Icons from "unplugin-icons/vite"
import svelte from "@astrojs/svelte"

// https://astro.build/config
export default defineConfig({
	site: 'https://arecsu.github.io',
	base: 'slate-star-redux',
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					api: "modern-compiler", // or "modern"
					// additionalData: `@import "@/styles/vars.scss";`
					// additionalData: `@use "@styles/mixins" as *; @use "@styles/vars" as *;`,
					additionalData: `@use "@styles/vars" as *;`,
				},
			},
		},
		plugins: [
			Icons({
				compiler: "svelte",
				autoInstall: true, // experimental
			}),
		],
		server: {
			allowedHosts: [".trycloudflare.com"],
		},
	},
	integrations: [svelte()],
})
