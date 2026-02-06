// Vite bundle
// Vite rss - https://vite.dev/config/build-options
// Rollup rss - https://rollupjs.org/configuration-options/#output-dir
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    // vite config - vite communicate to server via proxy
    server: {
        proxy: {
            "/api": "http://127.0.0.1:5000",
            "/login": "http://127.0.0.1:5000",
            "/signup": "http://127.0.0.1:5000",
            "/createPassage": "http://127.0.0.1:5000",
            "/maintestselection": "http://127.0.0.1:5000",
            "/maintestroute": "http://127.0.0.1:5000",
            "/achievements": "http://127.0.0.1:5000",
        },
    },
    // vite config - allow any origin
    cors: true,
    // production - npm run build . (can also be changed to "dev" for development purposes)
    build: {
        // vite config - directory to place generated "chunks" containing bundle.js and bundle.css
        outDir: "dist",
        emptyOutDir: true,
        // rollupjs for bundle.js and bundle.css
        rollupOptions: {
            // rollup input for rendering specific .jsx components using root.jsx
            input: path.resolve(__dirname, "index.html"),
            // rollup output on vite.config.js for entry - entryFileNames
            output: {
                // rollup creation of bundle.js
                entryFileNames: `bundle.js`,
                // rollup force vite to build onlly 1 bundle.css files and hash pictures
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name.endsWith(".css")) return "bundle.css";
                    // images
                    return "assets/[name]=[hash][extname]";
                },
            },
        },
    },
});
