import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: 'scripts/main.js',
      name: 'APE',
      fileName: 'ape',
      formats: ['es']
    },
    rollupOptions: {
        // Externalize Foundry globals so they aren't bundled
        external: [/^foundry\/.*/], 
    }
  }
});
