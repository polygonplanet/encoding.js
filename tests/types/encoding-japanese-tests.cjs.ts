/// <reference types="node" />
import Encoding = require("../..");

// Convert character encoding to Shift_JIS from UTF-8.
const utf8Array_1 = new Uint8Array([1, 2, 3]);
const utf8Array_2 = [1, 2, 3];
const utf8Array_3 = Buffer.from([1, 2, 3]);
const utf8Array_4 = new Uint16Array([1, 2, 3]);
const utf8Array_5 = new Uint32Array([1, 2, 3]);
const utf8Array_6 = new Int16Array([1, 2, 3]);
const utf8Array_7 = new Int32Array([1, 2, 3]);
const utf8Array_8 = new Int8Array([1, 2, 3]);
const utf8Array_9: readonly number[] = [1, 2, 3];
expectType<number[]>()(Encoding.convert(utf8Array_1, "SJIS", "UTF8"));
expectType<number[]>()(Encoding.convert(utf8Array_2, "UTF16", "UTF8"));
expectType<number[]>()(Encoding.convert(utf8Array_3, "UTF16LE", "UTF8"));
expectType<number[]>()(Encoding.convert(utf8Array_4, "UTF16BE", "UTF8"));
expectType<number[]>()(Encoding.convert(utf8Array_5, "BINARY", "UTF8"));
expectType<number[]>()(Encoding.convert(utf8Array_6, "UTF32", "UTF8"));
expectType<number[]>()(Encoding.convert(utf8Array_7, "AUTO", "UTF8"));
expectType<number[]>()(Encoding.convert(utf8Array_8, "ASCII", "UTF8"));
expectType<number[]>()(Encoding.convert(utf8Array_9, "JIS", "UTF8"));
expectType<string>()(Encoding.convert("string value", "UTF16", "UTF8"));

// Convert character encoding by automatic detection (AUTO detect).
const utf8Array = utf8Array_1;
const sjisArray1 = Encoding.convert(utf8Array, "SJIS");
expectType<number[]>()(sjisArray1);
// or
const sjisArray2 = Encoding.convert(utf8Array, "SJIS", "AUTO");
expectType<number[]>()(sjisArray2);

// Detect the character encoding.
// The return value be one of the "Available Encodings" below.
const detected = Encoding.detect(utf8Array);
expectType<Encoding.Encoding | false>()(detected);
if (detected === "UTF8") {
    // Encoding is UTF-8'
}

const sjisArray3 = Encoding.convert(utf8Array, {
    to: "SJIS", // to_encoding
    from: "UTF8", // from_encoding
});
expectType<number[]>()(sjisArray3);

const sjisArray4 = Encoding.convert("🐙", {
    to: "SJIS", // to_encoding
    from: "UTF8", // from_encoding
    type: "string",
    fallback: "html-entity",
});
expectType<string>()(sjisArray4);
// fallback: '&#128025;'

const sjisArray5 = Encoding.convert("🐙", {
    to: "SJIS", // to_encoding
    from: "UTF8", // from_encoding
    type: "string",
    fallback: "ignore",
});
expectType<string>()(sjisArray5);
// fallback: ''

const sjisArray6 = Encoding.convert("🐙", {
    to: "SJIS", // to_encoding
    from: "UTF8", // from_encoding
    type: "string",
    fallback: "error",
});
expectType<string>()(sjisArray6);
// throws error: `Character cannot be represented`

const utf8String = "ã\u0081\u0093ã\u0082\u0093ã\u0081«ã\u0081¡ã\u0081¯";
const unicodeString = Encoding.convert(utf8String, {
    to: "UNICODE",
    from: "UTF8",
    type: "string", // Specify 'string' type. (Return as string)
});
expectType<string>()(unicodeString);

const unicodeString2 = Encoding.convert(utf8String, {
    to: "UNICODE",
    from: "UTF8", // Unspecified type. Inferred from 1st argument
});
expectType<string>()(unicodeString2);

const utf16Array = Encoding.convert(utf8Array, {
    to: "UTF16", // to_encoding
    from: "UTF8", // from_encoding
    bom: true, // With BOM
});
expectType<number[]>()(utf16Array);

