import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import svgr from 'vite-plugin-svgr';
import compression from 'vite-plugin-compression2';
export default defineConfig({
  resolve: {
    alias: {
      // Add this line to resolve modules from the root
      'common': path.resolve(__dirname, 'src/common'),
      '_helpers': path.resolve(__dirname, 'src/_helpers'),
      '_services': path.resolve(__dirname, 'src/_services'),
      '_testhelpers': path.resolve(__dirname, 'src/_testhelpers'),
      '_theme': path.resolve(__dirname, 'src/_theme'),
      'routes': path.resolve(__dirname, 'src/routes'),
      'views': path.resolve(__dirname, 'src/views'),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
  plugins: [
    {
      name: 'load+transform-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) {
          return null;
        }

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
    svgr({
      include: '**/*.svg?react',
    }),
    compression({ algorithm: 'brotliCompress' })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'src/tests/setup.js',  // Optional: Path to setup file if you need any
    include: ['src/**/*.test.jsx', 'src/**/*.test.js'],  // Adjust this pattern to match your test files
    coverage: {
      reporter: ['text', 'json', 'html'],
      provder: 'v8',  // or 'istanbul'
    },
  },
});
