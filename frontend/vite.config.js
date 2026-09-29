import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The 3D scenes and admin pages are split into their own chunks through
// React.lazy() dynamic imports, so the initial bundle stays small.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
});
