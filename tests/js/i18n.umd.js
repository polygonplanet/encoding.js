/*
 * i18n v1.0.0 - Tiny i18n translation utility
 * Copyright (c) 2024 polygonplanet
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.i18n = factory());
})(this, (function () {
  'use strict';

  /**
   * @example
   * // Translate text
   * i18n.init({
   *   translations: {
   *     ja: { hello: 'こんにちは' },
   *     en: { hello: 'Hello' }
   *   }
   * });
   * i18n.changeLanguage('ja');
   * console.log(i18n.t('hello')); // 'こんにちは'
   *
   * @example
   * // Translate text with arguments
   * i18n.init({
   *   translations: {
   *     ja: { hello: 'こんにちは、{{name}}さん' },
   *     en: { hello: 'Hello, {{name}}' }
   *   }
   * });
   * console.log(i18n.t('hello', { name: 'Taro' })); // 'こんにちは、Taroさん'
   */
  const i18n = (function (self) {
    const escapeMap = [
      [/&/g, '&amp;'],
      [/</g, '&lt;'],
      [/>/g, '&gt;'],
      [/"/g, '&quot;'],
      [/'/g, '&#39;']
    ];
    const escape = (str) => escapeMap.reduce((s, [from, to]) => s.replace(from, to), str);

    // Minimal mustache syntax for escaping
    const format = (str, args = {}) =>
      [
        [/{{{(.+?)}}}/g, (_, key) => args[key] || ''],
        [/{{(.+?)}}/g, (_, key) => escape(args[key] || '')]
      ].reduce((s, [from, to]) => s.replace(from, to), str);

    const defaultOptions = {
      lang: '',
      fallback: 'en',
      formatters: [],
      translations: {}
    };

    function i18n(key, args) {
      return this.t(key, args);
    }

    // i18n core methods
    Object.assign(i18n, {
      args: {},
      lang: '',
      init(options = {}) {
        const { fallback, formatters, lang, translations } = { ...defaultOptions, ...options };
        Object.assign(this, { fallback, formatters, translations });

        this.args = translations.args || {};
        delete translations.args;

        const supportedLangs = Object.keys(translations);
        this.lang = lang && supportedLangs.includes(lang) ? lang : fallback;
        return this;
      },
      changeLanguage(lang) {
        this.lang = lang;
        return this;
      },
      t(key, args) {
        if (args == null) args = this.args;
        const translation = this.translations[this.lang] || {};
        const content = format(translation[key] || '', args);

        return this.formatters.reduce((s, formatter) => {
          return formatter(s, args);
        }, content);
      }
    });

    /**
     * Add i18n DOM methods
     *
     * @example
     * // HTML
     * <h1 data-i18n="hello">Hello</h1>
     * // JS
     * i18n.init({
     *   lang: i18n.detectLanguage(),
     *   translations: {
     *     ja: { hello: 'こんにちは' },
     *     en: { hello: 'Hello' }
     *   },
     *   fallback: 'ja'
     * }).translateElements();
     *
     * Translate for attributes with '[attrName]' brackets
     *
     * @example
     * // HTML
     * <button id="btn" data-i18n="[title]open window">Open</button>
     * // JS
     * i18n.init({
     *   translations: {
     *     ja: { 'open window': 'ウィンドウを開く' },
     *     en: { 'open window': 'Open window' },
     *   }
     * }).translateElement(document.getElementById('btn'));
     */
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
          translateElement(el, key, args) {
            if (key != null) {
              this.setElement(el, key, args);
            } else {
              key = el.dataset.i18n;
            }
            args = elemArgs.has(el) ? elemArgs.get(el) : this.args || {};
            key.split(/\s*,\s*/).forEach((k) => {
              let keyName, attrName;

              // When specifying `data-i18n="[attr]key"`
              if (k.charAt(0) === '[') {
                [attrName, keyName] = k.split(']');
                attrName = attrName.slice(1);
              } else {
                keyName = k;
              }
              const content = this.t(keyName, args);
              if (attrName) {
                el.setAttribute(attrName, content);
              } else {
                // Translate for text content
                el.innerHTML = content;
              }
            });
            return this;
          },
          translateElements() {
            Array.from(document.querySelectorAll('[data-i18n]')).forEach((el) =>
              this.translateElement(el)
            );
            return this;
          }
        };
      })()
    );

    return i18n;
  })(
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {}
  );

  return i18n;
}));
