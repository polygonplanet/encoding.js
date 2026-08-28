/**
 * Remapping CP932 (Windows-31J) IBM extended characters (0xFA40 - 0xFC4B)
 *
 * Remaps IBM extended characters to their corresponding duplicate codes
 * before conversion. These characters are also assigned in the NEC special
 * characters (0x8740 - 0x879C), the NEC-selected IBM extended characters
 * (0xED40 - 0xEEFC), and JIS X 0208.
 *
 * The first 28 characters (0xFA40 - 0xFA5B) have individual mappings defined
 * in CP932_IBM_EXT_SYMBOL_MAP, and the rest are linearly mapped to 0xED40 - 0xEEEC.
 */
var CP932_IBM_EXT_SYMBOL_MAP = [
  // 0xFA40 - 0xFA49 [ⅰ-ⅹ]
  0xEEEF, 0xEEF0, 0xEEF1, 0xEEF2, 0xEEF3, 0xEEF4, 0xEEF5, 0xEEF6, 0xEEF7, 0xEEF8,
  // 0xFA4A - 0xFA53 [Ⅰ-Ⅹ]
  0x8754, 0x8755, 0x8756, 0x8757, 0x8758, 0x8759, 0x875A, 0x875B, 0x875C, 0x875D,
  // 0xFA54 - 0xFA57 [￢￤＇＂]
  0x81CA, 0xEEFA, 0xEEFB, 0xEEFC,
  // 0xFA58 - 0xFA5B [㈱№℡∵]
  0x878A, 0x8782, 0x8784, 0x81E6
];

// The number of IBM extended characters (0xFA40 - 0xFC4B)
var CP932_IBM_EXT_LEN = 388;
// The number of valid trail bytes per lead byte (0x40 - 0xFC, except 0x7F)
var CP932_IBM_EXT_TRAIL_BYTES_LEN = 188;

function remapCP932_IBMExt(b1, b2) {
  var leadOffset = (b1 - 0xFA) * CP932_IBM_EXT_TRAIL_BYTES_LEN;
  var trailIndex = b2 - (b2 < 0x7F ? 0x40 : 0x41);
  var ibmExtIndex = leadOffset + trailIndex;

  if (ibmExtIndex < 0 || ibmExtIndex >= CP932_IBM_EXT_LEN) {
    return (b1 << 8) | b2;
  }

  if (ibmExtIndex < CP932_IBM_EXT_SYMBOL_MAP.length) {
    return CP932_IBM_EXT_SYMBOL_MAP[ibmExtIndex];
  }

  var necSelectedIbmOffset = ibmExtIndex - CP932_IBM_EXT_SYMBOL_MAP.length;

  // Remap to NEC-selected IBM extended characters (0xED40 - 0xEEEC)
  b1 = 0xED;
  if (necSelectedIbmOffset >= CP932_IBM_EXT_TRAIL_BYTES_LEN) {
    necSelectedIbmOffset -= CP932_IBM_EXT_TRAIL_BYTES_LEN;
    b1++;
  }

  b2 = necSelectedIbmOffset + 0x40;
  if (b2 >= 0x7F) {
    b2++; // Skip invalid trail byte 0x7F
  }
  return (b1 << 8) | b2;
}

/**
 * Remapping duplicate codes for CP932 NEC special characters to their
 * standard JIS X 0208 codes.
 *
 * This also includes 0xEEF9 in the NEC-selected IBM extended characters.
 */
var CP932_NEC_DUPLICATE_MAP = {
  0x8790: 0x81E0, // ≒ (NEC special characters)
  0x8791: 0x81DF, // ≡
  0x8792: 0x81E7, // ∫
  0x8795: 0x81E3, // √
  0x8796: 0x81DB, // ⊥
  0x8797: 0x81DA, // ∠
  0x879A: 0x81E6, // ∵
  0x879B: 0x81BF, // ∩
  0x879C: 0x81BE, // ∪
  0xEEF9: 0x81CA  // ￢ (NEC-selected IBM extended characters)
};

function remapCP932DuplicateCode(b1, b2) {
  if (b2 < 0x40 || b2 > 0xFC || b2 === 0x7F) {
    return (b1 << 8) | (b2 & 0xFF);
  }

  if (b1 >= 0xFA) {
    return remapCP932_IBMExt(b1, b2);
  }

  var code = (b1 << 8) | b2;
  var remapped = CP932_NEC_DUPLICATE_MAP[code];
  return remapped == null ? code : remapped;
}
exports.remapCP932DuplicateCode = remapCP932DuplicateCode;

function hasCP932DuplicateCode(b1) {
  return b1 >= 0xFA || b1 === 0x87 || b1 === 0xEE;
}
exports.hasCP932DuplicateCode = hasCP932DuplicateCode;
