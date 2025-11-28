/** @format */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(), 
        tailwindcss(),
        viteStaticCopy({
         targets: [
           {
             src: 'src/assets/*',
             dest: 'assets'
           }
         ]
       })
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        outDir: 'dist',
        chunkSizeWarningLimit: 1000,
    },
});
