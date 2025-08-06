import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/uat': {
        target: 'https://uat-platform.bankkaro.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/uat/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Log proxy requests for debugging
            console.log('🔄 Proxying request:', req.method, req.url);
          });
        }
      },
      '/api/external': {
        target: 'https://bk-api.bankkaro.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/external/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Log external API proxy requests
            console.log('🔄 Proxying external request:', req.method, req.url);
          });
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
