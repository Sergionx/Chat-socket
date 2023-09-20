import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

const env = loadEnv("all", process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        target: env.VITE_BACKEND_URL,
        ws: true,
      },
    },
  },
});
