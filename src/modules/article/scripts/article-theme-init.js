
        (function () {
            var savedTheme = null;
            try { savedTheme = localStorage.getItem('color-theme'); } catch (_) {}
            document.documentElement.classList.toggle('dark', savedTheme === 'dark' ||
                (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches));
        }());

