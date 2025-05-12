import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
const __dirname = path.resolve();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve("src") },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      {
        find: "@pages",
        replacement: path.resolve(__dirname, "src/pages"),
      },
      {
        find: "@img",
        replacement: path.resolve(__dirname, "src/assets/img"),
      },
    ],
  },
  base: "/shin_snapshots/",
});
