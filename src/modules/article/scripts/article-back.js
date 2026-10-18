export function initArticleBack() {
  const backButton = document.getElementById('back-btn');

  function navigateBack(event) {
    event.preventDefault();

    // Direct visitors have no in-site page to return to.
    if (document.referrer && document.referrer.includes(window.location.host)) {
      window.history.back();
      return;
    }
    window.location.href = '/';
  }

  backButton.addEventListener('click', navigateBack);
}
