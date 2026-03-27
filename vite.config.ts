import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync, existsSync, copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: {
        // main: resolve(__dirname, 'index.html'), // Landing page with TypeScript
        main: resolve(__dirname, 'src/main.ts'), // Landing page with TypeScript
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
        'popup/popup': resolve(__dirname, 'src/popup/popup.ts'),
        'options/options': resolve(__dirname, 'src/options/options.ts'),
      },
      output: {
        entryFileNames: '[name].js',     // background.js, content.js, popup.js, options.js
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
      // output: {
      //   entryFileNames: '[name].js',
      //   chunkFileNames: '[name].js',
      //   assetFileNames: '[name].[ext]',
      // },
    },
  },

  // Copy HTML files as-is into dist sub-folders
  plugins: [
    {
      name: 'copy-html',
      generateBundle(options, bundle) {
        // Copy options.html
        this.emitFile({
          type: 'asset',
          fileName: 'options/options.html',
          source: readFileSync(resolve(__dirname, 'src/options/options.html'), 'utf-8')
        });

        // Copy optimized index.html
        this.emitFile({
          type: 'asset',
          fileName: 'index.html',
          source: readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
        });

        // Copy popup.html
        this.emitFile({
          type: 'asset',
          fileName: 'popup/popup.html',
          source: readFileSync(resolve(__dirname, 'src/popup/popup.html'), 'utf-8')
        });

        // Copy manifest.json (highly recommended)
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: readFileSync(resolve(__dirname, 'manifest.json'), 'utf-8')
        });
      },
    },
    {
      name: 'copy-icons',
      writeBundle() {
        const iconsDir = resolve(__dirname, 'icons');
        const distIconsDir = resolve(__dirname, 'dist/icons');

        // Create dist/icons directory if it doesn't exist
        if (!existsSync(distIconsDir)) {
          mkdirSync(distIconsDir, { recursive: true });
        }

        // Copy all icon files
        const iconFiles = ['icon-16.png', 'icon-32.png', 'icon-48.png', 'icon-128.png'];
        iconFiles.forEach(file => {
          const srcPath = resolve(iconsDir, file);
          const destPath = resolve(distIconsDir, file);
          if (existsSync(srcPath)) {
            copyFileSync(srcPath, destPath);
          }
        });

        // Copy pip-shared.js to dist
        const pipSharedSrc = resolve(__dirname, 'pip-shared.js');
        const pipSharedDest = resolve(__dirname, 'dist/pip-shared.js');
        if (existsSync(pipSharedSrc)) {
          copyFileSync(pipSharedSrc, pipSharedDest);
        }

        // Copy youtube.js to dist
        const youtubeSrc = resolve(__dirname, 'youtube.js');
        const youtubeDest = resolve(__dirname, 'dist/youtube.js');
        if (existsSync(youtubeSrc)) {
          copyFileSync(youtubeSrc, youtubeDest);
        }
      },
    },
  ],

  publicDir: 'public',
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
});