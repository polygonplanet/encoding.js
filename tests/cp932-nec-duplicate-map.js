/**
 * Unicode mappings for SJIS (CP932) duplicate codes
 *
 * Includes:
 * - NEC special characters (9 codes in 0x8740 - 0x879C)
 * - NEC-selected IBM extended characters (0xEEF9)
 *
 * Reference:
 * https://unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP932.TXT
 *
 * The keys are SJIS codes and the values are Unicode code points.
 *
 * { SJIS : UNICODE }
 */
module.exports = {
  0x8790: 0x2252, // ≒ (NEC special characters)
  0x8791: 0x2261, // ≡
  0x8792: 0x222B, // ∫
  0x8795: 0x221A, // √
  0x8796: 0x22A5, // ⊥
  0x8797: 0x2220, // ∠
  0x879A: 0x2235, // ∵
  0x879B: 0x2229, // ∩
  0x879C: 0x222A, // ∪
  0xEEF9: 0xFFE2  // ￢ (NEC-selected IBM extended characters)
};
