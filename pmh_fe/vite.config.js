import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'
import fs from 'fs';
import svgr from 'vite-plugin-svgr';
import compression from 'vite-plugin-compression2';

// Add this line to generate a random hash
const hash = Math.floor(Math.random() * 90000) + 10000;

export default defineConfig({
  base: process.env.VITE_PUBLIC_URL,
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
  server: {
    port: 3000,
    open: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '_https/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, '_https/cert.pem'))
    },
    hmr: {
      overlay: false
    },
    proxy: {
      '/analytics': {
        target: "https://synopsformarketing-stage.accenture.com/amc-dev",
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });

          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('[proxyReq] Sending Request to the Target:', req.method, req.url);
          });

          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // log original request and proxied request info
            const exchange = `[proxyRes] ${req.method} ${req.url} -> ${proxyRes.req.protocol}//${proxyRes.req.host}${proxyRes.req.path} [${proxyRes.statusCode}]`;
            // [DEBUG] GET / -> http://www.example.com [200]
            console.log(`\x1b[36m${exchange}`, '\x1b[0m');
          });
        }
      },
    }
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name]${hash}.js`,
        chunkFileNames: `[name]${hash}.js`,
        assetFileNames: `[name]${hash}.[ext]`,
        manualChunks(id) {
            if (id.includes('node_modules')) {
                return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
        }
      }
    },
    chunkSizeWarningLimit: 1600
  },
  test: {
    /* use global to avoid globals imports (describe, test, expect): */
    globals: true,
    /* the environment that will be used for testing */
    environment: "jsdom",
    css: true,
    setupFiles: "src/tests/setup.js",
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['json', 'html', 'cobertura'],
    },
    outputFile: {
      junit: './junit.xml',
    }
  },
});
