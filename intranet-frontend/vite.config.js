import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Le serveur de développement est atteint à travers nginx (voir docker-compose.dev.yml).
const serverNames = (process.env.SERVER_NAME || 'localhost').split(/\s+/).filter(Boolean)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // En développement, pré-assembler cette liste découperait toutes les icônes en morceaux
  // partagés avec lucide-react, chargés d'un coup au démarrage. Non assemblée, chaque icône
  // reste un fichier chargé à la demande, comme en production.
  optimizeDeps: {
    exclude: ['lucide-react/dynamicIconImports'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: serverNames,
    watch: {
      usePolling: true,
    },
    hmr: {
      protocol: 'wss',
      clientPort: Number(process.env.HTTPS_PORT || 443),
    },
  },
})
