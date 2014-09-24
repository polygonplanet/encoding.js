
encoding.js
===========

[![Build Status](https://travis-ci.org/polygonplanet/encoding.js.svg?branch=master)](https://travis-ci.org/polygonplanet/encoding.js)

Converts character encoding in JavaScript.  
JavaScript で文字コード変換をします

### Usage

```html
<script src="encoding.js"></script>
```

Encoding というオブジェクトがグローバルに定義されます  
配列に対して変換または判別します  

* 文字コード変換

```javascript
var utf8Array = new Uint8Array(...) or [...] or Array(...) or Buffer(...);
var sjisArray = Encoding.convert(utf8Array, 'SJIS', 'UTF8');

// 自動判別で変換
var sjisArray = Encoding.convert(utf8Array, 'SJIS');
// or  
var sjisArray = Encoding.convert(utf8Array, 'SJIS', 'AUTO');

// 文字コード判別 (戻り値は下の"Available Encodings"のいずれか)
var encoding = Encoding.detect(utf8Array);
if (encoding === 'UTF8') {
  alert('UTF-8です');
}
```


##### Available Encodings:

* 'UTF32'   (detect only)
* 'UTF16'   (detect only)
* 'BINARY'  (detect only)
* 'ASCII'   (detect only)
* 'JIS'
* 'UTF8'
* 'EUCJP'
* 'SJIS'
* 'UNICODE' (JavaScript Unicode String/Array)


##### 文字コード検出:
```javascript
// 自動判別
var enc = Encoding.detect(utf8Array);
if (enc === 'UTF8') {
  alert('UTF-8です');
}

// 文字コード指定判別
var isSJIS = Encoding.detect(sjisArray, 'SJIS');
if (isSJIS) {
  alert('SJISです');
}
```

##### URL Encode/Decode:
```javascript
// 文字コードの配列をURLエンコード/デコード
var sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,
  65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230
];

var encoded = Encoding.urlEncode(sjisArray);
console.log(encoded);
// output:
//   '%82%B1%82%F1%82%C9%82%BF%82%CD%81A%82%D9%82%B0%81%99%82%D2%82%E6'

var decoded = Encoding.urlDecode(encoded);
console.log(decoded);
// output: [
//   130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,
//    65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230
// ]
```

#### Example:
```javascript
var eucjpArray = [
  164, 179, 164, 243, 164, 203, 164, 193, 164, 207, 161,
  162, 164, 219, 164, 178, 161, 249, 164, 212, 164, 232
];

var utf8Array = Encoding.convert(eucjpArray, 'UTF8', 'EUCJP');
console.log( utf8Array );
// output: [
//   227, 129, 147, 227, 130, 147, 227, 129, 171,
//   227, 129, 161, 227, 129, 175, 227, 128, 129,
//   227, 129, 187, 227, 129, 146, 226, 152, 134,
//   227, 129, 180, 227, 130, 136
// ]
//   => 'こんにちは、ほげ☆ぴよ'
```

#### Example (Auto detect):

```javascript
var sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,
   65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230
];
var unicodeArray = Encoding.convert(sjisArray, 'UNICODE', 'AUTO');
// codeToStringは文字コード配列を文字列に変換(連結)して返す
console.log( Encoding.codeToString(unicodeArray) );
// output: 'こんにちは、ほげ☆ぴよ'
```

### Utilities

* _string_ Encoding.**codeToString** ( _array_ data )  
  文字コード配列を文字列に変換(連結)して返します

* _array_ Encoding.**stringToCode** ( _string_ string )  
  文字列を文字コード配列に分割して返します



### Node.js

`encoding-japanese` というモジュール名になっています

```bash
npm install encoding-japanese
```

```javascript
var encoding = require('encoding-japanese');
```

encoding.convert() は Buffer に対しても使えます(配列で返ります)


### Test

[文字コード変換テスト](http://polygonplanet.github.io/encoding.js/tests/encoding-test.html)

### License

Dual licensed under the MIT or GPL v2 licenses.


