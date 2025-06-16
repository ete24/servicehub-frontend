        // tailwind.config.js (located at servicehub-frontend/tailwind.config.js)
        /** @type {import('tailwindcss').Config} */
        export default {
          content: [
            "./index.html", 
            "./src/**/*.{js,ts,jsx,tsx}", // Scans all JS, TS, JSX, TSX files in 'src'
          ],
          theme: {
            extend: {
              fontFamily: {
                inter: ['Inter', 'sans-serif'], // Keep custom font if used
              },
            },
          },
          plugins: [], // No plugins for now
        }
        