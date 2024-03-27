(function () {
  const i18n = window.i18n;
  const translations = window.__translations__ || {};

  // Minimal Markdown converter, 2024 polygonplanet, MIT license
  const markdownMap = [
    [/^(#{1,6})\s+(.*)$/gm, (_, p1, p2) => `<h${p1.length}>${p2}</h${p1.length}>`],
    [/ {2,}$/gm, '<br>'],
    [/\[([^\]]*?)\]\(([^)]*?)\)/g, '<a href="$2">$1</a>'],
    [/\*\*(.*?)\*\*/g, '<strong>$1</strong>'],
    [/\*(.*?)\*/g, '<em>$1</em>'],
    [/`(.*?)`/g, '<code>$1</code>'],
    [/^([*-]\s*){3,}$/gm, '<hr>'],
  ];
  const markdown = (str) => markdownMap.reduce((s, [from, to]) => s.replace(from, to), str);

  document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('language-select');

    select.addEventListener('change', function () {
      const lang = this.querySelector('option:checked').value;
      i18n.changeLanguage(lang);
      i18n.translateElements();
    });

    // Set default language (ja) contents from HTML
    translations.ja = Object.keys(translations.en).reduce((memo, key) => {
      if (memo[key]) return memo;
      const el = i18n.$(key);
      const content = el.dataset.i18nAttr ? el.getAttribute(el.dataset.i18nAttr) : el.textContent;
      memo[key] = content.trim();
      return memo;
    }, translations.ja || {});

    i18n.init({
      lang: i18n.detectLanguage(),
      translations,
      fallback: 'ja',
      formatters: [markdown],
    });

    select.selectedIndex = -1;
    select.querySelector(`option[value="${i18n.lang}"]`).selected = true;

    i18n.translateElements();
  });
})();
