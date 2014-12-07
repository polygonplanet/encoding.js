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
});
