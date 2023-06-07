encoding.js
===========

[![NPM Version](https://img.shields.io/npm/v/encoding-japanese.svg)](https://www.npmjs.com/package/encoding-japanese)
[![GitHub Actions Build Status](https://github.com/polygonplanet/encoding.js/actions/workflows/ci.yml/badge.svg)](https://github.com/polygonplanet/encoding.js/actions)
[![GitHub License](https://img.shields.io/github/license/polygonplanet/encoding.js.svg)](https://github.com/polygonplanet/encoding.js/blob/master/LICENSE)

JavaScript で文字コードの変換や判定をします。

[**README (English)**](README.md)

## Table of contents

- [特徴](#特徴)
  * [各文字コードを文字列で扱うには？](#各文字コードを文字列で扱うには)
- [インストール](#インストール)
  * [npm](#npm)
    + [TypeScript](#typescript)
  * [ブラウザ](#ブラウザ)
  * [CDN](#cdn)
- [対応する文字コード](#対応する文字コード)
  * [`UNICODE` について](#unicode-について)
- [使い方の例](#使い方の例)
- [Demo](#demo)
- [API](#api)
  * [文字コードを判定する (detect)](#文字コードを判定する-detect)
  * [文字コードを変換する (convert)](#文字コードを変換する-convert)
    + [引数 `to` にオブジェクトで変換オプションを指定する](#引数-to-にオブジェクトで変換オプションを指定する)
    + [`type` オプションで戻り値の型を指定する](#type-オプションで戻り値の型を指定する)
    + [変換できない文字を HTML エンティティ (HTML 数値文字参照) に置き換える](#変換できない文字を-html-エンティティ-html-数値文字参照-に置き換える)
    + [UTF-16 に BOM をつける](#utf-16-に-bom-をつける)
  * [URL Encode/Decode](#url-encodedecode)
  * [Base64 Encode/Decode](#base64-encodedecode)
  * [配列から文字列の相互変換 (codeToString/stringToCode)](#配列から文字列の相互変換-codetostringstringtocode)
  * [全角・半角変換](#全角半角変換)
- [その他の例](#その他の例)
  * [XMLHttpRequest と Typed arrays (Uint8Array) を使用した例](#xmlhttprequest-と-typed-arrays-uint8array-を使用した例)
  * [File API を使用したファイルの文字コード判定・変換例](#file-api-を使用したファイルの文字コード判定変換例)
- [Contributing](#contributing)
- [License](#license)

## 特徴

encoding.js は、文字コードの変換や判定をする JavaScript ライブラリです。  
Shift_JIS や EUC-JP、JIS など日本語の文字コードや、 UTF-8、UTF-16 などの Unicode に対応しています。

JavaScript の文字列は内部で UTF-16 コードユニットとして符号化されるため、文字列のままでは他の文字コードを正しく扱えませんが ([参照: ECMAScript® 2019 Language Specification - 6.1.4 The String Type](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-ecmascript-language-types-string-type))、encoding.js では文字列ではなく配列として扱い変換を実現しています。  
各文字コードは、例えば `[130, 160]` (UTF-8の「あ」) などの文字コード値を持つ数値の配列として扱います。

また、encoding.js の各メソッドに渡す文字コードの配列は、`Uint8Array` などの TypedArray や Node.js の `Buffer` でも使えます。

### 各文字コードを文字列で扱うには？

文字コードの数値配列から文字列には [`Encoding.codeToString`](#配列から文字列の相互変換-codetostringstringtocode) などのメソッドで変換できますが、JavaScript は上記の特徴があるため文字列化してしまうと文字コードによっては正しく扱えません。

そのため配列でなく文字列で扱いたい場合は、 [`Encoding.urlEncode`](#url-encodedecode) と [`Encoding.urlDecode`](#url-encodedecode) を通して `'%82%A0'` のようなパーセントでエンコードされた文字列に変換すると、他のリソースに受け渡しが可能です。
または、[`Encoding.base64Encode`](#base64-encodedecode) と [`Encoding.base64Decode`](#base64-encodedecode) でも同様な方法で文字列として受け渡しができます。

## インストール

### npm

npm では `encoding-japanese` というパッケージ名で公開されています。

```bash
$ npm install --save encoding-japanese
```

#### `import` で読み込む

```javascript
import Encoding from 'encoding-japanese';
```

#### `require` で読み込む

```javascript
const Encoding = require('encoding-japanese');
```

#### TypeScript

encoding.js の TypeScript 型定義は [@types/encoding-japanese](https://www.npmjs.com/package/@types/encoding-japanese) から利用できます ([@rhysd](https://github.com/rhysd) さんありがとうございます)。

```bash
$ npm install --save-dev @types/encoding-japanese
```

### ブラウザ

npm からインストール、または[リリース一覧](https://github.com/polygonplanet/encoding.js/tags)からダウンロードしたパッケージ内の `encoding.js` をご使用ください。  
※ `git clone` した場合は、masterブランチであっても開発中の状態の可能性がありますのでご注意ください

```html
<script src="encoding.js"></script>
```

または minify された `encoding.min.js` を使用します。

```html
<script src="encoding.min.js"></script>
```

ブラウザで読み込むと **`Encoding`** というオブジェクトがグローバルに (`window.Encoding` として) 定義されます。

### CDN

[cdnjs.com](https://cdnjs.com/libraries/encoding-japanese) で encoding.js (パッケージ名: `encoding-japanese`) の CDN が利用できます。

## 対応する文字コード

|encoding.js での値|[`detect()`](#文字コードを判定する-detect)|[`convert()`](#文字コードを変換する-convert)|MIME名 (備考)|
|:------:|:----:|:-----:|:---|
|ASCII   |✓     |      |US-ASCII (コードポイントの範囲: `0-127`)|
|BINARY  |✓     |      |(バイナリー文字列。コードポイントの範囲: `0-255`)|
|EUCJP   |✓     |✓     |EUC-JP|
|JIS     |✓     |✓     |ISO-2022-JP|
|SJIS    |✓     |✓     |Shift_JIS|
|UTF8    |✓     |✓     |UTF-8|
|UTF16   |✓     |✓     |UTF-16|
|UTF16BE |✓     |✓     |UTF-16BE (big-endian)|
|UTF16LE |✓     |✓     |UTF-16LE (little-endian)|
|UTF32   |✓     |      |UTF-32|
|UNICODE |✓     |✓     |(JavaScript の文字列。※以下の [`UNICODE` について](#unicode-について) 参照) |

### `UNICODE` について

encoding.js では JavaScript で扱える内部文字コード (JavaScript の文字列) のことを `UNICODE` と定義しています。

[上記 (特徴)](#特徴) のように、JavaScript の文字列は内部的に UTF-16 コードユニットとして符号化されるため、他の文字コードは正しく扱えません。
そのため、[`Encoding.convert`](#文字コードを変換する-convert) によって JavaScript で扱える文字コード配列に変換するには `UNICODE` を指定する必要があります。
(※仮にHTMLページが UTF-8 だったとしても JavaScript で扱う場合は `UTF8` ではなく `UNICODE` を指定します)

`Encoding.convert` から返される各文字コード配列の値は `UTF8` や `SJIS` などの `UNICODE` 以外を指定した場合は `0-255` までの整数になりますが、 `UNICODE` を指定した場合 `0-65535` までの整数 (`String.prototype.charCodeAt()` の値の範囲 = Code Unit) になります。

## 使い方の例

JavaScript の文字列 (`UNICODE`) から `SJIS` に文字コードを変換する

```javascript
const unicodeArray = Encoding.stringToCode('こんにちは'); // 文字列から文字コード値の配列に変換
const sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE'
});
console.log(sjisArray);
// [130, 177, 130, 241, 130, 201, 130, 191, 130, 205] (SJISの 'こんにちは' の配列)
```

`SJIS` から `UNICODE` に文字コードを変換する

```javascript
var sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205
]; // SJISで'こんにちは'の配列

var unicodeArray = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'SJIS'
});
var str = Encoding.codeToString(unicodeArray); // 文字コード値の配列から文字列に変換
console.log(str); // 'こんにちは'
```

文字コードを判定する

```javascript
var data = [
  227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175
]; // UTF-8で'こんにちは'の配列

var detectedEncoding = Encoding.detect(data);
console.log('文字コードは' + detectedEncoding); // '文字コードはUTF8'
```

(Node.js) `SJIS` で書かれたテキストを読み込む例

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

* [文字コード変換テスト(Demo)](https://polygonplanet.github.io/encoding.js/tests/encoding-test.html)
* [ファイルから文字コードの判定・変換(Demo)](https://polygonplanet.github.io/encoding.js/tests/detect-file-encoding.html)

----

## API

* [detect](#文字コードを判定する-detect)
* [convert](#文字コードを変換する-convert)
* [urlEncode / urlDecode](#url-encodedecode)
* [base64Encode / base64Decode](#base64-encodedecode)
* [codeToString / stringToCode](#配列から文字列の相互変換-codetostringstringtocode)
* [全角・半角変換](#全角半角変換)

### 文字コードを判定する (detect)

* {_string|boolean_} Encoding.**detect** ( data [, encodings ] )  
  文字コードを判定します  
  @param {_Array|TypedArray|string_} _data_ 対象のデータ  
  @param {_string|Array_} [_encodings_] (省略可) 判定を絞り込む際の文字コード (「[対応する文字コード](#対応する文字コード)」の値)  
  @return {_string|boolean_}  判定された文字コード、または false が返ります

戻り値は、上記の「[対応する文字コード](#対応する文字コード)」のいずれかになり、判定できなかった場合は false が返ります。

```javascript
var sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
var detectedEncoding = Encoding.detect(sjisArray);
console.log('文字コードは' + detectedEncoding); // '文字コードはSJIS'
```

判定する文字コードを指定する例。  
第二引数 `encodings` を指定すると、指定した文字コードであれば true、そうでない場合は false が返ります。

```javascript
var sjisArray = [130, 168, 130, 205, 130, 230];
var isSJIS = Encoding.detect(sjisArray, 'SJIS');
if (isSJIS) {
  console.log('文字コードはSJISです');
}
```

### 文字コードを変換する (convert)

* {_Array|TypedArray|string_} Encoding.**convert** ( data, to\_encoding [, from\_encoding ] )  
  文字コードを変換します  
  @param {_Array|TypedArray|Buffer|string_} _data_ 文字コードを変換する対象の配列、または文字列  
  @param {_string|Object_} _to\_encoding_ 変換先の文字コード、またはオブジェクト指定で変換オプション  
  @param {_string|Array_} [_from\_encoding_] (省略可) 変換元の文字コード (省略または `AUTO` を指定すると自動判定)  
  @return {_Array|TypedArray|string_}  変換した文字コードの数値配列、または(文字列を渡した場合)文字列が返ります

UTF-8 の文字コード配列を Shift_JIS に変換する

```javascript
var utf8Array = [227, 129, 130]; // UTF-8 の「あ」
var sjisArray = Encoding.convert(utf8Array, 'SJIS', 'UTF8');
console.log(sjisArray); // [130, 160] (SJISの「あ」)
```

`Uint8Array` などの TypedArray や、Node.js の `Buffer` も同様に扱えます。

```javascript
var utf8Array = new Uint8Array([227, 129, 130]);
Encoding.convert(utf8Array, 'SJIS', 'UTF8');
```

変換元の文字コードを自動判定して変換。

```javascript
// 引数 from_encoding を省略すると文字コードを自動判定します
var utf8Array = [227, 129, 130];
var sjisArray = Encoding.convert(utf8Array, 'SJIS');

// または明示的に 'AUTO' と指定できます
sjisArray = Encoding.convert(utf8Array, 'SJIS', 'AUTO');
```

#### 引数 `to` にオブジェクトで変換オプションを指定する

第二引数 `to` に変換オプションとしてオブジェクトを渡すことで、わかりやすく記述することができます。
また、下記の `type`、 `fallback`、 `bom` などのオプションを指定する際は、オブジェクトでの指定が必要になります。

```javascript
var utf8Array = [227, 129, 130];
var sjisArray = Encoding.convert(utf8Array, {
  to: 'SJIS', // to_encoding
  from: 'UTF8' // from_encoding
});
```

#### `type` オプションで戻り値の型を指定する

デフォルトでは配列が返りますが、`type` オプションの指定で戻り値の型を変えられます。  
また、引数 `data` が文字列で、 `type` オプションが指定されなかった場合は `type` = 'string' とみなされます (文字列で返ります)。

```javascript
var sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
var unicodeString = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'SJIS',
  type: 'string' // 文字列で返るよう 'string' を指定
});
console.log(unicodeString); // 'おはよ'
```

以下の `type` オプションが指定できます。

* **string** : 文字列として返ります。
* **arraybuffer** : ArrayBuffer (`Uint16Array`) として返ります。
* **array** : 配列として返ります。 (デフォルト)

#### 変換できない文字を HTML エンティティ (HTML 数値文字参照) に置き換える

変換先の文字コードで表現できない文字はデフォルトで「?」 (U+003F) に置き換えられますが、`fallback` オプションを指定すると HTML エンティティに置き換えることができます。

`fallback` オプションは以下の値が使用できます。

* **html-entity** : HTML エンティティ (10進数の HTML 数値文字参照) に置き換える
* **html-entity-hex** : HTML エンティティ (16進数の HTML 数値文字参照) に置き換える

`{ fallback: 'html-entity' }` オプションを指定する例

```javascript
var unicodeArray = Encoding.stringToCode('寿司🍣ビール🍺');
// fallback指定なし
var sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE'
});
console.log(sjisArray); // '寿司?ビール?' の数値配列に変換されます

// `fallback: html-entity`を指定
sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE',
  fallback: 'html-entity'
});
console.log(sjisArray); // '寿司&#127843;ビール&#127866;' の数値配列に変換されます
```

`{ fallback: 'html-entity-hex' }` オプションを指定する例

```javascript
var unicodeArray = Encoding.stringToCode('ホッケの漢字は𩸽');
var sjisArray = Encoding.convert(unicodeArray, {
  to: 'SJIS',
  from: 'UNICODE',
  fallback: 'html-entity-hex'
});
console.log(sjisArray); // 'ホッケの漢字は&#x29e3d;' の数値配列に変換されます
```

#### UTF-16 に BOM をつける

`UTF16` に変換する際に `bom` オプションを指定すると BOM (byte order mark) の付加を指定できます。
デフォルトは BOM なしになります。

```javascript
var utf16Array = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: true // BOMをつける
});
```

`UTF16` のバイトオーダーはデフォルトで big-endian になります。
little-endian として変換したい場合は `bom` オプションに `LE` を指定します。

```javascript
var utf16leArray = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: 'LE' // BOM (little-endian) をつける
});
```

BOM が不要な場合は `UTF16BE` または `UTF16LE` を使用します。

`UTF16BE` は、上位バイトが先頭側になるように並べる方式 (big-endian) で、
`UTF16LE` は上位バイトが末尾側になるように並べる方式 (little-endian) になり、どちらも BOM は付きません。

```javascript
var utf16beArray = Encoding.convert(utf8Array, {
  to: 'UTF16BE',
  from: 'UTF8'
});
```

### URL Encode/Decode

* {_string_} Encoding.**urlEncode** ( data )  
  URLエンコード (パーセントエンコード) します  
  @param {_Array_|_TypedArray_} _data_ 対象のデータ  
  @return {_string_}  エンコードされた文字列が返ります

* {_Array_} Encoding.**urlDecode** ( string )  
  URLデコード (パーセントデコード) します  
  @param {_string_} _string_ 対象の文字列  
  @return {_Array_}  デコードされた文字コード配列が返ります

```javascript
// 文字コードの配列をURLエンコード/デコード
var sjisArray = [130, 177, 130, 241, 130, 201, 130, 191, 130, 205];
var encoded = Encoding.urlEncode(sjisArray);
console.log(encoded); // '%82%B1%82%F1%82%C9%82%BF%82%CD'

var decoded = Encoding.urlDecode(encoded);
console.log(decoded); // [130, 177, 130, 241, 130, 201, 130, 191, 130, 205]
```

### Base64 Encode/Decode

* {_string_} Encoding.**base64Encode** ( data )  
  Base64エンコードします  
  @param {_Array_|_TypedArray_} _data_ 対象のデータ  
  @return {_string_}  Base64エンコードされた文字列が返ります

* {_Array_} Encoding.**base64Decode** ( string )  
  Base64デコードします  
  @param {_string_} _string_ 対象のデータ  
  @return {_Array_} Base64デコードされた文字コード配列が返ります

```javascript
var sjisArray = [130, 177, 130, 241, 130, 201, 130, 191, 130, 205];
var encoded = Encoding.base64Encode(sjisArray);
console.log(encoded); // 'grGC8YLJgr+CzQ=='

var decoded = Encoding.base64Decode(encoded);
console.log(decoded); // [130, 177, 130, 241, 130, 201, 130, 191, 130, 205]
```

### 配列から文字列の相互変換 (codeToString/stringToCode)

* {_string_} Encoding.**codeToString** ( {_Array_|_TypedArray_} data )  
  文字コード配列を文字列に変換(連結)して返します

* {_Array_} Encoding.**stringToCode** ( {_string_} string )  
  文字列を文字コード配列に変換(分割)して返します

### 全角・半角変換

以下のメソッドは `UNICODE` の文字列または `UNICODE` の文字コードの配列に対して使用できます。

* {_Array|string_} Encoding.**toHankakuCase** ( {_Array|string_} data )  
  全角英数記号文字を半角英数記号文字に変換

* {_Array|string_} Encoding.**toZenkakuCase** ( {_Array|string_} data )  
  半角英数記号文字を全角英数記号文字に変換

* {_Array|string_} Encoding.**toHiraganaCase** ( {_Array|string_} data )  
  全角カタカナを全角ひらがなに変換

* {_Array|string_} Encoding.**toKatakanaCase** ( {_Array|string_} data )  
  全角ひらがなを全角カタカナに変換

* {_Array|string_} Encoding.**toHankanaCase** ( {_Array|string_} data )  
  全角カタカナを半角ｶﾀｶﾅに変換

* {_Array|string_} Encoding.**toZenkanaCase** ( {_Array|string_} data )  
  半角ｶﾀｶﾅを全角カタカナに変換

* {_Array|string_} Encoding.**toHankakuSpace** ({_Array|string_} data )  
  全角スペース(U+3000)を半角スペース(U+0020)に変換

* {_Array|string_} Encoding.**toZenkakuSpace** ( {_Array|string_} data )  
  半角スペース(U+0020)を全角スペース(U+3000)に変換

## その他の例

### XMLHttpRequest と Typed arrays (Uint8Array) を使用した例

このサンプルでは Shift_JIS で書かれたテキストファイルをバイナリデータとして読み込み、Encoding.convert によって `UNICODE` に変換して表示します。

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

### File API を使用したファイルの文字コード判定・変換例

File API を使用してファイルを読み込みます。  
その際にファイルの文字コードを判定し、正しく表示されるよう `UNICODE` に変換して表示します。

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

[**この例のデモ**](https://polygonplanet.github.io/encoding.js/tests/detect-file-encoding.html)

## Contributing

Pull requests や Issues を歓迎しています。
バグ報告や機能要望などは [GitHub の Issues](https://github.com/polygonplanet/encoding.js/issues) をご利用ください。

### Pull requests

Pull requests をする前に、 `$ npm run test` を実行してエラーがないことをご確認ください。

## License

MIT
