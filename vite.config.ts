import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import * as MdxConfig from "./source.config";

export default defineConfig({
  base: "/docs",
  server: {
    port: 3000,
  },
  plugins: [
    mdx(MdxConfig),
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
          outputPath: "index.html",
          crawlLinks: true,
        },
      },

      pages: [
        {
          path: "/docs",
        },
        {
          path: "/api/search",
        },
      ],
    }),
    react(),
  ],
});
