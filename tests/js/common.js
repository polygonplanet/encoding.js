// Translation for encoding.js demo
(function () {
  const i18n = window.i18n;
  delete window.i18n;

  const translations = window.__translations__ || {};
  delete window.__translations__;

  const nanodown = window.nanodown;
  delete window.nanodown;

  document.addEventListener('DOMContentLoaded', () => {
    i18n.init({
      lang: i18n.detectLanguage(),
      translations,
      fallback: 'ja',
      formatters: [nanodown]
    });
    i18n.translateElements();

    const select = document.getElementById('language-select');
    select.addEventListener('change', function () {
      const lang = this.querySelector('option:checked').value;
      i18n.changeLanguage(lang);
      i18n.translateElements();
    });
    select.selectedIndex = -1;
    select.querySelector(`option[value="${i18n.lang}"]`).selected = true;
  });
})();
