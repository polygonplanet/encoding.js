/**
 * Encoding conversion table for UTF-8 to JIS (encode only)
 *
 * Accepts Unicode characters that differ between CP932 and JIS X 0208 mappings
 * (e.g., WAVE DASH vs. FULLWIDTH TILDE).
 *
 * { UTF-8 : JIS }
 */
module.exports = {
  0xE28892: 0x215D, // − U+2212 MINUS SIGN same cell as － U+FF0D (0xEFBC8D) -> SJIS 0x817C
  0xE3809C: 0x2141, // 〜 U+301C WAVE DASH same cell as ～ U+FF5E (0xEFBD9E) -> SJIS 0x8160
  0xC2A2: 0x2171,   // ¢ U+00A2 CENT SIGN  same cell as ￠ U+FFE0 (0xEFBFA0) -> SJIS 0x8191
  0xC2A3: 0x2172    // £ U+00A3 POUND SIGN same cell as ￡ U+FFE1 (0xEFBFA1) -> SJIS 0x8192
};
