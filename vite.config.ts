import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://backend",
    },
  },
  plugins: [reactRefresh()],
});
