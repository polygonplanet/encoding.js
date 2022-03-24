encoding.js
===========

[![NPM Version](https://img.shields.io/npm/v/encoding-japanese.svg)](https://www.npmjs.com/package/encoding-japanese)
[![Build Status](https://app.travis-ci.com/polygonplanet/encoding.js.svg?branch=master)](https://app.travis-ci.com/polygonplanet/encoding.js)
[![GitHub License](https://img.shields.io/github/license/polygonplanet/encoding.js.svg)](https://github.com/polygonplanet/encoding.js/blob/master/LICENSE)

JavaScript で文字コードを変換または判定します。

[**README (English)**](README.md)

## インストール

### ブラウザ

```html
<script src="encoding.js"></script>
```

または minify された `encoding.min.js` を使用します。

```html
<script src="encoding.min.js"></script>
```

ブラウザで読み込むと **`Encoding`** というオブジェクトがグローバルに (`window.Encoding` として) 定義されます。

### npm

`encoding-japanese` というモジュール名になっています

```bash
npm install encoding-japanese
```

```javascript
var encoding = require('encoding-japanese');
```

encoding.js の各メソッドは Node.js の Buffer に対しても使えます

### CDN

[cdnjs.com](https://cdnjs.com/libraries/encoding-japanese) でCDNが利用できます。

## 使える文字コード

* '**UTF32**'   (detect only)
* '**UTF16**'
* '**UTF16BE**'
* '**UTF16LE**'
* '**BINARY**'  (detect only)
* '**ASCII**'   (detect only)
* '**JIS**'
* '**UTF8**'
* '**EUCJP**'
* '**SJIS**'
* '**UNICODE**' (JavaScript Unicode Array)

※ UNICODE は JavaScript の String.charCodeAt() の値を持つ配列です  
　　(配列の各値は 256 を超える数値になり得ます)

----

## API

### 文字コードを変換する (convert)

* {_Array.&lt;number&gt;|string_} Encoding.**convert** ( data, to\_encoding [, from\_encoding ] )  
  文字コードを変換します  
  @param {_Array.&lt;number&gt;|TypedArray|Buffer|string_} _data_ 対象のデータ  
  @param {_(string|Object)_} _to\_encoding_ 変換先の文字コード、またはオブジェクト指定でオプション
  @param {_(string|Array.&lt;string&gt;)=_} [_from\_encoding_] 変換元の文字コード。または 'AUTO'
  @return {_Array|string_}  変換した配列または(文字列を渡した場合)文字列が返ります

```javascript
// UTF-8のデータをShift_JISに変換
var utf8Array = new Uint8Array(...) or [...] or Array(...) or Buffer(...);
var sjisArray = Encoding.convert(utf8Array, 'SJIS', 'UTF8');

// 自動判別で変換 (AUTO detect)
var sjisArray = Encoding.convert(utf8Array, 'SJIS');
// or  
var sjisArray = Encoding.convert(utf8Array, 'SJIS', 'AUTO');

// 文字コード判別 (戻り値は上記の「使える文字コード」のいずれか)
var detected = Encoding.detect(utf8Array);
if (detected === 'UTF8') {
  console.log('Encoding is UTF-8');
}
```

#### 引数に Object を指定する

```javascript
var sjisArray = Encoding.convert(utf8Array, {
  to: 'SJIS', // to_encoding
  from: 'UTF8' // from_encoding
});
```

第二引数にオブジェクトで渡すことで可読性が上がります

#### 'type' オプションで文字列を指定し、文字列を直接渡す

```javascript
var utf8String = 'ã\u0081\u0093ã\u0082\u0093ã\u0081«ã\u0081¡ã\u0081¯';
var unicodeString = Encoding.convert(utf8String, {
  to: 'UNICODE',
  from: 'UTF8',
  type: 'string' // 文字列 'string' を指定 (string で返ります)
});
console.log(unicodeString); // こんにちは
```

'*type*' オプションは以下が利用可能です:

* '**string**': 文字列として返ります
* '**arraybuffer**': ArrayBuffer として返ります
* '**array**': Array として返ります (デフォルト)

#### 変換できない文字を HTML エンティティ（HTML 数値文字参照）に置き換える

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

#### UTF16 に BOM をつける

UTF16 に変換する際に `bom` オプションを指定すると BOM が付加できます

```javascript
var utf16Array = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: true // BOMをつける
});
```

UTF16 のバイトオーダーはデフォルトで big-endian になります

little-endian として変換したい場合は bom オプションに 'LE' を指定します  

```javascript
var utf16leArray = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: 'LE' // BOM (little-endian) をつける
});
```

BOM が不要な場合は UTF16LE または UTF16BE を使用します

```javascript
var utf16beArray = Encoding.convert(utf8Array, {
  to: 'UTF16BE',
  from: 'UTF8'
});
```

※ UTF16, UTF16BE, UTF16LE は、JavaScript の内部コードではなく各バイトを持つ配列です

### 文字コードを判定する (detect)

* {_string|boolean_} Encoding.**detect** ( data [, encodings ] )  
  文字コードを判定します
  @param {_Array.&lt;number&gt;|TypedArray|string_} _data_ 対象のデータ  
  @param {_(string|Array.&lt;string&gt;)_} [_encodings_] 判定を絞り込む際の文字コード  
  @return {_string|boolean_}  判定された文字コード、または false が返ります

```javascript
// 自動判定 (AUTO detect)
var detected = Encoding.detect(utf8Array);
if (detected === 'UTF8') {
  console.log('Encoding is UTF-8');
}

// 文字コード指定判定
var isSJIS = Encoding.detect(sjisArray, 'SJIS');
if (isSJIS) {
  console.log('Encoding is SJIS');
}
```

### URL Encode/Decode

* {_string_} Encoding.**urlEncode** ( data )  
  URL(percent) エンコードします  
  @param {_Array.&lt;number&gt;_|_TypedArray_} _data_ 対象のデータ  
  @return {_string_}  エンコードされた文字列が返ります

* {_Array.&lt;number&gt;_} Encoding.**urlDecode** ( string )  
  URL(percent) デコードします  
  @param {_string_} _string_ 対象の文字列  
  @return {_Array.&lt;number&gt;_}  デコードされた文字コード配列が返ります

```javascript
// 文字コードの配列をURLエンコード/デコード
var sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,
  65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230
];

var encoded = Encoding.urlEncode(sjisArray);
console.log(encoded);
// output:
// '%82%B1%82%F1%82%C9%82%BF%82%CD%81A%82%D9%82%B0%81%99%82%D2%82%E6'

var decoded = Encoding.urlDecode(encoded);
console.log(decoded);
// output: [
//   130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,
//    65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230
// ]
```

### Base64 Encode/Decode

* {_string_} Encoding.**base64Encode** ( data )  
  Base64エンコードします  
  @param {_Array.&lt;number&gt;_|_TypedArray_} _data_ 対象のデータ  
  @return {_string_}  Base64エンコードされた文字列が返ります

* {_Array.&lt;number&gt;_} Encoding.**base64Decode** ( string )  
  Base64デコードします  
  @param {_string_} _string_ 対象のデータ  
  @return {_Array.&lt;number&gt;_} Base64デコードされた文字コード配列が返ります


```javascript
var sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205
];
var encoded = Encoding.base64Encode(sjisArray);
console.log(encoded); // 'grGC8YLJgr+CzQ=='

var decoded = Encoding.base64Decode(encoded);
console.log(decoded);
// [130, 177, 130, 241, 130, 201, 130, 191, 130, 205]
```

### 配列から文字列の相互変換（codeToString/stringToCode）

* {_string_} Encoding.**codeToString** ( {_Array.&lt;number&gt;_|_TypedArray_} data )  
  文字コード配列を文字列に変換(連結)して返します

* {_Array.&lt;number&gt;_} Encoding.**stringToCode** ( {_string_} string )  
  文字列を文字コード配列に分割して返します

### 全角/半角変換

以下のメソッドは Unicode 文字または Unicode 文字コード配列に対して使用できます  

* {_Array.&lt;number&gt;|string_} Encoding.**toHankakuCase** ( {_Array.&lt;number&gt;|string_} data )  
  全角英数記号文字を半角英数記号文字に変換

* {_Array.&lt;number&gt;|string_} Encoding.**toZenkakuCase** ( {_Array.&lt;number&gt;|string_} data )  
  半角英数記号文字を全角英数記号文字に変換

* {_Array.&lt;number&gt;|string_} Encoding.**toHiraganaCase** ( {_Array.&lt;number&gt;|string_} data )  
  全角カタカナを全角ひらがなに変換

* {_Array.&lt;number&gt;|string_} Encoding.**toKatakanaCase** ( {_Array.&lt;number&gt;|string_} data )  
  全角ひらがなを全角カタカナに変換

* {_Array.&lt;number&gt;|string_} Encoding.**toHankanaCase** ( {_Array.&lt;number&gt;|string_} data )  
  全角カタカナを半角ｶﾀｶﾅに変換

* {_Array.&lt;number&gt;|string_} Encoding.**toZenkanaCase** ( {_Array.&lt;number&gt;|string_} data )  
  半角ｶﾀｶﾅを全角カタカナに変換

* {_Array.&lt;number&gt;|string_} Encoding.**toHankakuSpace** ({_Array.&lt;number&gt;|string_} data )  
  全角スペース(U+3000)を半角スペース(U+0020)に変換

* {_Array.&lt;number&gt;|string_} Encoding.**toZenkakuSpace** ( {_Array.&lt;number&gt;|string_} data )  
  半角スペース(U+0020)を全角スペース(U+3000)に変換

## 例

### XMLHttpRequest と Typed arrays (Uint8Array) を使用した例

このサンプルでは Shift_JIS で書かれたテキストファイルをバイナリデータとして読み込み、Encoding.convert によって Unicode に変換して表示します

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
その際にファイルの文字コードを判定し、正しく表示されるようUnicodeに変換して表示します。

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

[**この例のデモ**](http://polygonplanet.github.io/encoding.js/tests/detect-file-encoding.html)

### 文字コード変換例

```javascript
var eucjpArray = [
  164, 179, 164, 243, 164, 203, 164, 193, 164, 207, 161,
  162, 164, 219, 164, 178, 161, 249, 164, 212, 164, 232
];

var utf8Array = Encoding.convert(eucjpArray, {
  to: 'UTF8',
  from: 'EUCJP'
});
console.log( utf8Array );
// output: [
//   227, 129, 147, 227, 130, 147, 227, 129, 171,
//   227, 129, 161, 227, 129, 175, 227, 128, 129,
//   227, 129, 187, 227, 129, 146, 226, 152, 134,
//   227, 129, 180, 227, 130, 136
// ]
//   => 'こんにちは、ほげ☆ぴよ'
```

### 文字コード自動判定での変換例 (Auto detect)

```javascript
var sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,
   65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230
];
var unicodeArray = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'AUTO'
});
// codeToStringは文字コード配列を文字列に変換(連結)して返します
console.log( Encoding.codeToString(unicodeArray) );
// output: 'こんにちは、ほげ☆ぴよ'
```

## Demo

* [文字コード変換テスト(Demo)](http://polygonplanet.github.io/encoding.js/tests/encoding-test.html)
* [ファイルから文字コードの検出・変換(Demo)](http://polygonplanet.github.io/encoding.js/tests/detect-file-encoding.html)

## Contributing

pull request や issues を歓迎しています。
pull request の際は、 `$ npm run test` を実行してエラーがないことを確認してください。

## License

MIT