const utf16leArray = Encoding.convert(utf8Array, {
    to: "UTF16", // to_encoding
    from: "UTF8", // from_encoding
    bom: "LE", // With BOM (little-endian)
});
expectType<number[]>()(utf16leArray);

const utf16beArray = Encoding.convert(utf8Array, {
    to: "UTF16BE",
    from: "UTF8",
});
expectType<number[]>()(utf16beArray);

const utf16Array2 = Encoding.convert(utf8Array, {
    to: "UTF16", // to_encoding
    from: "UTF8", // from_encoding
    type: "array",
    bom: true, // With BOM
});
expectType<number[]>()(utf16Array2);

const utf16Array3 = Encoding.convert(utf8Array, {
    to: "UTF16", // to_encoding
    from: "UTF8", // from_encoding
    type: "arraybuffer",
    bom: true, // With BOM
});
expectType<Uint16Array>()(utf16Array3);

const utf16Array4 = Encoding.convert(utf8Array, {
    to: "UTF16", // to_encoding
    from: "UTF8", // from_encoding
    type: "string",
    bom: true, // With BOM
});
expectType<string>()(utf16Array4);

// Detect character encoding by automatic. (AUTO detect).
const detected2 = Encoding.detect(utf8Array);
expectType<Encoding.Encoding | false>()(detected2);
if (detected2 === "UTF8") {
    // Encoding is UTF-8'
}

// Detect character encoding by specific encoding name.
const isSJIS = Encoding.detect(sjisArray1, "SJIS");
expectType<Encoding.Encoding | false>()(isSJIS);
if (isSJIS) {
    // Encoding is SJIS'
}

const sjisArray7 = [
    130,
    177,
    130,
    241,
    130,
    201,
    130,
    191,
    130,
    205,
    129,
    65,
    130,
    217,
    130,
    176,
    129,
    153,
    130,
    210,
    130,
    230,
];

const encoded = Encoding.urlEncode(sjisArray7);
expectType<string>()(encoded);
// encoded: '%82%B1%82%F1%82%C9%82%BF%82%CD%81A%82%D9%82%B0%81%99%82%D2%82%E6'

const decoded = Encoding.urlDecode(encoded);
expectType<number[]>()(decoded);
// decoded: [
//   130, 177, 130, 241, 130, 201, 130, 191, 130, 205, 129,
//    65, 130, 217, 130, 176, 129, 153, 130, 210, 130, 230
// ]

const sjisArray8 = [130, 177, 130, 241, 130, 201, 130, 191, 130, 205];
const encoded2 = Encoding.base64Encode(sjisArray8);
expectType<string>()(encoded2);
// encoded2: 'grGC8YLJgr+CzQ=='

const decoded2 = Encoding.base64Decode(encoded2);
expectType<number[]>()(decoded2);
// decoded2: [130, 177, 130, 241, 130, 201, 130, 191, 130, 205]

expectType<string>()(Encoding.version);
expectType<string[]>()(Encoding.orders);

expectType<number[]>()(Encoding.toZenkakuCase([1, 2, 3]));
expectType<string>()(Encoding.toZenkakuCase("abcdef"));
expectType<number[]>()(Encoding.toHankakuCase([1, 2, 3]));
expectType<string>()(Encoding.toHankakuCase("ＡＢＣＤＥＦ"));
expectType<number[]>()(Encoding.toZenkanaCase([1, 2, 3]));
expectType<string>()(Encoding.toZenkanaCase("ｱｲｳｴｵ"));
expectType<number[]>()(Encoding.toHankanaCase([1, 2, 3]));
expectType<string>()(Encoding.toHankanaCase("アイウエオ"));
expectType<number[]>()(Encoding.toZenkakuSpace([1, 2, 3]));
expectType<string>()(Encoding.toZenkakuSpace("     "));
expectType<number[]>()(Encoding.toHankakuSpace([1, 2, 3]));
expectType<string>()(Encoding.toHankakuSpace("\u{3000}"));
