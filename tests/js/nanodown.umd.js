/*
 * nanodown v0.0.1 - Minimal Markdown converter
 * Copyright (c) 2024 polygonplanet
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.nanodown = factory());
})(this, (function () { 'use strict';

  const markdownMap = [
    [/^(#{1,6})\s+(.*)$/gm, (_, p1, p2) => `<h${p1.length}>${p2}</h${p1.length}>`],
    [/ {2,}$/gm, '<br>'],
    [/\[([^\]]*?)\]\(([^)]*?)\)/g, '<a href="$2">$1</a>'],
    [/\*\*(.*?)\*\*/g, '<strong>$1</strong>'],
    [/\*(.*?)\*/g, '<em>$1</em>'],
    [/`(.*?)`/g, '<code>$1</code>'],
    [/^([*-]\s*){3,}$/gm, '<hr>']
  ];

  function nanodown(str) {
    return markdownMap.reduce((s, [from, to]) => s.replace(from, to), str);
  }

  return nanodown;

}));
