# Change Log

All notable changes to this project will be documented in this file.

## [2.2.0](https://github.com/polygonplanet/encoding.js/compare/2.1.0...2.2.0) (2024-06-09)

### Features

* Add `fallback: 'ignore'` option in `Encoding.convert`. ([#41](https://github.com/polygonplanet/encoding.js/pull/41)) Thanks [@syumai](https://github.com/syumai)
* Add `fallback: 'error'` option in `Encoding.convert`. ([#44](https://github.com/polygonplanet/encoding.js/pull/44))

### Maintenance

* Update devDependencies (`mocha`) to the latest versions. ([a7bded8](https://github.com/polygonplanet/encoding.js/commit/a7bded8ec7cc4db6ab1702b850560c5dd3ee3206))

### Documentation

* Update `fallback` option of `convert` in README.md ([2a522ea](https://github.com/polygonplanet/encoding.js/commit/2a522ea07c651b2dceae5e97fdc4756bc22bfd3f))

## [2.1.0](https://github.com/polygonplanet/encoding.js/compare/2.0.0...2.1.0) (2024-03-21)

### Changes

* Remove output source map `encoding.min.js.map` from bundles to simplify build and reduce distribution size. ([b963656](https://github.com/polygonplanet/encoding.js/commit/b963656e4f17ad862e1ea11c7d5a11b51e514516))

### CI

* Migrate CI from Travis CI (`.travis.yml`) to GitHub Actions (`.github/workflows/ci.yml`). ([8c4612e](https://github.com/polygonplanet/encoding.js/commit/8c4612e7f25d6b58beb28e9f0e36f43347aeab11))

### Maintenance

* Update devDependencies (`eslint`, `mocha`, `uglify-js`) to the latest versions. ([f092635](https://github.com/polygonplanet/encoding.js/commit/f0926354792dd12560924b79422fd534629973ce))

### Documentation

* Update API documents (
  [`detect`](https://github.com/polygonplanet/encoding.js/commit/eed1e770d9ef8c3f25803a996487de3815375d5b),
  [`convert`](https://github.com/polygonplanet/encoding.js/commit/3263b396a7406ed0b61ce001763b3068227a661d),
  [`urlEncode/urlDecode`](https://github.com/polygonplanet/encoding.js/commit/992efb0f1522336f60fd646e0283afcc82374f73),
  [`base64Encode/base64Decode`](https://github.com/polygonplanet/encoding.js/commit/bb7dffd141757bd4fa32f5ed95cdca082a6277bd),
  [`codeToString/stringToCode`](https://github.com/polygonplanet/encoding.js/commit/7ede9a5b37b835611e700d466870d66d1e271a46),
  [`Japanese Zenkaku/Hankaku conversion`](https://github.com/polygonplanet/encoding.js/commit/f44ed2f93f1b0c9c93264c7e55272e42a6e3bd6e)
  ) in README.md.
* Update CDN sections and add example CDN script tag in README.md. ([f2aaefd](https://github.com/polygonplanet/encoding.js/commit/f2aaefde725309a879ed491cfc5bfeeefe0347a6))
* Change example code from XMLHttpRequest to use fetch API in README.md. ([fd88f12](https://github.com/polygonplanet/encoding.js/commit/fd88f12ff6656b9a21ab8170a9056512098dc387))

## [2.0.0](https://github.com/polygonplanet/encoding.js/compare/1.0.30...2.0.0) (2022-03-29)

### Features

* Add `fallback` option to `Encoding.convert`. ([5622bfa](https://github.com/polygonplanet/encoding.js/commit/5622bfa4b2ee3981d664315b743094fcfd4d01a0)) Thanks [#23](https://github.com/polygonplanet/encoding.js/pull/23) by [@tohutohu](https://github.com/tohutohu), [fallback types](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/59656) by [@p-chan](https://github.com/p-chan)
* Add `Encoding.version`. ([bd3d6ef](https://github.com/polygonplanet/encoding.js/commit/bd3d6ef511a17c2d9671453e6c93618dae7ae9db))

### Bug Fixes

* Fix deprecated Buffer constructor. ([b8fda07](https://github.com/polygonplanet/encoding.js/commit/b8fda07f6957f9197210fcda196cb2d6cc28e7a1))

### Breaking Changes

* Drop `bower` support. ([981ea39](https://github.com/polygonplanet/encoding.js/commit/981ea3947021faa87e12774e0786c6b13fe09124))

## [1.0.30](https://github.com/polygonplanet/encoding.js/compare/1.0.29...1.0.30) (2019-09-12)

### Documentation

* Add LICENSE. ([0224ebb](https://github.com/polygonplanet/encoding.js/commit/0224ebb620ae4058064f80ec3ec5898181595abe))

## [1.0.29](https://github.com/polygonplanet/encoding.js/compare/1.0.28...1.0.29) (2018-05-11)

### Bug Fixes

* Fix can't find module in using 'require'. ([#8](https://github.com/polygonplanet/encoding.js/issues/8)) ([5cf89b8](https://github.com/polygonplanet/encoding.js/commit/5cf89b85758d2466fd52a9690eed27ebaeba1e5e))

## [1.0.28](https://github.com/polygonplanet/encoding.js/compare/1.0.26...1.0.28) (2018-02-01)

### Changes

* Drop `Gruntfile.js` and modularize the code base by `browserify`.

## [1.0.26](https://github.com/polygonplanet/encoding.js/compare/1.0.25...1.0.26) (2017-08-21)

### Documentation

* Fix the grammar in README.md ([#4](https://github.com/polygonplanet/encoding.js/pull/4)) Thanks [@iku000888](https://github.com/iku000888)

## [1.0.25](https://github.com/polygonplanet/encoding.js/compare/1.0.24...1.0.25) (2016-11-03)

### Bug Fixes

* Fix argument decision of the detect method ([#3](https://github.com/polygonplanet/encoding.js/pull/3)) Thanks [@spring-raining](https://github.com/spring-raining)

## [1.0.24](https://github.com/polygonplanet/encoding.js/compare/1.0.23...1.0.24) (2015-09-22)

### Features

* Add `base64Encode` and `base64Decode` ([729bb4f](https://github.com/polygonplanet/encoding.js/commit/729bb4fac63dbfbea8dedefe874270ae5d6c2e21))

## [1.0.23](https://github.com/polygonplanet/encoding.js/compare/1.0.21...1.0.23) (2015-04-06)

### Bug Fixes

* Fix internal `isObject()` method for old IE browsers ([#2](https://github.com/polygonplanet/encoding.js/pull/2)) ([32f6c02](https://github.com/polygonplanet/encoding.js/commit/32f6c02e290a36deb158357ddd1ebe34601cb4ea)) Thanks [@dmitrygorbenko](https://github.com/dmitrygorbenko)

## [1.0.21](https://github.com/polygonplanet/encoding.js/compare/1.0.20...1.0.21) (2015-02-12)

### Features

* Add bower.json ([d33bb7c](https://github.com/polygonplanet/encoding.js/commit/d33bb7c225e8e5c53100b6776a8c1d63b7a807e6))

## [1.0.20](https://github.com/polygonplanet/encoding.js/compare/1.0.19...1.0.20) (2014-12-16)

### Features

* Optimize process speed of `urlEncode`. ([b5f16d4](https://github.com/polygonplanet/encoding.js/commit/b5f16d4bb413705a4106030211cea8de4902c096))

## [1.0.19](https://github.com/polygonplanet/encoding.js/compare/1.0.18...1.0.19) (2014-12-15)

* No API changes.

## [1.0.18](https://github.com/polygonplanet/encoding.js/compare/1.0.17...1.0.18) (2014-12-15)

### Features

* Supports `JIS X 0212:1990` (Hojo-Kanji). ([c885b2e](https://github.com/polygonplanet/encoding.js/commit/c885b2e9b1e208538d1aa56362841a49a13221dc))

## [1.0.17](https://github.com/polygonplanet/encoding.js/compare/1.0.16...1.0.17) (2014-12-14)

### Bug Fixes

* Fix apply stack max range. ([9d6a7a0](https://github.com/polygonplanet/encoding.js/commit/9d6a7a0a3a59907799632e3e29cc39f1065978a4))

## [1.0.16](https://github.com/polygonplanet/encoding.js/compare/1.0.15...1.0.16) (2014-12-14)

### Features

* Add `type` option in `convert()`. ([1a53058](https://github.com/polygonplanet/encoding.js/commit/1a530580f3d1d26ef3bb05d15f52c08f70339b39))
* Add Zenkaku/Hankaku conversion methods. ([16ed72a](https://github.com/polygonplanet/encoding.js/commit/16ed72a1a3d315ea707a04dcb67614309b523fc4))

## [1.0.15](https://github.com/polygonplanet/encoding.js/compare/1.0.14...1.0.15) (2014-12-13)

### Documentation

* Add English/Japanese README. ([372e74f](https://github.com/polygonplanet/encoding.js/commit/372e74f82514c3fc4f07876bcd46d0fc4b2e59db))
