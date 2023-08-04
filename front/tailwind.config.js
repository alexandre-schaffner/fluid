/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      backgroundImage: {
        cccircularTop: "url('/src/assets/cccircular-top.svg')",
        cccircularRight: "url('/src/assets/cccircular-right.svg')",
        cccircularRight2: "url('/src/assets/cccircular-right-2.svg')",
        cccircularLeft: "url('/src/assets/cccircular-left.svg')",
        cccircularCenter: "url('/src/assets/cccircular-center.svg')",
        cccircularBottom: "url('/src/assets/cccircular-bottom.svg')",
        defaultPlaylist: "url('/src/assets/default-playlist.svg')",
        pauseCircle: "url('/src/assets/pause-circle.svg')",
        sync: "url('/src/assets/sync.svg')",
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      }

    },
  },
  plugins: [],
}

