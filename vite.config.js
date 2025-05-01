import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  define: {
    "process.env": {
      VITE_FYERS_CLIENT_ID: JSON.stringify(import.meta.env.VITE_FYERS_CLIENT_ID),
      VITE_FYERS_APP_SECRET: JSON.stringify(import.meta.env.VITE_FYERS_APP_SECRET),
      VITE_FYERS_REDIRECT_URL: JSON.stringify(import.meta.env.VITE_FYERS_REDIRECT_URI),
      VITE_FYERS_APP_ID: JSON.stringify(import.meta.env.VITE_FYERS_SCOPE),
    },
  },
});
