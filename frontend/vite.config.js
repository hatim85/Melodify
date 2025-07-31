import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  // server: {
  //   proxy: {
  //     '/ipfs': {
  //       target: 'https://jade-legal-quail-7.mypinata.cloud',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/ipfs/, ''),
  //       secure: false, // Set to false if the target server does not support HTTPS
  //     },
  //   },
  // },
  define: {
    global: {},
  },
})
