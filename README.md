encoding.js
===========

[![NPM Version](https://img.shields.io/npm/v/encoding-japanese.svg)](https://www.npmjs.com/package/encoding-japanese)
[![Build Status](https://app.travis-ci.com/polygonplanet/encoding.js.svg?branch=master)](https://app.travis-ci.com/polygonplanet/encoding.js)
[![GitHub License](https://img.shields.io/github/license/polygonplanet/encoding.js.svg)](https://github.com/polygonplanet/encoding.js/blob/master/LICENSE)

Convert or detect character encoding in JavaScript.

[**README (Japanese)**](README_ja.md)

## Table of contents

- [Features](#features)
  * [How to use character encoding in strings?](#how-to-use-character-encoding-in-strings)
- [Installation](#installation)
  * [npm](#npm)
    + [TypeScript](#typescript)
  * [browser (standalone)](#browser-standalone)
  * [CDN](#cdn)
- [Supported encodings](#supported-encodings)
  * [About `UNICODE`](#about-unicode)
- [Example usage](#example-usage)
- [Demo](#demo)
- [API](#api)
  * [Detect character encoding (detect)](#detect-character-encoding-detect)
  * [Convert character encoding (convert)](#convert-character-encoding-convert)
    + [Specify conversion options to the argument `to_encoding` as an object](#specify-conversion-options-to-the-argument-to_encoding-as-an-object)
    + [Specify the return type by the `type` option](#specify-the-return-type-by-the-type-option)
    + [Replace to HTML entity (Numeric character reference) when cannot be represented](#replace-to-html-entity-numeric-character-reference-when-cannot-be-represented)
    + [Specify BOM in UTF-16](#specify-bom-in-utf-16)
  * [URL Encode/Decode](#url-encodedecode)
  * [Base64 Encode/Decode](#base64-encodedecode)
  * [Code array to string conversion (codeToString/stringToCode)](#code-array-to-string-conversion-codetostringstringtocode)
  * [Japanese Zenkaku/Hankaku conversion](#japanese-zenkakuhankaku-conversion)
- [Other examples](#other-examples)
  * [Example using the XMLHttpRequest and Typed arrays (Uint8Array)](#example-using-the-xmlhttprequest-and-typed-arrays-uint8array)
  * [Convert encoding for file using the File APIs](#convert-encoding-for-file-using-the-file-apis)
- [Contributing](#contributing)
- [License](#license)

## Features

encoding.js is a JavaScript library for converting and detecting character encodings
that support Japanese character encodings such as `Shift_JIS`, `EUC-JP`, `JIS`, and `Unicode` such as `UTF-8` and `UTF-16`.

Since JavaScript string values are internally encoded as UTF-16 code units ([ref: ECMAScript® 2019 Language Specification - 6.1.4 The String Type](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-ecmascript-language-types-string-type)),
they cannot properly handle other character encodings as they are, but encoding.js enables conversion by handling them as arrays instead of strings.

Each character encoding is handled as an array of numbers with character code values, for example `[130, 160]` ("あ" in UTF-8).

The array of character codes passed to each method of encoding.js can also be used with TypedArray such as `Uint8Array`, and `Buffer` in Node.js.

### How to use character encoding in strings?

Numeric arrays of character codes can be converted to strings with methods such as [`Encoding.codeToString`](#code-array-to-string-conversion-codetostringstringtocode) ,
but because of the above JavaScript specifications, some character encodings cannot be handled properly when converted to strings.

So if you want to use strings instead of arrays, convert it to percent-encoded strings like `'%82%A0'` by using [`Encoding.urlEncode`](#url-encodedecode) and [`Encoding.urlDecode`](#url-encodedecode) to passed to other resources.
Or, [`Encoding.base64Encode`](#base64-encodedecode) and [`Encoding.base64Decode`](#base64-encodedecode) can be passed as strings in the same way.

## Installation

### npm

encoding.js is published under the package name `encoding-japanese` on npm.

```bash
$ npm install --save encoding-japanese
```

#### using `import`

```javascript
import Encoding from 'encoding-japanese';
```

#### using `require`

```javascript
const Encoding = require('encoding-japanese');
```

#### TypeScript

TypeScript type definitions for encoding.js are available at [@types/encoding-japanese](https://www.npmjs.com/package/@types/encoding-japanese) (thanks [@rhysd](https://github.com/rhysd)).

```bash
$ npm install --save-dev @types/encoding-japanese
```

### browser (standalone)

Install from npm or download from the [release list](https://github.com/polygonplanet/encoding.js/tags) and use `encoding.js` or `encoding.min.js` in the package.  
\*Please note that if you `git clone`, even the *master* branch may be under development.

```html
<script src="encoding.js"></script>
```

Or use the minified `encoding.min.js`

```html
<script src="encoding.min.js"></script>
```

When the script is loaded, the object `Encoding` is defined in the global scope (ie `window.Encoding`).

### CDN

You can use the encoding.js (package name: `encoding-japanese`) CDN on [cdnjs.com](https://cdnjs.com/libraries/encoding-japanese).

## Supported encodings

|Value in encoding.js|[`detect()`](#detect-character-encoding-detect)|[`convert()`](#convert-character-encoding-convert)|MIME Name (Note)|
|:------:|:----:|:-----:|:---|
|ASCII   |✓     |      |US-ASCII (Code point range: `0-127`)|
|BINARY  |✓     |      |(Binary strings. Code point range: `0-255`)|
|EUCJP   |✓     |✓     |EUC-JP|
|JIS     |✓     |✓     |ISO-2022-JP|
|SJIS    |✓     |✓     |Shift_JIS|
|UTF8    |✓     |✓     |UTF-8|
|UTF16   |✓     |✓     |UTF-16|
|UTF16BE |✓     |✓     |UTF-16BE (big-endian)|
|UTF16LE |✓     |✓     |UTF-16LE (little-endian)|
|UTF32   |✓     |      |UTF-32|
|UNICODE |✓     |✓     |(JavaScript's internal encoding. *See [About `UNICODE`](#about-unicode) below) |

### About `UNICODE`

In encoding.js, the internal character encoding that can be handled in JavaScript is defined as `UNICODE`.

As mentioned above ([Features](#features)), JavaScript strings are internally encoded in UTF-16 code units, and other character encodings cannot be handled properly.
Therefore, to convert to a character encoding properly represented in JavaScript, specify `UNICODE`.

(*Even if the HTML file encoding is UTF-8, specify `UNICODE` instead of `UTF8` when handling it in JavaScript.)

The value of each character code array returned from `Encoding.convert` is a number of 0-255 if you specify a character code other than `UNICODE` such as `UTF8` or `SJIS`,
or a number of `0-65535` (range of `String.prototype.charCodeAt()` values = Code Unit) if you specify `UNICODE`.

## Example usage

Convert character encoding from JavaScript string (`UNICODE`) to `SJIS`.

```javascript
const unicodeArray = Encoding.stringToCode('こんにちは'); // Convert string to code array
const sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE'
});
console.log(sjisArray);
// [130, 177, 130, 241, 130, 201, 130, 191, 130, 205] ('こんにちは' array in SJIS)
```

Convert character encoding from `SJIS` to `UNICODE`.

```javascript
var sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205
]; // 'こんにちは' array in SJIS

var unicodeArray = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'SJIS'
});
var str = Encoding.codeToString(unicodeArray); // Convert code array to string
console.log(str); // 'こんにちは'
```

Detect character encoding.

```javascript
var data = [
  227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175
]; // 'こんにちは' array in UTF-8

var detectedEncoding = Encoding.detect(data);
console.log('Character encoding is ' + detectedEncoding); // 'Character encoding is UTF8'
```

(Node.js) Example of reading a text file written in `SJIS`.

```javascript
const fs = require('fs');
const Encoding = require('encoding-japanese');

const sjisBuffer = fs.readFileSync('./sjis.txt');
const unicodeArray = Encoding.convert(sjisBuffer, {
  to: 'UNICODE',
  from: 'SJIS'
});
console.log(Encoding.codeToString(unicodeArray));
```

## Demo

* [Test for character encoding conversion (Demo)](http://polygonplanet.github.io/encoding.js/tests/encoding-test.html)
* [Detect and Convert encoding from file (Demo)](http://polygonplanet.github.io/encoding.js/tests/detect-file-encoding.html)

----

## API

* [detect](#detect-character-encoding-detect)
* [convert](#convert-character-encoding-convert)
* [urlEncode / urlDecode](#url-encodedecode)
* [base64Encode / base64Decode](#base64-encodedecode)
* [codeToString / stringToCode](#code-array-to-string-conversion-codetostringstringtocode)
* [Japanese Zenkaku / Hankaku conversion](#japanese-zenkakuhankaku-conversion)

### Detect character encoding (detect)

* {_string|boolean_} Encoding.**detect** ( data [, encodings ] )  
  Detect character encoding.  
  @param {_Array|TypedArray|string_} _data_ Target data  
  @param {_string|Array_} [_encodings_] (Optional) The encoding name that to specify the detection (value of [Supported encodings](#supported-encodings))  
  @return {_string|boolean_} Return the detected character encoding, or false.

The return value is one of the above "[Supported encodings](#supported-encodings)" or false if it cannot be detected.

```javascript
var sjisArray = [130, 168, 130, 205, 130, 230]; // 'おはよ' array in SJIS
var detectedEncoding = Encoding.detect(sjisArray);
console.log('Encoding is ' + detectedEncoding); // 'Encoding is SJIS'
```

Example of specifying the character encoding to be detected. 
If the second argument `encodings` is specified, returns true when it is the specified character encoding, false otherwise.

```javascript
var sjisArray = [130, 168, 130, 205, 130, 230];
var isSJIS = Encoding.detect(sjisArray, 'SJIS');
if (isSJIS) {
  console.log('Encoding is SJIS');
}
```

### Convert character encoding (convert)

* {_Array|TypedArray|string_} Encoding.**convert** ( data, to\_encoding [, from\_encoding ] )  
  Converts character encoding.  
  @param {_Array|TypedArray|Buffer|string_} _data_ The target data.  
  @param {_string|Object_} _to\_encoding_ The encoding name of conversion destination, or option to convert as an object.  
  @param {_string|Array_} [_from\_encoding_] (Optional) The encoding name of the source or 'AUTO'.  
  @return {_Array|TypedArray|string_}  Return the converted array/string.

Example of converting a character code array to Shift_JIS from UTF-8.

```javascript
var utf8Array = [227, 129, 130]; // "あ" in UTF-8
var sjisArray = Encoding.convert(utf8Array, 'SJIS', 'UTF8');
console.log(sjisArray); // [130, 160] ("あ" in SJIS)
```

TypedArray such as `Uint8Array`, and `Buffer` of Node.js can be converted in the same usage.

```javascript
var utf8Array = new Uint8Array([227, 129, 130]);
Encoding.convert(utf8Array, 'SJIS', 'UTF8');
```

Converts character encoding by auto-detecting the encoding name of the source.

```javascript
// The character encoding is automatically detected when the from_encoding argument is omitted
var utf8Array = [227, 129, 130];
var sjisArray = Encoding.convert(utf8Array, 'SJIS');

// Or explicitly specify 'AUTO' to auto-detecting
sjisArray = Encoding.convert(utf8Array, 'SJIS', 'AUTO');
```

#### Specify conversion options to the argument `to_encoding` as an object

You can specify the second argument `to_encoding` as an object for improving readability.

```javascript
var sjisArray = Encoding.convert(utf8Array, {
  to: 'SJIS', // to_encoding
  from: 'UTF8' // from_encoding
});
```

#### Specify the return type by the `type` option

`convert` returns an array by default, but you can change the return type by specifying the `type` option.
Also, if the argument `data` is passed as a string and the` type` option is not specified, then `type` ='string' is assumed (returns as a string).

```javascript
var sjisArray = [130, 168, 130, 205, 130, 230]; // 'おはよ' array in SJIS
var unicodeString = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'SJIS',
  type: 'string' // Specify 'string' to return as string
});
console.log(unicodeString); // 'おはよ'
```

The following `type` options are supported

* **string** : Return as a string
* **arraybuffer** : Return as an ArrayBuffer (`Uint16Array`)
* **array** :  Return as an Array (*default*)

#### Replace to HTML entity (Numeric character reference) when cannot be represented

Characters that cannot be represented in the target character set are replaced with '?' (U+003F) by default but can be replaced with HTML entities by specifying the `fallback` option.

The `fallback` option supports the following values.

* **html-entity** : Replace to HTML entity (decimal HTML numeric character reference)
* **html-entity-hex** : Replace to HTML entity (hexadecimal HTML numeric character reference)

Example of specifying `{ fallback: 'html-entity' }` option

```javascript
var unicodeArray = Encoding.stringToCode('寿司🍣ビール🍺');
// No fallback specified
var sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE'
});
console.log(sjisArray); // Converted to a code array of '寿司?ビール?'

// Specify `fallback: html-entity`
sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE',
  fallback: 'html-entity'
});
console.log(sjisArray); // Converted to a code array of '寿司&#127843;ビール&#127866;'
```

Example of specifying `{ fallback: 'html-entity-hex' }` option

```javascript
var unicodeArray = Encoding.stringToCode('ホッケの漢字は𩸽');
var sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE',
  fallback: 'html-entity-hex'
});
console.log(sjisArray); // Converted to a code array of 'ホッケの漢字は&#x29e3d;'
```

#### Specify BOM in UTF-16

You can add a BOM (byte order mark) by specifying the `bom` option when converting to `UTF16`.
The default is no BOM.

```javascript
var utf16Array = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: true // Add BOM
});
```

`UTF16` byte order is big-endian by default.
If you want to convert as little-endian, specify the `{ bom: 'LE' }` option.

```javascript
var utf16leArray = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: 'LE' // With BOM (little-endian)
});
```

If you do not need BOM, use `UTF16BE` or `UTF16LE`.
`UTF16BE` is big-endian, and `UTF16LE` is little-endian, and both have no BOM.

```javascript
var utf16beArray = Encoding.convert(utf8Array, {
  to: 'UTF16BE',
  from: 'UTF8'
});
```

### URL Encode/Decode

* {_string_} Encoding.**urlEncode** ( data )  
  URL(percent) encode.  
  @param {_Array_|_TypedArray_} _data_ Target data.  
  @return {_string_}  Return the encoded string.

* {_Array_} Encoding.**urlDecode** ( string )  
  URL(percent) decode.  
  @param {_string_} _string_ Target data.  
  @return {_Array_} Return the decoded array.

```javascript
var sjisArray = [130, 177, 130, 241, 130, 201, 130, 191, 130, 205];
var encoded = Encoding.urlEncode(sjisArray);
console.log(encoded); // '%82%B1%82%F1%82%C9%82%BF%82%CD'

var decoded = Encoding.urlDecode(encoded);
console.log(decoded); // [130, 177, 130, 241, 130, 201, 130, 191, 130, 205]
```

### Base64 Encode/Decode

* {_string_} Encoding.**base64Encode** ( data )  
  Base64 encode.  
  @param {_Array_|_TypedArray_} _data_ Target data.  
  @return {_string_}  Return the Base64 encoded string.

* {_Array_} Encoding.**base64Decode** ( string )  
  Base64 decode.  
  @param {_string_} _string_ Target data.  
  @return {_Array_} Return the Base64 decoded array.

```javascript
var sjisArray = [130, 177, 130, 241, 130, 201, 130, 191, 130, 205];
var encoded = Encoding.base64Encode(sjisArray);
console.log(encoded); // 'grGC8YLJgr+CzQ=='

var decoded = Encoding.base64Decode(encoded);
console.log(decoded); // [130, 177, 130, 241, 130, 201, 130, 191, 130, 205]
```

### Code array to string conversion (codeToString/stringToCode)

* {_string_} Encoding.**codeToString** ( {_Array_|_TypedArray_} data )  
  Joins a character code array to string.

* {_Array_} Encoding.**stringToCode** ( {_string_} string )  
  Splits string to an array of character codes.

### Japanese Zenkaku/Hankaku conversion

* {_Array|string_} Encoding.**toHankakuCase** ( {_Array|string_} data )  
  Convert the ascii symbols and alphanumeric characters to the zenkaku symbols and alphanumeric characters.

* {_Array|string_} Encoding.**toZenkakuCase** ( {_Array|string_} data )  
  Convert to the zenkaku symbols and alphanumeric characters from the ascii symbols and alphanumeric characters.

* {_Array|string_} Encoding.**toHiraganaCase** ( {_Array|string_} data )  
  Convert to the zenkaku hiragana from the zenkaku katakana.

* {_Array|string_} Encoding.**toKatakanaCase** ( {_Array|string_} data )  
  Convert to the zenkaku katakana from the zenkaku hiragana.

* {_Array|string_} Encoding.**toHankanaCase** ( {_Array|string_} data )  
  Convert to the hankaku katakana from the zenkaku katakana.

* {_Array|string_} Encoding.**toZenkanaCase** ( {_Array|string_} data )  
  Convert to the zenkaku katakana from the hankaku katakana.

* {_Array|string_} Encoding.**toHankakuSpace** ({_Array|string_} data )  
  Convert the em space(U+3000) to the single space(U+0020).

* {_Array|string_} Encoding.**toZenkakuSpace** ( {_Array|string_} data )  
  Convert the single space(U+0020) to the em space(U+3000).

## Other examples

### Example using the XMLHttpRequest and Typed arrays (Uint8Array)

This sample reads the text file written in Shift_JIS as binary data,
and displays a string that is converted to Unicode by Encoding.convert.

```javascript
var req = new XMLHttpRequest();
req.open('GET', '/my-shift_jis.txt', true);
req.responseType = 'arraybuffer';

req.onload = function (event) {
  var buffer = req.response;
  if (buffer) {
    // Shift_JIS Array
    var sjisArray = new Uint8Array(buffer);

    // Convert encoding to UNICODE (JavaScript Unicode Array).
    var unicodeArray = Encoding.convert(sjisArray, {
      to: 'UNICODE',
      from: 'SJIS'
    });

    // Join to string.
    var unicodeString = Encoding.codeToString(unicodeArray);
    console.log(unicodeString);
  }
};

req.send(null);
```

### Convert encoding for file using the File APIs

Reads file using the File APIs.  
Detect file encoding and convert to Unicode, and display it.

```html
<input type="file" id="file">
<div id="encoding"></div>
<textarea id="result" rows="5" cols="80"></textarea>

<script>
function onFileSelect(event) {
  var file = event.target.files[0];

  var reader = new FileReader();
  reader.onload = function(e) {
    var codes = new Uint8Array(e.target.result);
    var encoding = Encoding.detect(codes);
    document.getElementById('encoding').textContent = encoding;

    // Convert encoding to unicode
    var unicodeString = Encoding.convert(codes, {
      to: 'unicode',
      from: encoding,
      type: 'string'
    });
    document.getElementById('result').value = unicodeString;
  };

  reader.readAsArrayBuffer(file);
}

document.getElementById('file').addEventListener('change', onFileSelect, false);
</script>
```

[**Demo**](http://polygonplanet.github.io/encoding.js/tests/detect-file-encoding.html)

## Contributing

We welcome contributions from everyone.
For bug reports and feature requests, please [create an issue on GitHub](https://github.com/polygonplanet/encoding.js/issues).

### Pull requests

Please run `$ npm run test` before the pull request to confirm there are no errors.
We only accept requests without errors.

## License

MIT



