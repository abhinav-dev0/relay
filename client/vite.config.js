import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		server: {
			proxy: {
				'/api': {
					target: env.VITE_BASE_URL,
					changeOrigin: true,
					secure: false,
				},
			},
		},
		plugins: [react(), tailwindcss()],
	};
});