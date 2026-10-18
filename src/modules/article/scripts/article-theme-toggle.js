export function initArticleTheme() {
  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');

  function updateIcons() {
    if (document.documentElement.classList.contains('dark')) {
      lightIcon.classList.remove('hidden');
      darkIcon.classList.add('hidden');
    } else {
      lightIcon.classList.add('hidden');
      darkIcon.classList.remove('hidden');
    }
  }

  function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
    }
    updateIcons();
  }

  updateIcons();
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}
