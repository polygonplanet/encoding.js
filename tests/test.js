var assert = require('assert');
var encoding = require('../encoding');
var fs = require('fs');

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
    return 'このテキストは ' + name + ' で書かれています。';
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

  before(function (done) {
    encodings.forEach(function(encodingName) {
      fs.readFile(getFileName(encodingName), function(err, data) {
        if (err) {
          throw err;
        }

        buffers[encodingName] = data;
        if (Object.keys(buffers).length === encodings.length) {
          done();
        }
      });
    });
  });

  describe('detect', function() {
    encodings.forEach(function(encodingName) {
      it(encodingName, function () {
        var res = encoding.detect(buffers[encodingName]);
        assert.equal(res, getExpectedName(encodingName));
      });
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
  });

  describe('urlEncode/urlDecode', function() {
    encodings.forEach(function(encodingName) {
      it(encodingName, function () {
        var data = buffers[encodingName];
        var res = encoding.urlEncode(data);
        assert.equal(res, urlEncoded[getExpectedName(encodingName)]);
        assert.equal(getCode(data).join(','), encoding.urlDecode(res).join(','));
      });
    });
  });
});
