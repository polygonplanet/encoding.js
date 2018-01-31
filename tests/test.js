'use strict';

var assert = require('assert');
var fs = require('fs');
var encoding = require('../encoding');


describe('Encoding', function() {
  var encodings = ['SJIS', 'UTF-8', 'JIS', 'EUC-JP'];
  var urlEncoded = {
    SJIS: '%82%B1%82%CC%83e%83L%83X%83g%82%CD%20SJIS%20%82%C5%8F%91%82%A9%82%EA%82%C4%82%A2%82%DC%82%B7%81B',
    UTF8: '%E3%81%93%E3%81%AE%E3%83%86%E3%82%AD%E3%82%B9%E3%83%88%E3%81%AF%20UTF-8%20%E3%81%A7%E6%9B%B8%E3%81%8B%E3%82%8C%E3%81%A6%E3%81%84%E3%81%BE%E3%81%99%E3%80%82',
    JIS: '%1B%24B%243%24N%25F%25-%259%25H%24O%1B(B%20JIS%20%1B%24B%24G%3Dq%24%2B%24l%24F%24%24%24%5E%249!%23%1B(B',
    EUCJP: '%A4%B3%A4%CE%A5%C6%A5%AD%A5%B9%A5%C8%A4%CF%20EUC-JP%20%A4%C7%BD%F1%A4%AB%A4%EC%A4%C6%A4%A4%A4%DE%A4%B9%A1%A3'
  };

  var getExpectedName = function(name) {
    return name.replace(/\W/g, '');
  };

  var getExpectedText = function(name) {
    return '\u3053\u306e\u30c6\u30ad\u30b9\u30c8\u306f ' + name +
      ' \u3067\u66f8\u304b\u308c\u3066\u3044\u307e\u3059\u3002';
  };

  var getFileName = function(name) {
    return __dirname + '/encoding-' + getExpectedName(name).toLowerCase() + '.txt';
  };

  var getCode = function(data) {
    var code = [];
    for (var i = 0, len = data.length; i < len; i++) {
      code.push(data[i]);
    }
    return code;
  };

  var buffers = {};
  var tests = {};

  before(function() {
    tests.unicode = [];
    for (var i = 0; i <= 0xffff; i++) {
      tests.unicode.push(i);
    }
    tests.surrogatePairs = [0xD844, 0xDE7B];

    var jisx0208 = fs.readFileSync(__dirname + '/jis-x-0208-utf8.txt');
    var jisx0208Len = jisx0208.length + 1;
    tests.jisx0208 = new Buffer(jisx0208Len);
    // Prepend an ascii character for UTF-16 detection.
    tests.jisx0208[0] = 'a'.charCodeAt(0);
    for (i = 1; i < jisx0208Len; i++) {
      tests.jisx0208[i] = jisx0208[i - 1];
    }
    assert.deepEqual(tests.jisx0208.slice(1), jisx0208);

    tests.jisx0208Array = [];
    var len = tests.jisx0208.length;
    for (i = 0; i < len; i++) {
      tests.jisx0208Array.push(tests.jisx0208[i]);
    }
    tests.ascii = 'Hello World.';
    tests.surrogatePairs2 = fs.readFileSync(__dirname + '/surrogate-pairs-utf8.txt');

    encodings.forEach(function(encodingName) {
      var data = fs.readFileSync(getFileName(encodingName));
      buffers[encodingName] = data;
    });
  });

  describe('detect', function() {
    encodings.forEach(function(encodingName) {
      it(encodingName, function () {
        var res = encoding.detect(buffers[encodingName]);
        assert.equal(res, getExpectedName(encodingName));
      });
    });

    it('UTF-16, UTF-16BE', function() {
      var utf16 = [
        0xFE,0xFF,0x30,0x53,0x30,0x6E,0x30,0xC6,0x30,0xAD,0x30,0xB9,0x30,
        0xC8,0x30,0x6F,0x00,0x20,0x00,0x55,0x00,0x54,0x00,0x46,0x00,0x2D,
        0x00,0x31,0x00,0x36,0x00,0x20,0x30,0x67,0x66,0xF8,0x30,0x4B,0x30,
        0x8C,0x30,0x66,0x30,0x44,0x30,0x7E,0x30,0x59,0x30,0x02
      ];
      assert(encoding.detect(utf16, 'utf-16'));
      assert(encoding.detect(utf16) === 'UTF16');

      var utf16_noBom = utf16.slice(2);
      assert(encoding.detect(utf16_noBom, 'utf-16'));
      assert(/^UTF16/.test(encoding.detect(utf16_noBom)));
    });

    it('UTF-16LE', function() {
      var utf16le = [
        0x53,0x30,0x6E,0x30,0xC6,0x30,0xAD,0x30,0xB9,0x30,0xC8,0x30,0x6F,
        0x30,0x20,0x00,0x55,0x00,0x54,0x00,0x46,0x00,0x2D,0x00,0x31,0x00,
        0x36,0x00,0x4C,0x00,0x45,0x00,0x20,0x00,0x67,0x30,0xF8,0x66,0x4B,
        0x30,0x8C,0x30,0x66,0x30,0x44,0x30,0x7E,0x30,0x59,0x30,0x02,0x30
      ];
      assert(encoding.detect(utf16le, 'utf-16'));
      assert(encoding.detect(utf16le) === 'UTF16');
    });

    it('UTF-32, UTF-32BE', function() {
      var utf32 = [
        0x00,0x00,0xFE,0xFF,0x00,0x00,0x30,0x53,0x00,0x00,0x30,0x6E,0x00,
        0x00,0x30,0xC6,0x00,0x00,0x30,0xAD,0x00,0x00,0x30,0xB9,0x00,0x00,
        0x30,0xC8,0x00,0x00,0x30,0x6F,0x00,0x00,0x00,0x20,0x00,0x00,0x00,
        0x55,0x00,0x00,0x00,0x54,0x00,0x00,0x00,0x46,0x00,0x00,0x00,0x2D,
        0x00,0x00,0x00,0x33,0x00,0x00,0x00,0x32,0x00,0x00,0x00,0x20,0x00,
        0x00,0x30,0x67,0x00,0x00,0x66,0xF8,0x00,0x00,0x30,0x4B,0x00,0x00,
        0x30,0x8C,0x00,0x00,0x30,0x66,0x00,0x00,0x30,0x44,0x00,0x00,0x30,
        0x7E,0x00,0x00,0x30,0x59,0x00,0x00,0x30,0x02
      ];
      assert(encoding.detect(utf32, 'utf-32'));
      assert(encoding.detect(utf32) === 'UTF32');

      var utf32_noBom = utf32.slice(4);
      assert(encoding.detect(utf32_noBom, 'utf-32'));
      assert(/^UTF32/.test(encoding.detect(utf32_noBom)));
    });

    it('UTF-32LE', function() {
      var utf32le = [
        0x53,0x30,0x00,0x00,0x6E,0x30,0x00,0x00,0xC6,0x30,0x00,0x00,0xAD,
        0x30,0x00,0x00,0xB9,0x30,0x00,0x00,0xC8,0x30,0x00,0x00,0x6F,0x30,
        0x00,0x00,0x20,0x00,0x00,0x00,0x55,0x00,0x00,0x00,0x54,0x00,0x00,
        0x00,0x46,0x00,0x00,0x00,0x2D,0x00,0x00,0x00,0x33,0x00,0x00,0x00,
        0x32,0x00,0x00,0x00,0x4C,0x00,0x00,0x00,0x45,0x00,0x00,0x00,0x20,
        0x00,0x00,0x00,0x67,0x30,0x00,0x00,0xF8,0x66,0x00,0x00,0x4B,0x30,
        0x00,0x00,0x8C,0x30,0x00,0x00,0x66,0x30,0x00,0x00,0x44,0x30,0x00,
        0x00,0x7E,0x30,0x00,0x00,0x59,0x30,0x00,0x00,0x02,0x30,0x00,0x00
      ];
      assert(encoding.detect(utf32le, 'utf-32'));
      assert(encoding.detect(utf32le) === 'UTF32');
    });

    it('Specifying multiple encodings', function() {
      var unicode = 'ユニコード';

      assert.equal(encoding.detect(unicode, 'UNICODE'), 'UNICODE');
      assert.equal(encoding.detect(unicode, ['UNICODE']), 'UNICODE');
      assert.equal(encoding.detect(unicode, {encoding: 'UNICODE'}), 'UNICODE');
      assert.equal(encoding.detect(unicode, {encoding: ['UNICODE']}), 'UNICODE');
      assert.equal(encoding.detect(unicode, []), false);
      assert.equal(encoding.detect(unicode, ['UNICODE', 'ASCII']), 'UNICODE');
      assert.equal(encoding.detect(unicode, 'ASCII, EUCJP, UNICODE'), 'UNICODE');
      assert.equal(encoding.detect(unicode, ['SJIS', 'UTF8', 'ASCII']), false);
    });
  });

  describe('convert', function() {
    encodings.forEach(function(encodingName) {
      it(encodingName, function () {
        var res = encoding.codeToString(
          encoding.convert(buffers[encodingName], 'unicode', encodingName));
        assert.equal(res, getExpectedText(encodingName));
      });
    });

    it('ASCII', function() {
      assert(tests.ascii.length > 0);
      var encoded = encoding.convert(tests.ascii, 'sjis', 'auto');
      assert(encoded.length > 0);
      var decoded = encoding.convert(encoded, 'unicode', 'auto');
      assert(decoded.length > 0);
      assert.deepEqual(decoded, tests.ascii);
    });

    it('Unicode/UTF-8', function() {
      assert(tests.unicode.length === 65536);
      var utf8 = encoding.convert(tests.unicode, 'utf-8', 'unicode');
      assert(utf8.length > 0);
      assert.notDeepEqual(utf8, tests.unicode);
      var unicode = encoding.convert(utf8, 'unicode', 'utf-8');
      assert(unicode.length === 65536);
      assert.deepEqual(unicode, tests.unicode);
    });

    it('Object arguments', function() {
      var text = getExpectedText(getExpectedName('UTF-8'));
      var data = encoding.stringToCode(text);
      assert(data.length > 0);
      assert(encoding.detect(data, 'UNICODE'));

      var utf8 = encoding.convert(data, {
        to: 'utf-8',
        from: 'unicode'
      });
      assert(utf8.length > 0);
      assert.notDeepEqual(utf8, data);
      assert(encoding.detect(utf8, 'utf-8'));

      var unicode = encoding.convert(utf8, {
        to: 'unicode',
        from: 'utf-8'
      });
      assert(unicode.length > 0);
      assert.deepEqual(unicode, data);
      assert(encoding.detect(unicode, 'unicode'));
    });

    it('Surrogate pairs', function() {
      assert(tests.surrogatePairs.length >= 2);
      var utf8 = encoding.convert(tests.surrogatePairs, 'utf-8', 'unicode');
      assert(utf8.length > 0);
      assert.notDeepEqual(utf8, tests.surrogatePairs);
      var unicode = encoding.convert(utf8, 'unicode', 'utf-8');
      assert(unicode.length >= 2);
      assert.deepEqual(unicode, tests.surrogatePairs);
    });

    it('Surrogate pairs and UTF-8 conversion', function() {
      var surrogatePairs = [
        83,117,114,114,111,103,97,116,101,32,80,97,105,114,115,32,84,
        101,115,116,10,55362,57271,37326,23478,12391,55399,56893,10
      ];
      var surrogatePairs_utf8 = [
        0x53, 0x75, 0x72, 0x72, 0x6F, 0x67, 0x61, 0x74, 0x65, 0x20,
        0x50, 0x61, 0x69, 0x72, 0x73, 0x20, 0x54, 0x65, 0x73, 0x74,
        0x0A, 0xF0, 0xA0, 0xAE, 0xB7, 0xE9, 0x87, 0x8E, 0xE5, 0xAE,
        0xB6, 0xE3, 0x81, 0xA7, 0xF0, 0xA9, 0xB8, 0xBD, 0x0A
      ];
      var utf8 = encoding.convert(surrogatePairs, 'utf-8', 'unicode');
      assert(utf8.length > 0);
      assert.notDeepEqual(utf8, surrogatePairs);
      assert.deepEqual(utf8, surrogatePairs_utf8);

      var unicode = encoding.convert(utf8, 'unicode', 'utf-8');
      assert(unicode.length > 0);
      assert.notDeepEqual(unicode, utf8);
      assert.deepEqual(unicode, surrogatePairs);
    });

    it('Surrogate pairs and UTF-16 conversion', function() {
      var surrogatePairs = [];
      for (var i = 0; i < tests.surrogatePairs2.length; i++) {
        surrogatePairs.push(tests.surrogatePairs2[i]);
      }
      assert(surrogatePairs.length >= 2);
      var utf8 = encoding.convert(surrogatePairs, 'utf-8', 'unicode');
      assert(utf8.length > 0);
      assert.notDeepEqual(utf8, surrogatePairs);
      var unicode = encoding.convert(utf8, 'unicode', 'utf-8');
      assert(unicode.length >= 2);
      assert.deepEqual(unicode, surrogatePairs);

      var utf16 = encoding.convert(utf8, 'utf-16', 'utf-8');
      assert(utf16.length > 0);
      assert.notDeepEqual(utf16, utf8);
      var isUTF16 = encoding.detect(utf16, 'utf-16');
      assert(isUTF16);
      var c1 = utf16[0];
      var c2 = utf16[1];
      // Check BOM
      assert(!((c1 === 0xFE && c2 === 0xFF) && (c1 === 0xFF && c2 === 0xFE)));
      var newUTF8 = encoding.convert(utf16, 'utf-8', 'utf-16');
      assert.deepEqual(utf8, newUTF8);
      var newUnicode = encoding.convert(utf16, 'unicode', 'utf-16');
      assert.deepEqual(newUnicode, unicode);
    });

    it('UTF-16 with BOM conversion', function() {
      var data = [];
      for (var i = 0; i < tests.surrogatePairs2.length; i++) {
        data.push(tests.surrogatePairs2[i]);
      }
      assert(data.length > 0);
      var utf8 = encoding.convert(data, 'utf-8', 'unicode');
      assert(utf8.length > 0);
      assert.notDeepEqual(utf8, data);
      var unicode = encoding.convert(utf8, 'unicode', 'utf-8');
      assert(unicode.length > 0);
      assert.deepEqual(unicode, data);

      // UTF-16 without BOM
      var utf16_noBom = encoding.convert(utf8, 'utf-16', 'utf-8');
      assert(utf16_noBom.length > 0);
      assert.notDeepEqual(utf16_noBom, utf8);

      var c1 = utf16_noBom[0];
      var c2 = utf16_noBom[1];
      // Check BOM
      assert(!((c1 === 0xFE && c2 === 0xFF) && (c1 === 0xFF && c2 === 0xFE)));

      // Test detect
      var isUTF16 = encoding.detect(utf16_noBom, 'utf-16');
      assert(isUTF16);
      var isUTF16BE = encoding.detect(utf16_noBom, 'utf-16be');
      assert(isUTF16BE);
      var isUTF16LE = encoding.detect(utf16_noBom, 'utf-16le');
      assert(!isUTF16LE);

      // UTF-16 with BOM (BE)
      var utf16_bom_true = encoding.convert(utf8, {
        to: 'utf-16',
        from: 'utf-8',
        bom: true
      });

      c1 = utf16_bom_true[0];
      c2 = utf16_bom_true[1];
      // Check BOM
      assert(c1 === 0xFE && c2 === 0xFF);

      // Test detect
      isUTF16 = encoding.detect(utf16_bom_true, 'utf-16');
      assert(isUTF16);
      isUTF16BE = encoding.detect(utf16_bom_true, 'utf-16be');
      assert(isUTF16BE);
      isUTF16LE = encoding.detect(utf16_bom_true, 'utf-16le');
      assert(!isUTF16LE);

      // Check other argument specified
      var utf16_bom_be = encoding.convert(utf8, {
        to: 'utf-16',
        from: 'utf-8',
        bom: 'be'
      });
      assert.deepEqual(utf16_bom_true, utf16_bom_be);

      var newUTF8 = encoding.convert(utf16_bom_be, 'utf-8', 'utf-16');
      assert.deepEqual(utf8, newUTF8);
      var newUnicode = encoding.convert(utf16_bom_be, 'unicode', 'utf-16');
      assert.deepEqual(newUnicode, unicode);

      // UTF-16 with BOM (LE)
      var utf16_bom_le = encoding.convert(utf8, {
        to: 'utf-16',
        from: 'utf-8',
        bom: 'le'
      });

      c1 = utf16_bom_le[0];
      c2 = utf16_bom_le[1];
      // Check BOM
      assert(c1 === 0xFF && c2 === 0xFE);

      // Test detect
      isUTF16 = encoding.detect(utf16_bom_le, 'utf-16');
      assert(isUTF16);
      isUTF16BE = encoding.detect(utf16_bom_le, 'utf-16be');
      assert(!isUTF16BE);
      isUTF16LE = encoding.detect(utf16_bom_le, 'utf-16le');
      assert(isUTF16LE);

      newUTF8 = encoding.convert(utf16_bom_le, 'utf-8', 'utf-16');
      assert.deepEqual(utf8, newUTF8);
      newUnicode = encoding.convert(utf16_bom_le, 'unicode', 'utf-16');
      assert.deepEqual(newUnicode, unicode);
    });

    it('UTF-16BE conversion', function() {
      var data = [];
      for (var i = 0; i < tests.surrogatePairs2.length; i++) {
        data.push(tests.surrogatePairs2[i]);
      }
      assert(data.length > 0);
      var utf8 = encoding.convert(data, 'utf-8', 'unicode');
      assert(utf8.length > 0);
      assert.notDeepEqual(utf8, data);
      var unicode = encoding.convert(utf8, 'unicode', 'utf-8');
      assert(unicode.length > 0);
      assert.deepEqual(unicode, data);

      var utf16be = encoding.convert(utf8, 'utf-16be', 'utf-8');
      assert(utf16be.length > 0);
      assert.notDeepEqual(utf16be, utf8);

      var isUTF16BE = encoding.detect(utf16be, 'utf-16be');
      assert(isUTF16BE);
      var isUTF16 = encoding.detect(utf16be, 'utf-16');
      assert(isUTF16);
      var isUTF16LE = encoding.detect(utf16be, 'utf-16le');
      assert(!isUTF16LE);

      var c1 = utf16be[0];
      var c2 = utf16be[1];
      // Check BOM
      assert(!((c1 === 0xFE && c2 === 0xFF) && (c1 === 0xFF && c2 === 0xFE)));
      var newUTF8 = encoding.convert(utf16be, 'utf-8', 'utf-16be');
      assert.deepEqual(utf8, newUTF8);
      var newUnicode = encoding.convert(utf16be, 'unicode', 'utf-16be');
      assert.deepEqual(newUnicode, unicode);
    });

    it('UTF-16LE conversion', function() {
      var data = [];
      for (var i = 0; i < tests.surrogatePairs2.length; i++) {
        data.push(tests.surrogatePairs2[i]);
      }
      assert(data.length > 0);
      var utf8 = encoding.convert(data, 'utf-8', 'unicode');
      assert(utf8.length > 0);
      assert.notDeepEqual(utf8, data);
      var unicode = encoding.convert(utf8, 'unicode', 'utf-8');
      assert(unicode.length > 0);
      assert.deepEqual(unicode, data);

      var utf16le = encoding.convert(utf8, 'utf-16le', 'utf-8');
      assert(utf16le.length > 0);
      assert.notDeepEqual(utf16le, utf8);

      var isUTF16LE = encoding.detect(utf16le, 'utf-16le');
      assert(isUTF16LE);
      var isUTF16 = encoding.detect(utf16le, 'utf-16');
      assert(isUTF16);
      var isUTF16BE = encoding.detect(utf16le, 'utf-16be');
      assert(!isUTF16BE);

      var c1 = utf16le[0];
      var c2 = utf16le[1];
      // Check BOM
      assert(!((c1 === 0xFE && c2 === 0xFF) && (c1 === 0xFF && c2 === 0xFE)));
      var newUTF8 = encoding.convert(utf16le, 'utf-8', 'utf-16le');
      assert.deepEqual(utf8, newUTF8);
      var newUnicode = encoding.convert(utf16le, 'unicode', 'utf-16le');
      assert.deepEqual(newUnicode, unicode);
    });

    it('Halfwidth Katakana conversion', function() {
      var hankana = '｡｢｣､･ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ';
      var hankanas = encoding.stringToCode(hankana);
      assert(hankanas.length > 0);
      assert(encoding.detect(hankanas) === 'UNICODE');

      var sjis_expect = [
        0xA1,0xA2,0xA3,0xA4,0xA5,0xA6,0xA7,0xA8,0xA9,0xAA,0xAB,0xAC,0xAD,
        0xAE,0xAF,0xB0,0xB1,0xB2,0xB3,0xB4,0xB5,0xB6,0xB7,0xB8,0xB9,0xBA,
        0xBB,0xBC,0xBD,0xBE,0xBF,0xC0,0xC1,0xC2,0xC3,0xC4,0xC5,0xC6,0xC7,
        0xC8,0xC9,0xCA,0xCB,0xCC,0xCD,0xCE,0xCF,0xD0,0xD1,0xD2,0xD3,0xD4,
        0xD5,0xD6,0xD7,0xD8,0xD9,0xDA,0xDB,0xDC,0xDD,0xDE,0xDF
      ];

      var sjis = encoding.convert(hankanas, 'SJIS', 'UNICODE');
      assert(encoding.detect(sjis) === 'SJIS');
      assert.deepEqual(sjis, sjis_expect);

      var jis_expect = [
        0x1B,0x28,0x49,0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,0x2A,
        0x2B,0x2C,0x2D,0x2E,0x2F,0x30,0x31,0x32,0x33,0x34,0x35,0x36,0x37,
        0x38,0x39,0x3A,0x3B,0x3C,0x3D,0x3E,0x3F,0x40,0x41,0x42,0x43,0x44,
        0x45,0x46,0x47,0x48,0x49,0x4A,0x4B,0x4C,0x4D,0x4E,0x4F,0x50,0x51,
        0x52,0x53,0x54,0x55,0x56,0x57,0x58,0x59,0x5A,0x5B,0x5C,0x5D,0x5E,
        0x5F,0x1B,0x28,0x42
      ];
      var jis = encoding.convert(hankanas, 'jis', 'unicode');
      assert(encoding.detect(jis) === 'JIS');
      assert.deepEqual(jis, jis_expect);

      var eucjp_expect = [
        0x8E,0xA1,0x8E,0xA2,0x8E,0xA3,0x8E,0xA4,0x8E,0xA5,0x8E,0xA6,0x8E,
        0xA7,0x8E,0xA8,0x8E,0xA9,0x8E,0xAA,0x8E,0xAB,0x8E,0xAC,0x8E,0xAD,
        0x8E,0xAE,0x8E,0xAF,0x8E,0xB0,0x8E,0xB1,0x8E,0xB2,0x8E,0xB3,0x8E,
        0xB4,0x8E,0xB5,0x8E,0xB6,0x8E,0xB7,0x8E,0xB8,0x8E,0xB9,0x8E,0xBA,
        0x8E,0xBB,0x8E,0xBC,0x8E,0xBD,0x8E,0xBE,0x8E,0xBF,0x8E,0xC0,0x8E,
        0xC1,0x8E,0xC2,0x8E,0xC3,0x8E,0xC4,0x8E,0xC5,0x8E,0xC6,0x8E,0xC7,
        0x8E,0xC8,0x8E,0xC9,0x8E,0xCA,0x8E,0xCB,0x8E,0xCC,0x8E,0xCD,0x8E,
        0xCE,0x8E,0xCF,0x8E,0xD0,0x8E,0xD1,0x8E,0xD2,0x8E,0xD3,0x8E,0xD4,
        0x8E,0xD5,0x8E,0xD6,0x8E,0xD7,0x8E,0xD8,0x8E,0xD9,0x8E,0xDA,0x8E,
        0xDB,0x8E,0xDC,0x8E,0xDD,0x8E,0xDE,0x8E,0xDF
      ];

      var eucjp = encoding.convert(hankanas, 'eucjp', 'unicode');
      assert(encoding.detect(eucjp) === 'EUCJP');
      assert.deepEqual(eucjp, eucjp_expect);
    });

    it('JIS special table conversion', function() {
      //NOTE: This characters is not completed for mojibake.
      var chars = [
        0x0030,0x0020,0x007E,0x0020,0x005C,0x0020,0xFFE5,0x0020,0xFF5E,
        0x0020,0xFFE3,0x0020,0xFF02,0x0020,0x2015,0x0020,0xFFE0,0x0020,
        0xFFE1,0x0020,0xFFE2,0x0020,0xFFE4,0x0020,0xFF07,0x0020,0x2225,
        0x0020,0x005C,0x0020,0x002F,0x0020,0xFF3C,0x0020,0x0020,0x2116,
        0x0020,0x3231,0x0020,0x334D,0x0020,0x0061,0x0020,0x3042,0x0020,
        0x3087,0x0020,0xFF71,0x0020,0x30A2,0x0020,0x30A1,0x0020,0x7533,
        0x0020,0x80FD,0x0020,0x5F0C,0x0020,0x4E9C,0x0020,0x7E3A,0x0020,
        0x7E67,0x0020,0x4EAB,0x0020,0x7E8A,0x0020,0x8868,0x0020,0x2460,
        0x0020,0x2170,0x0020,0x2164
      ];

      ['JIS', 'SJIS', 'EUCJP', 'UTF8'].forEach(function(encodingName) {
        var encoded = encoding.convert(chars, {
          to: encodingName,
          from: 'auto'
        });
        assert(encoding.detect(encoded) === encodingName);
        assert(encoded.length > 0);

        var decoded = encoding.convert(encoded, {
          to: 'unicode',
          from: 'auto'
        });
        assert.deepEqual(decoded, chars);
      });
    });
  });

  describe('convert JIS-X-0208', function() {
    var encodingNames = [
      'UTF16', 'UTF16BE', 'UTF16LE', 'SJIS', 'EUCJP', 'JIS', 'UNICODE'
    ];
    encodingNames.forEach(function(encodingName) {
      it('UTF8 to ' + encodingName, function() {
        assert(tests.jisx0208.length > 0);
        assert(encoding.detect(tests.jisx0208, 'utf-8'));
        assert(encoding.detect(tests.jisx0208) === 'UTF8');
        var encoded = encoding.convert(tests.jisx0208, {
          to: encodingName,
          from: 'utf-8'
        });
        assert(encoded.length > 0);
        assert(encoding.detect(encoded, encodingName));

        var detected = encoding.detect(encoded);
        if (/^UTF16/.test(encodingName)) {
          assert(/^UTF16/.test(detected));
        } else {
          assert(detected === encodingName);
        }

        var decoded = encoding.convert(encoded, {
          to: 'utf-8',
          from: encodingName
        });
        assert.deepEqual(decoded, tests.jisx0208Array);
      });
    });

    it('UTF-8 to Unicode', function() {
      var encoded = encoding.convert(tests.jisx0208, {
        to: 'unicode',
        from: 'utf-8'
      });
      assert(encoded.length > 0);
      assert(encoding.detect(encoded, 'unicode'));
      assert(encoding.detect(encoded) === 'UNICODE');
      tests.jisx0208_unicode = encoded;
    });

    encodingNames = [
      'UTF16', 'UTF16BE', 'UTF16LE', 'SJIS', 'EUCJP', 'JIS', 'UTF8'
    ];
    encodingNames.forEach(function(encodingName) {
      it('UNICODE to ' + encodingName, function() {
        assert(tests.jisx0208_unicode.length > 0);
        assert(encoding.detect(tests.jisx0208_unicode, 'unicode'));
        assert(encoding.detect(tests.jisx0208_unicode) === 'UNICODE');
        var encoded = encoding.convert(tests.jisx0208_unicode, {
          to: encodingName,
          from: 'unicode'
        });
        assert(encoded.length > 0);
        assert(encoding.detect(encoded, encodingName));

        var detected = encoding.detect(encoded);
        if (/^UTF16/.test(encodingName)) {
          assert(/^UTF16/.test(detected));
        } else {
          assert(detected === encodingName);
        }

        var decoded = encoding.convert(encoded, {
          to: 'unicode',
          from: encodingName
        });
        assert.deepEqual(decoded, tests.jisx0208_unicode);
      });
    });

    it('Unicode to Shift_JIS', function() {
      var encoded = encoding.convert(tests.jisx0208, {
        to: 'sjis',
        from: 'utf-8'
      });
      assert(encoded.length > 0);
      assert(encoding.detect(encoded, 'sjis'));
      assert(encoding.detect(encoded) === 'SJIS');
      tests.jisx0208_sjis = encoded;
    });

    encodingNames = [
      'UTF16', 'UTF16BE', 'UTF16LE', 'UNICODE', 'EUCJP', 'JIS', 'UTF8'
    ];
    encodingNames.forEach(function(encodingName) {
      it('SJIS to ' + encodingName, function() {
        assert(tests.jisx0208_sjis.length > 0);
        assert(encoding.detect(tests.jisx0208_sjis, 'sjis'));
        assert(encoding.detect(tests.jisx0208_sjis) === 'SJIS');
        var encoded = encoding.convert(tests.jisx0208_sjis, {
          to: encodingName,
          from: 'sjis'
        });
        assert(encoded.length > 0);
        assert(encoding.detect(encoded, encodingName));

        var detected = encoding.detect(encoded);
        if (/^UTF16/.test(encodingName)) {
          assert(/^UTF16/.test(detected));
        } else {
          assert(detected === encodingName);
        }

        var decoded = encoding.convert(encoded, {
          to: 'sjis',
          from: encodingName
        });
        assert.deepEqual(decoded, tests.jisx0208_sjis);
      });
    });

    it('Shift_JIS to EUC-JP', function() {
      var encoded = encoding.convert(tests.jisx0208, {
        to: 'eucjp',
        from: 'utf-8'
      });
      assert(encoded.length > 0);
      assert(encoding.detect(encoded, 'eucjp'));
      assert(encoding.detect(encoded) === 'EUCJP');
      tests.jisx0208_eucjp = encoded;
    });

    encodingNames = [
      'UTF16', 'UTF16BE', 'UTF16LE', 'UNICODE', 'SJIS', 'JIS', 'UTF8'
    ];
    encodingNames.forEach(function(encodingName) {
      it('EUCJP to ' + encodingName, function() {
        assert(tests.jisx0208_eucjp.length > 0);
        assert(encoding.detect(tests.jisx0208_eucjp, 'eucjp'));
        assert(encoding.detect(tests.jisx0208_eucjp) === 'EUCJP');
        var encoded = encoding.convert(tests.jisx0208_eucjp, {
          to: encodingName,
          from: 'eucjp'
        });
        assert(encoded.length > 0);
        assert(encoding.detect(encoded, encodingName));

        var detected = encoding.detect(encoded);
        if (/^UTF16/.test(encodingName)) {
          assert(/^UTF16/.test(detected));
        } else {
          assert(detected === encodingName);
        }

        var decoded = encoding.convert(encoded, {
          to: 'eucjp',
          from: encodingName
        });
        assert.deepEqual(decoded, tests.jisx0208_eucjp);
      });
    });

    it('EUC-JP to JIS', function() {
      var encoded = encoding.convert(tests.jisx0208, {
        to: 'jis',
        from: 'utf-8'
      });
      assert(encoded.length > 0);
      assert(encoding.detect(encoded, 'jis'));
      assert(encoding.detect(encoded) === 'JIS');
      tests.jisx0208_jis = encoded;
    });

    encodingNames = [
      'UTF16', 'UTF16BE', 'UTF16LE', 'UNICODE', 'SJIS', 'EUCJP', 'UTF8'
    ];
    encodingNames.forEach(function(encodingName) {
      it('JIS to ' + encodingName, function() {
        assert(tests.jisx0208_jis.length > 0);
        assert(encoding.detect(tests.jisx0208_jis, 'jis'));
        assert(encoding.detect(tests.jisx0208_jis) === 'JIS');
        var encoded = encoding.convert(tests.jisx0208_jis, {
          to: encodingName,
          from: 'jis'
        });
        assert(encoded.length > 0);
        assert(encoding.detect(encoded, encodingName));

        var detected = encoding.detect(encoded);
        if (/^UTF16/.test(encodingName)) {
          assert(/^UTF16/.test(detected));
        } else {
          assert(detected === encodingName);
        }

        var decoded = encoding.convert(encoded, {
          to: 'jis',
          from: encodingName
        });
        assert.deepEqual(decoded, tests.jisx0208_jis);
      });
    });
  });

  describe('convert JIS-X-0212', function() {
    var jisx0212_buffer = fs.readFileSync(__dirname + '/jis-x-0212-utf8.txt');
    var jisx0212_array = [];
    for (var i = 0, len = jisx0212_buffer.length; i < len; i++) {
      jisx0212_array.push(jisx0212_buffer[i]);
    }

    var jisx0212_sjis_buffer = fs.readFileSync(__dirname + '/jis-x-0212-sjis-to-utf8.txt');
    var jisx0212_sjis_array = [];
    for (var i = 0, len = jisx0212_sjis_buffer.length; i < len; i++) {
      jisx0212_sjis_array.push(jisx0212_sjis_buffer[i]);
    }

    it('UTF-8 to Unicode', function() {
      var encoded = encoding.convert(jisx0212_buffer, {
        to: 'unicode',
        from: 'utf-8'
      });
      assert(encoded.length > 0);
      assert(encoding.detect(encoded, 'unicode'));
      assert(encoding.detect(encoded) === 'UNICODE');
    });

    it('UTF-8 to SJIS / SJIS to UTF-8', function() {
      var encoded = encoding.convert(jisx0212_buffer, {
        to: 'sjis',
        from: 'utf-8'
      });
      assert(encoded.length > 0);
      assert(encoding.detect(encoded, 'sjis'));
      assert(encoding.detect(encoded) === 'SJIS');
      var encoded_sjis_to_utf8 = encoding.convert(encoded, {
        to: 'utf-8',
        from: 'sjis'
      });
      assert.deepEqual(encoded_sjis_to_utf8, jisx0212_sjis_array);
    });

    var encodingNames = [
      'UTF16', 'UTF16BE', 'UTF16LE', 'UNICODE', 'JIS', 'EUCJP', 'UTF8'
    ];

    encodingNames.forEach(function(encodingName1) {
      var encoded1 = encoding.convert(jisx0212_array, {
        to: encodingName1,
        from: 'utf-8'
      });
      var detected = encoding.detect(encoded1);
      if (/^UTF16/.test(encodingName1)) {
        assert(/^UTF16/.test(detected));
      } else {
        assert(detected === encodingName1);
      }

      encodingNames.forEach(function(encodingName2) {
        it(encodingName1 + ' to ' + encodingName2, function() {
          var encoded2 = encoding.convert(encoded1, {
            to: encodingName2,
            from: encodingName1
          });
          assert(encoded2.length > 0);

          var detected2 = encoding.detect(encoded2);
          if (/^UTF16/.test(encodingName2)) {
            assert(/^UTF16/.test(detected2));
          } else {
            assert(detected2 === encodingName2);
          }

          var decoded = encoding.convert(encoded2, {
            to: 'utf-8',
            from: encodingName2
          });
          assert.deepEqual(decoded, jisx0212_array);
        });
      });
    });
  });


  describe('urlEncode/urlDecode', function() {
    encodings.forEach(function(encodingName) {
      it(encodingName, function () {
        var data = buffers[encodingName];
        var res = encoding.urlEncode(data);
        assert.equal(res, urlEncoded[getExpectedName(encodingName)]);
        assert.deepEqual(getCode(data), encoding.urlDecode(res));
      });
    });
  });


  describe('base64Encode/base64Decode', function() {
    encodings.forEach(function(encodingName) {
      it(encodingName, function () {
        var data = buffers[encodingName];
        var res = encoding.base64Encode(data);
        assert(typeof res === 'string');
        assert.equal(res, data.toString('base64'));
        assert.deepEqual(getCode(data), encoding.base64Decode(res));
      });
    });
  });


  describe('Assign/Expect encoding names', function() {
    var aliasNames = {
      'UCS-4': 'UTF32BE',
      'UCS-2': 'UTF16BE',
      'UCS4': 'UTF32BE',
      'UCS2': 'UTF16BE',
      'ISO 646': 'ASCII',
      'CP367': 'ASCII',
      'Shift_JIS': 'SJIS',
      'x-sjis': 'SJIS',
      'SJIS-open': 'SJIS',
      'SJIS-win': 'SJIS',
      'SHIFT-JIS': 'SJIS',
      'SHIFT_JISX0213': 'SJIS',
      'CP932': 'SJIS',
      'Windows-31J': 'SJIS',
      'MS-Kanji': 'SJIS',
      'EUC-JP-MS': 'EUCJP',
      'eucJP-MS': 'EUCJP',
      'eucJP-open': 'EUCJP',
      'eucJP-win': 'EUCJP',
      'EUC-JPX0213': 'EUCJP',
      'EUC-JP': 'EUCJP',
      'eucJP': 'EUCJP',
      'ISO-2022-JP': 'JIS'
    };

    var text = getExpectedText(getExpectedName('UTF-8'));
    var data = encoding.stringToCode(text);
    assert(data.length > 0);
    assert(encoding.detect(data, 'UNICODE'));

    var sjis = encoding.convert(data, 'sjis');
    assert(sjis.length > 0);
    assert(encoding.detect(sjis, 'SJIS'));

    var eucjp = encoding.convert(data, 'EUCJP');
    assert(eucjp.length > 0);
    assert(encoding.detect(eucjp, 'EUCJP'));

    var codes = {
      'SJIS': sjis,
      'EUCJP': eucjp
    };

    Object.keys(aliasNames).forEach(function(name) {
      it(name + ' is ' + aliasNames[name], function() {
        var encoded = encoding.convert(data, name);
        assert(encoded.length > 0);
        var encodingName = aliasNames[name];
        if (encodingName in codes) {
          var code = codes[encodingName];
          assert(code.length > 0);
          assert.equal(encoding.detect(code), encodingName);
          assert.deepEqual(encoded, code);
        }
      });
    });
  });

  describe('Result types of convert/detect', function() {
    var string = getExpectedText(getExpectedName('UTF-8'));
    assert(string.length > 0);

    var array = encoding.stringToCode(string);
    assert(array.length > 0);
    assert(encoding.detect(array, 'UNICODE'));

    var isTypedArray = function(a) {
      return !Array.isArray(a) && a != null &&
        typeof a.subarray !== 'undefined';
    };

    var isString = function(a) {
      return typeof a === 'string';
    };

    it('null/undefined', function() {
      var encoded = encoding.convert(null, 'utf-8');
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      encoded = encoding.convert(void 0, 'utf-8');
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));
    });

    it('array by default', function() {
      var encoded = encoding.convert([], 'utf-8');
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      encoded = encoding.convert([1], 'utf-8');
      assert(encoded.length === 1);
      assert(Array.isArray(encoded));

      encoded = encoding.convert(new Array(), 'utf-8');
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      var a = new Array(2);
      a[0] = 1;
      a[1] = 2;
      encoded = encoding.convert(a, 'utf-8');
      assert(encoded.length === 2);
      assert(Array.isArray(encoded));
    });

    it('Pass the string argument', function() {
      var encoded = encoding.convert('', 'utf-8');
      assert(encoded.length === 0);
      assert(isString(encoded));

      encoded = encoding.convert('123', 'utf-8');
      assert(encoded.length === 3);
      assert(isString(encoded));

      var utf8 = '\u00E3\u0081\u0093\u00E3\u0082\u0093\u00E3\u0081' +
        '\u00AB\u00E3\u0081\u00A1\u00E3\u0081\u00AF';

      var expect = '\u3053\u3093\u306B\u3061\u306F';

      encoded = encoding.convert(utf8, 'unicode', 'utf-8');
      assert(encoded.length > 0);
      assert(isString(encoded));
      assert.equal(encoded, expect);

      var detected = encoding.detect(utf8);
      assert.equal(detected, 'UTF8');
      detected = encoding.detect(expect);
      assert.equal(detected, 'UNICODE');
    });

    it('Specify { type: "array" }', function() {
      var encoded = encoding.convert(null, {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      encoded = encoding.convert(void 0, {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      encoded = encoding.convert('', {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      encoded = encoding.convert('123', {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 3);
      assert(Array.isArray(encoded));

      encoded = encoding.convert([], {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      encoded = encoding.convert([0x61, 0x62], {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 2);
      assert(Array.isArray(encoded));

      var buffer = new Buffer(0);
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      buffer = new Buffer(2);
      buffer[0] = 0x61;
      buffer[1] = 0x62;
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 2);
      assert(Array.isArray(encoded));

      buffer = new Uint8Array(0);
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 0);
      assert(Array.isArray(encoded));

      buffer = new Uint8Array(2);
      buffer[0] = 0x61;
      buffer[1] = 0x62;
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'array'
      });
      assert(encoded.length === 2);
      assert(Array.isArray(encoded));
    });

    it('Specify { type: "arraybuffer" }', function() {
      var encoded = encoding.convert(null, {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 0);
      assert(isTypedArray(encoded));

      encoded = encoding.convert(void 0, {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 0);
      assert(isTypedArray(encoded));

      encoded = encoding.convert('', {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 0);
      assert(isTypedArray(encoded));

      encoded = encoding.convert('123', {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 3);
      assert(isTypedArray(encoded));

      encoded = encoding.convert([], {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 0);
      assert(isTypedArray(encoded));

      encoded = encoding.convert([0x61, 0x62], {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 2);
      assert(isTypedArray(encoded));

      var buffer = new Buffer(0);
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 0);
      assert(isTypedArray(encoded));

      buffer = new Buffer(2);
      buffer[0] = 0x61;
      buffer[1] = 0x62;
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 2);
      assert(isTypedArray(encoded));

      buffer = new Uint8Array(0);
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 0);
      assert(isTypedArray(encoded));

      buffer = new Uint8Array(2);
      buffer[0] = 0x61;
      buffer[1] = 0x62;
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'arraybuffer'
      });
      assert(encoded.length === 2);
      assert(isTypedArray(encoded));
    });

    it('Specify { type: "string" }', function() {
      var encoded = encoding.convert(null, {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 0);
      assert(isString(encoded));

      encoded = encoding.convert(void 0, {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 0);
      assert(isString(encoded));

      encoded = encoding.convert('', {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 0);
      assert(isString(encoded));

      encoded = encoding.convert('123', {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 3);
      assert(isString(encoded));

      encoded = encoding.convert([], {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 0);
      assert(isString(encoded));

      encoded = encoding.convert([0x61, 0x62], {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 2);
      assert(isString(encoded));

      var buffer = new Buffer(0);
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 0);
      assert(isString(encoded));

      buffer = new Buffer(2);
      buffer[0] = 0x61;
      buffer[1] = 0x62;
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 2);
      assert(isString(encoded));

      buffer = new Uint8Array(0);
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 0);
      assert(isString(encoded));

      buffer = new Uint8Array(2);
      buffer[0] = 0x61;
      buffer[1] = 0x62;
      encoded = encoding.convert(buffer, {
        to: 'utf-8',
        from: 'unicode',
        type: 'string'
      });
      assert(encoded.length === 2);
      assert(isString(encoded));
    });
  });

  describe('Japanese Zenkaku/Hankaku conversion', function() {
    var hankakus = [
      'Hello World! 12345',
      '!"#$%&\'()*+,-./0123456789:;<=>?@' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
    ];

    var zenkakus = [
      'Ｈｅｌｌｏ Ｗｏｒｌｄ！ １２３４５',
      '！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠' +
        'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～'
    ];

    var hankanas = [
      'ﾎﾞﾎﾟｳﾞｧｱｨｲｩｳｪｴｫｵ',
      '､｡｢｣ﾞﾟｧｱｨｲｩｳｪｴｫｵｶｷｸｹｺｻｼｽｾｿﾀﾁｯﾂﾃﾄ' +
      'ﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓｬﾔｭﾕｮﾖﾗﾘﾙﾚﾛﾜｦﾝｳﾞヵヶﾜﾞｦﾞ･ｰ'
    ];

    var zenkanas = [
      'ボポヴァアィイゥウェエォオ',
      '、。「」゛゜ァアィイゥウェエォオカキクケコサシスセソタチッツテト' +
        'ナニヌネノハヒフヘホマミムメモャヤュユョヨラリルレロワヲンヴヵヶ\u30F7\u30FA・ー'
    ];

    var hiraganas = [
      'ぼぽ\u3094ぁあぃいぅうぇえぉお',
      '、。「」゛゜ぁあぃいぅうぇえぉおかきくけこさしすせそたちっつてと' +
        'なにぬねのはひふへほまみむめもゃやゅゆょよらりるれろわをんう゛\u3094\u3095\u3096わ゛を゛・ー'
    ];

    var katakanas = [
      'ボポヴァアィイゥウェエォオ',
      '、。「」゛゜ァアィイゥウェエォオカキクケコサシスセソタチッツテト' +
        'ナニヌネノハヒフヘホマミムメモャヤュユョヨラリルレロワヲンウ゛ヴヵヶ\u30F7\u30FA・ー'
    ];

    var hanspace = 'Hello World! 1 2 3 4 5';
    var zenspace = 'Hello\u3000World!\u30001\u30002\u30003\u30004\u30005';

    it('toHankakuCase', function() {
      zenkakus.forEach(function(zenkaku, i) {
        var expect = hankakus[i];
        var res = encoding.toHankakuCase(zenkaku);
        assert.equal(res, expect);

        var zenkakuArray = encoding.stringToCode(zenkaku);
        var expectArray = encoding.stringToCode(expect);
        res = encoding.toHankakuCase(zenkakuArray);
        assert(Array.isArray(res));
        assert.deepEqual(res, expectArray);
      });
    });

    it('toZenkakuCase', function() {
      hankakus.forEach(function(hankaku, i) {
        var expect = zenkakus[i];
        var res = encoding.toZenkakuCase(hankaku);
        assert.equal(res, expect);

        var hankakuArray = encoding.stringToCode(hankaku);
        var expectArray = encoding.stringToCode(expect);
        res = encoding.toZenkakuCase(hankakuArray);
        assert(Array.isArray(res));
        assert.deepEqual(res, expectArray);
      });
    });

    it('toHiraganaCase', function() {
      katakanas.forEach(function(katakana, i) {
        var expect = hiraganas[i];
        var res = encoding.toHiraganaCase(katakana);
        assert.equal(res, expect);

        var zenkanaArray = encoding.stringToCode(katakana);
        var expectArray = encoding.stringToCode(expect);
        res = encoding.toHiraganaCase(zenkanaArray);
        assert(Array.isArray(res));
        assert.deepEqual(res, expectArray);
      });
    });

    it('toKatakanaCase', function() {
      hiraganas.forEach(function(hiragana, i) {
        var expect = katakanas[i];
        var res = encoding.toKatakanaCase(hiragana);
        assert.equal(res, expect);

        var hiraganaArray = encoding.stringToCode(hiragana);
        var expectArray = encoding.stringToCode(expect);
        res = encoding.toKatakanaCase(hiraganaArray);
        assert(Array.isArray(res));
        assert.deepEqual(res, expectArray);
      });
    });

    it('toHankanaCase', function() {
      zenkanas.forEach(function(zenkana, i) {
        var expect = hankanas[i];
        var res = encoding.toHankanaCase(zenkana);
        assert.equal(res, expect);

        var zenkanaArray = encoding.stringToCode(zenkana);
        var expectArray = encoding.stringToCode(expect);
        res = encoding.toHankanaCase(zenkanaArray);
        assert(Array.isArray(res));
        assert.deepEqual(res, expectArray);
      });
    });

    it('toZenkanaCase', function() {
      hankanas.forEach(function(hankana, i) {
        var expect = zenkanas[i];
        var res = encoding.toZenkanaCase(hankana);
        assert.equal(res, expect);

        var hankanaArray = encoding.stringToCode(hankana);
        var expectArray = encoding.stringToCode(expect);
        res = encoding.toZenkanaCase(hankanaArray);
        assert(Array.isArray(res));
        assert.deepEqual(res, expectArray);
      });
    });

    it('toHankakuSpace', function() {
      var expect = hanspace;
      var res = encoding.toHankakuSpace(zenspace);
      assert.equal(res, expect);

      var zenspaceArray = encoding.stringToCode(zenspace);
      var expectArray = encoding.stringToCode(expect);
      res = encoding.toHankakuSpace(zenspaceArray);
      assert(Array.isArray(res));
      assert.deepEqual(res, expectArray);
    });

    it('toZenkakuSpace', function() {
      var expect = zenspace;
      var res = encoding.toZenkakuSpace(hanspace);
      assert.equal(res, expect);

      var hanspaceArray = encoding.stringToCode(hanspace);
      var expectArray = encoding.stringToCode(expect);
      res = encoding.toZenkakuSpace(hanspaceArray);
      assert(Array.isArray(res));
      assert.deepEqual(res, expectArray);
    });
  });

  describe('codeToString / stringToCode', function() {
    it('Test for JISX0208', function() {
      assert(Array.isArray(tests.jisx0208Array));
      assert(tests.jisx0208Array.length > 0);

      var string = encoding.codeToString(tests.jisx0208Array);
      assert(typeof string === 'string');

      var code = encoding.stringToCode(string);
      assert.deepEqual(code, tests.jisx0208Array);
    });

    it('Test for a long string', function() {
      this.timeout(5000);

      var config = require('../src/config');
      var longArray = [];
      var max = config.APPLY_BUFFER_SIZE;
      assert(typeof max === 'number');
      assert(max > 0);

      while (longArray.length < max) {
        for (var i = 0; i < tests.jisx0208Array.length; i++) {
          longArray.push(tests.jisx0208Array[i]);
        }
      }
      assert(longArray.length > max);

      var string = encoding.codeToString(longArray);
      assert(typeof string === 'string');
      var code = encoding.stringToCode(string);
      assert.deepEqual(code, longArray);

      // Run 2 times to check if APPLY_BUFFER_SIZE_OK is set up expected
      string = encoding.codeToString(longArray);
      code = encoding.stringToCode(string);
      assert.deepEqual(code, longArray);
    });
  });
});
