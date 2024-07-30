import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});

// import { resolve } from 'path'

// export default {
//   root: resolve(__dirname, 'src'),
//   build: {
//     outDir: '../dist'
//   },
//   server: {
//     port: 8080
//   }
// }
