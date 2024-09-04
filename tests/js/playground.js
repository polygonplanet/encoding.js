(function () {
  'use strict';

  const ENCODINGS = ['SJIS', 'UTF8', 'EUCJP', 'JIS', 'UTF16', 'UTF16BE', 'UTF16LE', 'UNICODE'];

  const inspectArray = (array) => `[${array.join(', ')}]`;

  const codeToArray = (code) => {
    return code
      .replace(/^\s*\[|\]\s*$/g, '')
      .split(',')
      .map((c) => {
        c = c.trim();
        return parseInt(c, c.toLowerCase().substring(0, 2) === '0x' ? 16 : 10);
      });
  };

  const isValidCode = (code) => {
    code = code.trim();
    return /^\[\s*(?:\s*(?:0|[1-9]\d*|0x[a-f0-9]+)\s*(?=,|\]),?)*?\s*\]$/i.test(code);
  };

  const decToHex = (code) => {
    let hexLen = 2;
    code.forEach((c) => {
      const len = c.toString(16).length;
      if (len > hexLen) {
        hexLen = len;
      }
    });
    return code.map(
      (c) => '0x' + (new Array(hexLen + 1).join('0') + c.toString(16)).slice(-hexLen).toUpperCase()
    );
  };

  PetiteVue.createApp({
    input: 'こんにちは',
    inputCode: '',
    inputCodeAsHex: false,
    result: '',
    resultCode: '',
    resultCodeAsHex: false,
    to: 'SJIS',
    from: 'AUTO',
    fallback: '',
    bom: '',
    version: Encoding.version,

    toOptions: ENCODINGS.map((encoding) => ({ text: encoding, value: encoding })),
    fromOptions: ['AUTO', ...ENCODINGS].map((encoding) => ({ text: encoding, value: encoding })),
    fallbackOptions: [
      { text: '(none)', value: '' },
      { text: 'error', value: 'error' },
      { text: 'ignore', value: 'ignore' },
      { text: 'html-entity', value: 'html-entity' },
      { text: 'html-entity-hex', value: 'html-entity-hex' }
    ],
    bomOptions: [
      { text: '(none)', value: '' },
      { text: 'BE (big-endian)', value: 'BE' },
      { text: 'LE (little-endian)', value: 'LE' }
    ],

    init() {
      this.updateInput();
      this.updateResult();
    },
    setInputCode(code) {
      this.inputCode = inspectArray(this.inputCodeAsHex ? decToHex(code) : code);
    },
    updateInput() {
      const input = this.input;
      const code = input.length === 0 ? [] : Encoding.stringToCode(input);
      this.setInputCode(code);
    },
    updateInputCode() {
      const code = this.inputCode;
      if (code.length === 0) {
        return;
      }

      if (!isValidCode(code)) {
        // this.input = 'Error: Invalid code';
        return;
      }
      this.input = Encoding.codeToString(codeToArray(code));
    },
    inputCodeAsHexChange() {
      let code = this.inputCode;
      if (!isValidCode(code)) {
        return;
      }
      this.setInputCode(codeToArray(code));
    },
    setResultCode(code) {
      this.resultCode = inspectArray(this.resultCodeAsHex ? decToHex(code) : code);
    },
    updateResult() {
      const result = this.result;
      const code = result.length === 0 ? [] : Encoding.stringToCode(result);
      this.setResultCode(code);
    },
    updateResultCode() {
      const code = this.resultCode;
      if (code.length === 0) {
        return;
      }

      if (!isValidCode(code)) {
        // this.result = 'Error: Invalid code';
        return;
      }
      this.result = Encoding.codeToString(codeToArray(code));
    },
    resultCodeAsHexChange() {
      let code = this.resultCode;
      if (!isValidCode(code)) {
        return;
      }
      this.setResultCode(codeToArray(code));
    },
    convert() {
      const options = {
        to: this.to,
        from: this.from,
        type: 'array'
      };
      if (this.fallback) {
        options.fallback = this.fallback;
      }
      if (this.bom) {
        options.bom = this.bom;
      }

      try {
        const result = Encoding.convert(this.input, options);
        this.result = Encoding.codeToString(result);
      } catch (e) {
        this.result = e.message;
      }
      this.updateResult();
    },
    detect() {
      this.result = Encoding.detect(this.input);
      this.updateResult();
    },
    clear() {
      this.input = '';
      this.inputCode = '';
      this.result = '';
      this.resultCode = '';
    }
  }).mount();
})();
