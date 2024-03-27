/*
 * microi18n v0.0.1 - Tiny i18n translation utility
 * Copyright (c) 2024 polygonplanet
 * @license MIT
 */
(function (self) {
  'use strict';

  if (self.i18n) return;

  const escapeMap = [
    [/&/g, '&amp;'],
    [/</g, '&lt;'],
    [/>/g, '&gt;'],
    [/"/g, '&quot;'],
    [/'/g, '&#39;'],
  ];
  const escape = (str) => escapeMap.reduce((s, [from, to]) => s.replace(from, to), str);

  // Minimal mustache syntax for escaping
  const format = (str, args = {}) =>
    [
      [/{{{(.+?)}}}/g, (_, key) => args[key] || ''],
      [/{{(.+?)}}/g, (_, key) => escape(args[key] || '')],
    ].reduce((s, [from, to]) => s.replace(from, to), str);

  class RawString {
    constructor(value) {
      this.value = value;
    }

    toString() {
      return this.value;
    }
  }

  function raw(strings, ...substs) {
    return new RawString(
      strings.reduce((result, s, i) => {
        result += s;
        if (i < substs.length) {
          result += substs[i];
        }
        return result;
      }, '')
    );
  }

  function i18n(strings, ...substs) {
    return strings.reduce((result, s, i) => {
      let subst = i < substs.length ? substs[i] : '';
      if (subst == null) {
        subst = '';
      } else if (!(subst instanceof RawString)) {
        subst = escape(subst);
      }
      return result + s + subst;
    }, '');
  }

  const defaultOptions = {
    lang: '',
    fallback: 'en',
    formatters: [],
    translations: {},
  };

  // i18n core methods
  Object.assign(i18n, {
    lang: '',
    raw,
    init(options = {}) {
      const { fallback, formatters, lang, translations } = { ...defaultOptions, ...options };
      Object.assign(this, { fallback, formatters, translations });

      const supportedLangs = Object.keys(this.translations);
      this.lang = lang && supportedLangs.includes(lang) ? lang : fallback;
      return this;
    },
    changeLanguage(lang) {
      this.lang = lang;
      return this;
    },
    t(key, args = {}) {
      const translation = this.translations[this.lang] || {};
      const content = format(translation[key] || '', args);
      return this.formatters.reduce((s, formatter) => formatter(s, args), content);
    },
  });

  // Add i18n DOM methods
  Object.assign(
    i18n,
    (() => {
      const elemArgs = new WeakMap();
      return {
        detectLanguage() {
          const nav = self.navigator || {};

          let lang = nav.languages && nav.languages[0];
          if (!lang) {
            lang = nav.language || nav.userLanguage;
          }
          return ('' + (lang || '')).substring(0, 2).toLowerCase();
        },
        setElement(el, key, args) {
          el.dataset.i18n = key;
          if (args) {
            elemArgs.set(el, args);
          }
          return this;
        },
        $(key) {
          return document.querySelector(`[data-i18n="${key}"]`);
        },
        translateElement(el) {
          const key = el.dataset.i18n;
          const args = elemArgs.get(el) || {};
          const content = this.t(key, args);

          if ('i18nAttr' in el.dataset) {
            // Translate for attributes
            // @example
            // // HTML
            // <button id="btn" title="Open window" data-i18n="my-btn" data-i18n-attr="title">Open</button>
            // // JS
            // i18n.init({
            //   translations: {
            //     ja: { 'my-btn': 'ウィンドウを開く' },
            //     en: { 'my-btn': 'Open window' },
            //   }
            // });
            // i18n.translateElement(document.getElementById('btn'));
            const attrName = el.dataset.i18nAttr;
            el.setAttribute(attrName, content);
          } else {
            // Translate for text content
            el.innerHTML = content;
          }
          return this;
        },
        translateElements() {
          Array.from(document.querySelectorAll('[data-i18n]')).forEach((el) =>
            this.translateElement(el)
          );
          return this;
        },
      };
    })()
  );

  self.i18n = i18n;
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
    ? self
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : this
);
