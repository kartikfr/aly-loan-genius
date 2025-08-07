import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      host: env.VITE_HOST || "::",
      port: parseInt(env.VITE_PORT || "8080"),
      proxy: {
        '/api/uat': {
          target: env.VITE_UAT_API_URL,
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
          target: env.VITE_EXTERNAL_API_URL,
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
  };
});
