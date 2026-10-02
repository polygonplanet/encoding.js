/**
 * Conversion tables between UTF-8 and JIS
 *
 * The tables are stored in a compressed text format
 * (see `src/utf8-to-jis-table.js`) and expanded into the *_TABLE objects.
 */
var jisTableData = require('./utf8-to-jis-table');
var jisx0212TableData = require('./utf8-to-jisx0212-table');
var UTF8_TO_JIS_ALIAS_TABLE = require('./utf8-to-jis-alias-table');

var UTF8_TO_JIS_TABLE = {};
var JIS_TO_UTF8_TABLE = {};
var UTF8_TO_JISX0212_TABLE = {};
var JISX0212_TO_UTF8_TABLE = {};

// Unicode code point (BMP only) -> UTF-8 bytes packed into a number
// Same encoding as UNICODEToUTF8, but returns a number instead of an array
function toUTF8(c) {
  if (c < 0x80) {
    return c;
  }
  if (c < 0x800) {
    return (0xC0 | (c >> 6)) << 8 |
           (0x80 | (c & 0x3F));
  }
  return (0xE0 | (c >> 12)) << 16 |
         (0x80 | ((c >> 6) & 0x3F)) << 8 |
         (0x80 | (c & 0x3F));
}

/**
 * Expand the compressed table data into the forward and reverse tables.
 *
 * Tokens are separated by ",":
 *   "LB="    start of lead byte 0xLB (hex): the trail byte restarts at 0x21
 *   "UUUU"   Unicode code point (hex) for the current trail byte
 *   "UUUU+N" N consecutive code points starting at UUUU
 *   "-N"     skip N trail bytes (unassigned)
 *
 * Example of compressed table data:
 *   '21=3000+3,ff0c,ff0e,30fb, ...' : lead byte 0x21
 *   '22=25c6,25a1,25a0,25b3,25b2, ...' : lead byte 0x22
 *   '23=-15,ff10+10,-7,ff21+26,-6, ...' : lead byte 0x23
 */
function expandTable(data, utf8ToJisTable, jisToUtf8Table) {
  var tokens = data.split(',');
  var lead, trail, token, pos, cp, n, jis, utf8;

  for (var i = 0, len = tokens.length; i < len; i++) {
    token = tokens[i];

    // The first token always contains "LB="
    pos = token.indexOf('=');
    if (pos !== -1) {
      lead = parseInt(token.slice(0, pos), 16);
      trail = 0x21; // the trail byte restarts at 0x21
      token = token.slice(pos + 1);
    }

    if (token.charAt(0) === '-') {
      // skip N trail bytes (e.g., "23=-15,ff10+10,-7, ...")
      trail += parseInt(token.slice(1), 10);
      continue;
    }

    // "UUUU" or "UUUU+N"
    pos = token.indexOf('+');
    if (pos === -1) {
      cp = parseInt(token, 16);
      n = 1;
    } else {
      cp = parseInt(token.slice(0, pos), 16);
      n = parseInt(token.slice(pos + 1), 10);
    }

    while (n-- > 0) {
      jis = (lead << 8) | trail++;
      utf8 = toUTF8(cp++);
      utf8ToJisTable[utf8] = jis;
      jisToUtf8Table[jis] = utf8;
    }
  }
}

var expanded = false;

function initConversionTables() {
  if (expanded) {
    return;
  }

  expandTable(jisTableData, UTF8_TO_JIS_TABLE, JIS_TO_UTF8_TABLE);
  expandTable(jisx0212TableData, UTF8_TO_JISX0212_TABLE, JISX0212_TO_UTF8_TABLE);

  // Add Half-width katakana (not stored in the compressed data)
  // U+FF61..U+FF9F -> 0x21..0x5F (forward table only)
  for (var kana = 0xFF61, jisKana = 0x21; jisKana <= 0x5F; kana++, jisKana++) {
    UTF8_TO_JIS_TABLE[toUTF8(kana)] = jisKana;
  }
  expanded = true;
}
exports.initConversionTables = initConversionTables;

exports.UTF8_TO_JIS_TABLE = UTF8_TO_JIS_TABLE;
exports.UTF8_TO_JIS_ALIAS_TABLE = UTF8_TO_JIS_ALIAS_TABLE;
exports.UTF8_TO_JISX0212_TABLE = UTF8_TO_JISX0212_TABLE;
exports.JIS_TO_UTF8_TABLE = JIS_TO_UTF8_TABLE;
exports.JISX0212_TO_UTF8_TABLE = JISX0212_TO_UTF8_TABLE;
