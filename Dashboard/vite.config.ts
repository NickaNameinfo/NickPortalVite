import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Make the server accessible externally
    port: 5173, // Set the desired port
    open: false,
  },
  base: '/Admin/',
});
