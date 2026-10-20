/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: {
    relative: true,
    // Include generated pages and classes authored in module/build helpers.
    files: ['./dist/**/*.html', './src/**/*.js'],
  },
};
