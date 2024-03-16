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
  * [detect : 文字コードを判定する](#encodingdetect-data-encodings)
  * [convert : 文字コードを変換する](#encodingconvert-data-to-from)
    + [引数 `to` にオブジェクトで変換オプションを指定する](#引数-to-にオブジェクトで変換オプションを指定する)
    + [`type` オプションで戻り値の型を指定する](#type-オプションで戻り値の型を指定する)
    + [変換できない文字を HTML エンティティ (HTML 数値文字参照) に置き換える](#変換できない文字を-html-エンティティ-html-数値文字参照-に置き換える)
    + [UTF-16 に BOM をつける](#utf-16-に-bom-をつける)
  * [urlEncode : 文字コードの配列をURLエンコードする](#encodingurlencode-data)
  * [urlDecode : 文字コードの配列にURLデコードする](#encodingurldecode-string)
  * [base64Encode : 文字コードの配列を Base64 エンコードする](#encodingbase64encode-data)
  * [base64Decode : 文字コードの配列に Base64 デコードする](#encodingbase64decode-string)
  * [codeToString : 文字コードの配列を文字列に変換する](#encodingcodetostring-code)
  * [stringToCode : 文字列を文字コードの配列に変換する](#encodingstringtocode-string)
  * [全角・半角変換](#全角半角変換)
- [その他の例](#その他の例)
  * [`Fetch API` と Typed Arrays (Uint8Array) を使用した例](#fetch-api-と-typed-arrays-uint8array-を使用した例)
  * [File API を使用したファイルの文字コード判定・変換例](#file-api-を使用したファイルの文字コード判定変換例)
- [Contributing](#contributing)
- [License](#license)

## 特徴

encoding.js は、文字コードの変換や判定をする JavaScript ライブラリです。  
`Shift_JIS` や `EUC-JP`、`ISO-2022-JP` など日本語の文字コードや、 `UTF-8`、`UTF-16` などの Unicode に対応しています。

JavaScript の文字列は内部で UTF-16 コードユニットとして符号化されるため、文字列のままでは他の文字コードを正しく扱えませんが ([参照: ECMAScript® 2019 Language Specification - 6.1.4 The String Type](https://www.ecma-international.org/ecma-262/10.0/index.html#sec-ecmascript-language-types-string-type))、encoding.js では文字列ではなく配列として扱い変換を実現しています。  
各文字コードは、例えば `[130, 160]` (UTF-8の「あ」) などの文字コード値を持つ数値の配列として扱います。

また、encoding.js の各メソッドに渡す文字コードの配列は、`Uint8Array` などの TypedArray や Node.js の `Buffer` でも使えます。

### 各文字コードを文字列で扱うには？

文字コードの数値配列から文字列には [`Encoding.codeToString`](#encodingcodetostring-code) などのメソッドで変換できますが、JavaScript は上記の特徴があるため文字列化してしまうと文字コードによっては正しく扱えません。

そのため配列でなく文字列で扱いたい場合は、 [`Encoding.urlEncode`](#encodingurlencode-data) と [`Encoding.urlDecode`](#encodingurldecode-string) を通して `'%82%A0'` のようなパーセントでエンコードされた文字列に変換すると、他のリソースに受け渡しが可能です。
または、[`Encoding.base64Encode`](#encodingbase64encode-data) と [`Encoding.base64Decode`](#encodingbase64decode-string) でも同様な方法で文字列として受け渡しができます。

## インストール

### npm

npm では `encoding-japanese` というパッケージ名で公開されています。

```bash
npm install --save encoding-japanese
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
npm install --save-dev @types/encoding-japanese
```

### ブラウザ

npm経由でインストールするか、または[リリース一覧](https://github.com/polygonplanet/encoding.js/tags)からダウンロードしたパッケージ内の `encoding.js` をご使用ください。  
※ `git clone` した場合は、*master* (または *main*) ブランチであっても開発中の状態の可能性がありますのでご注意ください。

```html
<script src="encoding.js"></script>
```

minify された `encoding.min.js` も使用できます。

```html
<script src="encoding.min.js"></script>
```

ブラウザで読み込むと **`Encoding`** というオブジェクトがグローバルに (`window.Encoding` として) 定義されます。

### CDN

`<script>` タグで CDN から直接 encoding.js (パッケージ名: `encoding-japanese`) を利用できます。

```html
<script src="https://unpkg.com/encoding-japanese@2.0.0/encoding.min.js"></script>
```

この例では [unpkg](https://unpkg.com/encoding-japanese/) を使用していますが、
[cdnjs](https://cdnjs.com/libraries/encoding-japanese) や [jsDelivr](https://www.jsdelivr.com/package/npm/encoding-japanese) など
npm パッケージを提供する他の CDN も利用できます。

## 対応する文字コード

|encoding.js での値|[`detect()`](#encodingdetect-data-encodings)|[`convert()`](#encodingconvert-data-to-from)|MIME名 (備考)|
|:------:|:----:|:-----:|:---|
|ASCII   |✓    |       |US-ASCII (コードポイントの範囲: `0-127`)|
|BINARY  |✓    |       |(バイナリー文字列。コードポイントの範囲: `0-255`)|
|EUCJP   |✓    |✓     |EUC-JP|
|JIS     |✓    |✓     |ISO-2022-JP|
|SJIS    |✓    |✓     |Shift_JIS|
|UTF8    |✓    |✓     |UTF-8|
|UTF16   |✓    |✓     |UTF-16|
|UTF16BE |✓    |✓     |UTF-16BE (big-endian)|
|UTF16LE |✓    |✓     |UTF-16LE (little-endian)|
|UTF32   |✓    |       |UTF-32|
|UNICODE |✓    |✓     |(JavaScript の文字列。※以下の [`UNICODE` について](#unicode-について) 参照) |

### `UNICODE` について

encoding.js では JavaScript で扱える内部文字コード (JavaScript の文字列) のことを `UNICODE` と定義しています。

[上記 (特徴)](#特徴) のように、JavaScript の文字列は内部的に UTF-16 コードユニットとして符号化されるため、他の文字コードは正しく扱えません。
そのため、[`Encoding.convert`](#encodingconvert-data-to-from) によって JavaScript で扱える文字コード配列に変換するには `UNICODE` を指定する必要があります。
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
const sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205
]; // SJISで'こんにちは'の配列

const unicodeArray = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'SJIS'
});
const str = Encoding.codeToString(unicodeArray); // 文字コード値の配列から文字列に変換
console.log(str); // 'こんにちは'
```

文字コードを判定する

```javascript
const data = [
  227, 129, 147, 227, 130, 147, 227, 129, 171, 227, 129, 161, 227, 129, 175
]; // UTF-8で'こんにちは'の配列

const detectedEncoding = Encoding.detect(data);
console.log(`文字コードは${detectedEncoding}`); // '文字コードはUTF8'
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

* [detect](#encodingdetect-data-encodings)
* [convert](#encodingconvert-data-to-from)
* [urlEncode](#encodingurlencode-data)
* [urlDecode](#encodingurldecode-string)
* [base64Encode](#encodingbase64encode-data)
* [base64Decode](#encodingbase64decode-string)
* [codeToString](#encodingcodetostring-code)
* [stringToCode](#encodingstringtocode-string)
* [全角・半角変換](#全角半角変換)

----

### Encoding.detect (data, [encodings])

指定されたデータの文字コードを判定します。

#### パラメータ

* **data** *(Array\<number\>|TypedArray|Buffer|string)* : 文字コードを判定する対象の配列または文字列。
* **\[encodings\]** *(string|Array\<string\>|Object)* : (省略可) 判定を限定する文字コードを文字列または配列で指定します。
  省略または `AUTO` を指定すると自動判定になります。
  `SJIS`, `UTF8` などの [対応する文字コード](#対応する文字コード) に記載されている値を参照してください。

#### 戻り値

*(string|boolean)* : 判定された文字コード (`SJIS` や `UTF8` など「[対応する文字コード](#対応する文字コード)」のいずれか)、または判定できなかった場合は `false` を返します。
引数 `encodings` を指定した場合、`data` が指定された文字コードに一致すればその文字コード名を返し、そうでなければ `false` を返します。

#### 例

文字コードを判定する例:

```javascript
const sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
const detectedEncoding = Encoding.detect(sjisArray);
console.log(`文字コードは${detectedEncoding}`); // '文字コードはSJIS'
```

第二引数 `encodings` を使用して判定する文字コードを指定する例。
指定した文字コードが一致する場合はその文字コードを文字列で返し、そうでない場合は `false` が返ります:

```javascript
const sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
const detectedEncoding = Encoding.detect(sjisArray, 'SJIS');
if (detectedEncoding) {
  console.log('文字コードはSJISです');
} else {
  console.log('SJISとして判定できませんでした');
}
```

複数の文字コードを指定して判定を限定する例:

```javascript
const sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
const detectedEncoding = Encoding.detect(sjisArray, ['UTF8', 'SJIS']);
if (detectedEncoding) {
  console.log(`文字コードは${detectedEncoding}`); // '文字コードはSJIS'
} else {
  console.log('UTF8またはSJISとして判定できませんでした');
}
```

----

### Encoding.convert (data, to[, from])

指定されたデータの文字コードを変換します。

#### パラメータ

* **data** *(Array\<number\>|TypedArray|Buffer|string)* : 文字コードを変換する対象の配列または文字列。
* **to** *(string|Object)* : 変換先の文字コード、またはオブジェクト指定で変換オプション。
  `SJIS`, `UTF8` などの [対応する文字コード](#対応する文字コード) に記載されている値を参照してください。
* **\[from\]** *(string|Array\<string\>)* : (省略可) 変換元の文字コードを文字列または配列で指定します。
  省略または `AUTO` を指定すると自動判定になります。

#### 戻り値

*(Array\<number\>|TypedArray|string)* : 変換した文字コードの数値配列を返します。
引数 `data` に文字列を渡した場合は、文字列で（変換した文字コードの数値配列を文字列に変換して）返します。

#### 例

UTF-8 の文字コード配列を Shift_JIS に変換する例:

```javascript
const utf8Array = [227, 129, 130]; // UTF-8 の「あ」
const sjisArray = Encoding.convert(utf8Array, 'SJIS', 'UTF8');
console.log(sjisArray); // [130, 160] (SJISの「あ」)
```

`Uint8Array` などの TypedArray や、Node.js の `Buffer` も同様に扱えます。

```javascript
const utf8Array = new Uint8Array([227, 129, 130]);
const sjisArray = Encoding.convert(utf8Array, 'SJIS', 'UTF8');
```

変換元の文字コードを自動判定して変換:

```javascript
// 引数 from を省略すると文字コードを自動判定します
const utf8Array = [227, 129, 130];
let sjisArray = Encoding.convert(utf8Array, 'SJIS');
// または明示的に 'AUTO' と指定できます
sjisArray = Encoding.convert(utf8Array, 'SJIS', 'AUTO');
```

#### 引数 `to` にオブジェクトで変換オプションを指定する

第二引数 `to` に変換オプションとしてオブジェクトを渡すことで、わかりやすく記述することができます。
また、下記の `type`、 `fallback`、 `bom` などのオプションを指定する際は、オブジェクトでの指定が必要になります。

```javascript
const utf8Array = [227, 129, 130];
const sjisArray = Encoding.convert(utf8Array, {
  to: 'SJIS',
  from: 'UTF8'
});
```

#### `type` オプションで戻り値の型を指定する

デフォルトでは配列が返りますが、`type` オプションの指定で戻り値の型を変えられます。  
また、引数 `data` が文字列で、 `type` オプションが指定されなかった場合は `type` = 'string' とみなされます (文字列で返ります)。

```javascript
const sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
const unicodeString = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'SJIS',
  type: 'string' // 文字列で返るよう 'string' を指定
});
console.log(unicodeString); // 'おはよ'
```

以下の `type` オプションが指定できます。

* **string** : 文字列として返ります。
* **arraybuffer** : ArrayBuffer として (歴史的な理由で実際には `Uint16Array` が) 返ります。
* **array** : 配列として返ります。 (デフォルト)

`type: 'string'` は、配列から文字列に変換する [`Encoding.codeToString`](#encodingcodetostring-code) のショートハンドとして使用することができます。  
※ `UNICODE` への変換以外は `type: 'string'` を指定しても正しく扱えない可能性がありますのでご注意ください

#### 変換できない文字を HTML エンティティ (HTML 数値文字参照) に置き換える

変換先の文字コードで表現できない文字はデフォルトで「?」 (U+003F) に置き換えられますが、
`fallback` オプションを指定すると `&#127843;` 等の HTML エンティティに置き換えることができます。

`fallback` オプションは以下の値が使用できます。

* **html-entity** : HTML エンティティ (10進数の HTML 数値文字参照) に置き換える
* **html-entity-hex** : HTML エンティティ (16進数の HTML 数値文字参照) に置き換える

`{ fallback: 'html-entity' }` オプションを指定する例:

```javascript
const unicodeArray = Encoding.stringToCode('寿司🍣ビール🍺');
// fallback指定なし
let sjisArray = Encoding.convert(unicodeArray, {
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

`{ fallback: 'html-entity-hex' }` オプションを指定する例:

```javascript
const unicodeArray = Encoding.stringToCode('ホッケの漢字は𩸽');
const sjisArray = Encoding.convert(unicodeArray, {
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
const utf16Array = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: true // BOMをつける
});
```

`UTF16` のバイトオーダーはデフォルトで big-endian になります。
little-endian として変換したい場合は `bom` オプションに `LE` を指定します。

```javascript
const utf16leArray = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: 'LE' // BOM (little-endian) をつける
});
```

BOM が不要な場合は `UTF16BE` または `UTF16LE` を指定することができます。

`UTF16BE` は、上位バイトが先頭側になるように並べる方式 (big-endian) で、
`UTF16LE` は上位バイトが末尾側になるように並べる方式 (little-endian) になり、どちらも BOM は付きません。

```javascript
const utf16beArray = Encoding.convert(utf8Array, {
  to: 'UTF16BE',
  from: 'UTF8'
});
```

----

### Encoding.urlEncode (data)

文字コードの数値配列を URI 構成要素としてエンコード（パーセントエンコーディング）された `%xx` 形式の文字列に変換します。

urlEncode は [`encodeURIComponent()`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) と同じく、
下記を除くすべての文字をエスケープします。

```
エスケープされないもの:
    A-Z a-z 0-9 - _ . ! ~ * ' ( )
```

#### パラメータ

* **data** *(Array\<number\>|TypedArray|Buffer|string)* : エンコードする対象の配列または文字列。

#### 戻り値

*(string)* : URI 構成要素としてエンコードされた (`%xx` 形式) の文字列が返ります。

#### 例

Shift_JIS の配列を URL エンコードする例:

```javascript
const sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
const encodedStr = Encoding.urlEncode(sjisArray);
console.log(encodedStr); // '%82%A8%82%CD%82%E6'
```

----

### Encoding.urlDecode (string)

`%xx` 形式のパーセントエンコーディングされた文字列（URI 構成要素としてエンコードされた文字列）を文字コードの数値配列にデコードします。

#### パラメータ

* **string** *(string)* : デコードする対象の文字列。

#### 戻り値

*(Array\<number\>)* : デコードされた文字コードの数値配列が返ります。

#### 例

URL エンコードされた Shift_JIS の文字列をデコードする例:

```javascript
const encodedStr = '%82%A8%82%CD%82%E6'; // 'おはよ' が SJIS で URL エンコードされたもの
const sjisArray = Encoding.urlDecode(encodedStr);
console.log(sjisArray); // [130, 168, 130, 205, 130, 230]
```

----

### Encoding.base64Encode (data)

文字コードの数値配列を Base64 エンコードされた文字列に変換します。

#### パラメータ

* **data** *(Array\<number\>|TypedArray|Buffer|string)* : Base64 エンコードする対象の配列または文字列。

#### 戻り値

*(string)* : Base64 エンコードされた文字列が返ります。

#### 例

Shift_JIS の配列を Base64 エンコードする例:

```javascript
const sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
const encodedStr = Encoding.base64Encode(sjisArray);
console.log(encodedStr); // 'gqiCzYLm'
```

----

### Encoding.base64Decode (string)

Base64 エンコードされた文字列を文字コードの数値配列に変換します。

#### パラメータ

* **string** *(string)* : Base64 エンコードされた文字列。

#### 戻り値

*(Array\<number\>)* : Base64 デコードした文字コードの数値配列が返ります。

#### 例

`base64Encode` と `base64Decode` の例:

```javascript
const sjisArray = [130, 177, 130, 241, 130, 201, 130, 191, 130, 205]; // SJISの「こんにちは」
const encodedStr = Encoding.base64Encode(sjisArray);
console.log(encodedStr); // 'grGC8YLJgr+CzQ=='

const decodedArray = Encoding.base64Decode(encodedStr);
console.log(decodedArray); // [130, 177, 130, 241, 130, 201, 130, 191, 130, 205]
```

----

### Encoding.codeToString (code)

文字コードの数値配列を文字列に変換します。

#### パラメータ

* **code** *(Array\<number\>|TypedArray|Buffer)* : 文字列に変換する対象の文字コード配列。

#### 戻り値

*(string)* : 変換した文字列が返ります。

#### 例

文字コードの数値配列を文字列に変換する例:

```javascript
const sjisArray = [130, 168, 130, 205, 130, 230]; // SJISで「おはよ」の配列
const unicodeArray = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'SJIS'
});
const unicodeStr = Encoding.codeToString(unicodeArray);
console.log(unicodeStr); // 'おはよ'
```

----

### Encoding.stringToCode (string)

文字列を文字コードの数値配列に変換します。

#### パラメータ

* **string** *(string)* : 変換する対象の文字列。

#### 戻り値

*(Array\<number\>)* : 変換した文字コードの数値配列が返ります。

#### 例

文字列を文字コードの数値配列に変換する例:

```javascript
const unicodeArray = Encoding.stringToCode('おはよ');
console.log(unicodeArray); // [12362, 12399, 12424]
```

----

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

### `Fetch API` と Typed Arrays (Uint8Array) を使用した例

この例では Shift_JIS で書かれたテキストファイルをバイナリデータとして読み込み、
[Encoding.convert](#encodingconvert-data-to-from) によって `UNICODE` に変換して表示します。

```javascript
(async () => {
  try {
    const response = await fetch('shift_jis.txt');
    const buffer = await response.arrayBuffer();

    // ファイルから読み込んだSJISの文字コード配列
    const sjisArray = new Uint8Array(buffer);

    // SJISからUNICODE(JavaScriptコードユニット)に文字コードを変換
    const unicodeArray = Encoding.convert(sjisArray, {
      to: 'UNICODE',
      from: 'SJIS'
    });

    // 表示用に文字コード配列を文字列に変換
    const unicodeString = Encoding.codeToString(unicodeArray);
    console.log(unicodeString);
  } catch (error) {
    console.error('Error loading the file:', error);
  }
})();
```

<details>
<summary>この例の XMLHttpRequest を使ったバージョン</summary>

```javascript
const req = new XMLHttpRequest();
req.open('GET', 'shift_jis.txt', true);
req.responseType = 'arraybuffer';

req.onload = (event) => {
  const buffer = req.response;
  if (buffer) {
    // ファイルから読み込んだSJISの文字コード配列
    const sjisArray = new Uint8Array(buffer);

    // SJISからUNICODE(JavaScriptコードユニット)に文字コードを変換
    const unicodeArray = Encoding.convert(sjisArray, {
      to: 'UNICODE',
      from: 'SJIS'
    });

    // 表示用に文字コード配列を文字列に変換
    const unicodeString = Encoding.codeToString(unicodeArray);
    console.log(unicodeString);
  }
};

req.send(null);
```
</details>

### File API を使用したファイルの文字コード判定・変換例

この例では、File API を使って選択されたファイルの内容を読み込みます。その際にファイルの文字コードを判定し、
`Shift_JIS` や `EUC-JP` などで書かれたファイルも文字化けなく表示されるように `UNICODE` に変換して表示します。

```html
<input type="file" id="file">
<div id="encoding"></div>
<textarea id="content" rows="5" cols="80"></textarea>

<script>
function onFileSelect(event) {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = function(e) {
    const codes = new Uint8Array(e.target.result);

    const detectedEncoding = Encoding.detect(codes);
    const encoding = document.getElementById('encoding');
    encoding.textContent = `Detected encoding: ${detectedEncoding}`;

    // UNICODE(JavaScriptコードユニット)に文字コードを変換
    const unicodeString = Encoding.convert(codes, {
      to: 'UNICODE',
      from: detectedEncoding,
      type: 'string'
    });
    document.getElementById('content').value = unicodeString;
  };

  reader.readAsArrayBuffer(file);
}

document.getElementById('file').addEventListener('change', onFileSelect);
</script>
```

[**この例のデモ**](https://polygonplanet.github.io/encoding.js/tests/detect-file-encoding.html)

## Contributing

Pull requests や Issues を歓迎しています。
バグ報告や機能要望などは [GitHub の Issues](https://github.com/polygonplanet/encoding.js/issues) をご利用ください。

### Pull requests

Pull requests をする前に、 `npm run test` を実行してエラーがないことをご確認ください。

## License

このプロジェクトは MIT ライセンスです。
詳しくは [LICENSE](LICENSE) ファイルを参照してください。
