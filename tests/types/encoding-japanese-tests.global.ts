// just verify we can use exported namespace

const utf8Array = new Uint8Array([0xE3, 0x81, 0x82]); // 'あ' in UTF-8
const sjisArray = Encoding.convert(utf8Array, 'SJIS');

const unicodeString = Encoding.convert(sjisArray, {
  to: 'UNICODE',
  from: 'SJIS',
  type: 'string'
});
expectType<string>()(unicodeString);
