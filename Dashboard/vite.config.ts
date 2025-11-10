import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), checker({ typescript: false })],
  server: {
    host: "0.0.0.0", // Make the server accessible externally
    port: 5173, // Set the desired port
    open: false,
  },
});
