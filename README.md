encoding.js
===========

[![Build Status](https://travis-ci.org/polygonplanet/encoding.js.svg?branch=master)](https://travis-ci.org/polygonplanet/encoding.js)

Converts character encoding in JavaScript.  

**[README(Japanese)](https://github.com/polygonplanet/encoding.js/blob/master/README_ja.md)**

### Installation

#### In Browser:

```html
<script src="encoding.js"></script>
```

or

```html
<script src="encoding.min.js"></script>
```

Object **Encoding** will be defined in the global scope.

Conversion and detection for the Array (like Array object).  

#### In Node.js:

encoding.js is published by module name of `encoding-japanese` in npm.

```bash
npm install encoding-japanese
```

```javascript
var encoding = require('encoding-japanese');
```

Each methods are also available for the *Buffer* in Node.js.

#### bower:

```bash
bower install encoding-japanese
```

#### CDN

encoding.js is available on [cdnjs.com](https://cdnjs.com/libraries/encoding-japanese).


#### Convert character encoding (convert):

* {_Array.&lt;number&gt;|string_} Encoding.**convert** ( data, to\_encoding [, from\_encoding ] )  
  Converts character encoding.  
  @param {_Array.&lt;number&gt;|TypedArray|Buffer|string_} _data_ The target data.  
  @param {_(string|Object)_} _to\_encoding_ The encoding name of conversion destination.  
  @param {_(string|Array.&lt;string&gt;)=_} [_from\_encoding_] The encoding name of source or 'AUTO'.  
  @return {_Array|string_}  Return the converted array/string.


```javascript
// Convert character encoding to Shift_JIS from UTF-8.
var utf8Array = new Uint8Array(...) or [...] or Array(...) or Buffer(...);
var sjisArray = Encoding.convert(utf8Array, 'SJIS', 'UTF8');

// Convert character encoding by automatic detection (AUTO detect).
var sjisArray = Encoding.convert(utf8Array, 'SJIS');
// or  
var sjisArray = Encoding.convert(utf8Array, 'SJIS', 'AUTO');

// Detect the character encoding.
// The return value be one of the "Available Encodings" below.
var detected = Encoding.detect(utf8Array);
if (detected === 'UTF8') {
  console.log('Encoding is UTF-8');
}
```

##### Available Encodings:

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

Note: UNICODE is an array that has a value of String.charCodeAt() in JavaScript.  
(Each value in the array possibly has a number greater than 256.)


##### Specify the Object argument

```javascript
var sjisArray = Encoding.convert(utf8Array, {
  to: 'SJIS', // to_encoding
  from: 'UTF8' // from_encoding
});
```

Readability improves by passing an object to the second argument.

##### Specify the string argument and 'type' option

```javascript
var utf8String = 'ã\u0081\u0093ã\u0082\u0093ã\u0081«ã\u0081¡ã\u0081¯';
var unicodeString = Encoding.convert(utf8String, {
  to: 'UNICODE',
  from: 'UTF8',
  type: 'string' // Specify 'string' type. (Return as string)
});
console.log(unicodeString); // こんにちは
```

Following '*type*' options are available:

* '**string**': Return as string.
* '**arraybuffer**': Return as ArrayBuffer.
* '**array**': Return as Array (default).



##### Specify BOM in UTF-16

It's possible to add the UTF16 BOM by specifying the bom option for conversion.

```javascript
var utf16Array = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: true // With BOM
});
```

The byte order of UTF16 is big-endian by default.

Specify the 'LE' for the bom option if you want to convert as little-endian.  

```javascript
var utf16leArray = Encoding.convert(utf8Array, {
  to: 'UTF16', // to_encoding
  from: 'UTF8', // from_encoding
  bom: 'LE' // With BOM (little-endian)
});
```

You can specify UTF16LE or UTF16BE if the BOM is not required.

```javascript
var utf16beArray = Encoding.convert(utf8Array, {
  to: 'UTF16BE',
  from: 'UTF8'
});
```

Note: UTF16, UTF16BE and UTF16LE are not JavaScript internal encodings, they are a byte arrays.

#### Detect character encoding (detect):

* {_string|boolean_} Encoding.**detect** ( data [, encodings ] )  
  Detect character encoding.  
  @param {_Array.&lt;number&gt;|TypedArray|string_} _data_ Target data  
  @param {_(string|Array.&lt;string&gt;)_} [_encodings_] The encoding name that to specify the detection.  
  @return {_string|boolean_} Return the detected character encoding, or false.


```javascript
// Detect character encoding automatically. (AUTO detect).
var detected = Encoding.detect(utf8Array);
if (detected === 'UTF8') {
  console.log('Encoding is UTF-8');
}

// Detect character encoding by specific encoding name.
var isSJIS = Encoding.detect(sjisArray, 'SJIS');
if (isSJIS) {
  console.log('Encoding is SJIS');
}
```


##### URL Encode/Decode:

* {_string_} Encoding.**urlEncode** ( data )  
  URL(percent) encode.  
  @param {_Array.&lt;number&gt;_|_TypedArray_} _data_ Target data.  
  @return {_string_}  Return the encoded string.

* {_Array.&lt;number&gt;_} Encoding.**urlDecode** ( string )  
  URL(percent) decode.  
  @param {_string_} _string_ Target data.  
  @return {_Array.&lt;number&gt;_} Return the decoded array.

```javascript
// URL encode to an array that has character code.
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

##### Base64 Encode/Decode:

* {_string_} Encoding.**base64Encode** ( data )  
  Base64 encode.  
  @param {_Array.&lt;number&gt;_|_TypedArray_} _data_ Target data.  
  @return {_string_}  Return the Base64 encoded string.

* {_Array.&lt;number&gt;_} Encoding.**base64Decode** ( string )  
  Base64 decode.  
  @param {_string_} _string_ Target data.  
  @return {_Array.&lt;number&gt;_} Return the Base64 decoded array.


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

#### Example:

##### Example using the XMLHttpRequest and Typed arrays (Uint8Array):

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

##### Convert encoding for file using the File APIs:

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

##### Example of the character encoding conversion:

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

##### Example of converting a character code by automatic detection (Auto detect):

```javascript
var sjisArray = [
  130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,
   65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230
];
var unicodeArray = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'AUTO'
});
// codeToString is a utility method that Joins a character code array to string.
console.log( Encoding.codeToString(unicodeArray) );
// output: 'こんにちは、ほげ☆ぴよ'
```

### Utilities

* {_string_} Encoding.**codeToString** ( {_Array.&lt;number&gt;_|_TypedArray_} data )  
  Joins a character code array to string.

* {_Array.&lt;number&gt;_} Encoding.**stringToCode** ( {_string_} string )  
  Splits string to an array of character codes.

#### Japanese Zenkaku/Hankaku

* {_Array.&lt;number&gt;|string_} Encoding.**toHankakuCase** ( {_Array.&lt;number&gt;|string_} data )  
  Convert the ascii symbols and alphanumeric characters to the zenkaku symbols and alphanumeric characters.

* {_Array.&lt;number&gt;|string_} Encoding.**toZenkakuCase** ( {_Array.&lt;number&gt;|string_} data )  
  Convert to the zenkaku symbols and alphanumeric characters from the ascii symbols and alphanumeric characters.

* {_Array.&lt;number&gt;|string_} Encoding.**toHiraganaCase** ( {_Array.&lt;number&gt;|string_} data )  
  Convert to the zenkaku hiragana from the zenkaku katakana.

* {_Array.&lt;number&gt;|string_} Encoding.**toKatakanaCase** ( {_Array.&lt;number&gt;|string_} data )  
  Convert to the zenkaku katakana from the zenkaku hiragana.

* {_Array.&lt;number&gt;|string_} Encoding.**toHankanaCase** ( {_Array.&lt;number&gt;|string_} data )  
  Convert to the hankaku katakana from the zenkaku katakana.

* {_Array.&lt;number&gt;|string_} Encoding.**toZenkanaCase** ( {_Array.&lt;number&gt;|string_} data )  
  Convert to the zenkaku katakana from the hankaku katakana.

* {_Array.&lt;number&gt;|string_} Encoding.**toHankakuSpace** ({_Array.&lt;number&gt;|string_} data )  
  Convert the em space(U+3000) to the single space(U+0020).

* {_Array.&lt;number&gt;|string_} Encoding.**toZenkakuSpace** ( {_Array.&lt;number&gt;|string_} data )  
  Convert the single space(U+0020) to the em space(U+3000).


### Demo

* [Test for character encoding conversion (Demo)](http://polygonplanet.github.io/encoding.js/tests/encoding-test.html)
* [Detect and Convert encoding from file (Demo)](http://polygonplanet.github.io/encoding.js/tests/detect-file-encoding.html)

### Contributing

We're waiting for your pull requests and issues.
Don't forget to execute `npm run test` before requesting.
Accepted only requests without errors.

### License

MIT



