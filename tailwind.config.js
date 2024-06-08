/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/App.jsx",
    "./src/main.jsx",
    "./src/pages/Home.jsx",
    "./src/pages/SpotifyImport.jsx",
    "./src/pages/SpotifyExport.jsx",
    "./src/pages/YoutubeImport.jsx",
    "./src/pages/YoutubeExport.jsx",
    "./src/pages/SharePage.jsx",
    "./src/components/Navbar.jsx",
    "./src/components/PlaylistCard.jsx",
    'node_modules/preline/dist/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('preline/plugin'),
  ],
}

