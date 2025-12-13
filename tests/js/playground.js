(function () {
  'use strict';

  const ENCODINGS = {
    SJIS: 'Shift_JIS',
    UTF8: 'UTF-8',
    EUCJP: 'EUC-JP',
    JIS: 'ISO-2022-JP',
    UTF16: 'UTF-16',
    UTF16BE: 'UTF-16BE',
    UTF16LE: 'UTF-16LE',
    UNICODE: 'UNICODE'
  };

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
    return /^\[\s*(?:(?:0|[1-9]\d*|0x[a-f0-9]+)(?:\s*,\s*(?:0|[1-9]\d*|0x[a-f0-9]+))*?)\s*\]$/i.test(code);
  };

  const decToHex = (code) => {
    let hexLen = 2;
    code.forEach((c) => {
      const len = c.toString(16).length;
      if (len > hexLen) {
        hexLen = len;
      }
    });
    return code.map((c) => '0x' + (new Array(hexLen + 1).join('0') + c.toString(16)).slice(-hexLen).toUpperCase());
  };

  const getByteSize = (str) => new TextEncoder().encode(str).length;

  const parseQueryParams = () => {
    const query = location.search.substring(1);
    if (query.length === 0) {
      return {};
    }
    const searchParams = new URLSearchParams(query);
    const params = {};
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  };

  const parseInputParams = () => {
    const params = parseQueryParams();
    const input = params.input || '';
    if (input.length === 0 || /[^a-zA-Z0-9]/.test(input)) {
      return '';
    }
    return lzbase62.decompress(input);
  };

  const updateURLParam = (params) => {
    const url = new URL(window.location);

    Object.entries(params).forEach(([key, value]) => {
      if (value && value.length) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });

    if (url.toString() === window.location.toString()) {
      return;
    }
    window.history.pushState({}, '', url);
  };

  let isPopStateAdded = false;
  const DEFAULT_INPUT = 'こんにちは';
  const getDefaultInput = () => parseInputParams() || DEFAULT_INPUT;

  PetiteVue.createApp({
    input: getDefaultInput(),
    inputCode: '',
    inputCodeAsHex: false,
    inputByteSize: null,
    result: '',
    resultCode: '',
    resultCodeAsHex: false,
    resultByteSize: null,
    to: 'SJIS',
    from: 'AUTO',
    fallback: '',
    bom: '',
    shareURLInput: '',
    shareURLCopiedMessage: '',
    isValidShareURL: false,
    processingTime: null,
    version: Encoding.version,

    toOptions: Object.entries(ENCODINGS).map(([key, value]) => {
      const text = key === value ? key : `${key} (${value})`;
      return { text, value: key };
    }),
    fromOptions: Object.entries({ ...{ AUTO: 'AUTO' }, ...ENCODINGS }).map(([key, value]) => {
      const text = key === value ? key : `${key} (${value})`;
      return { text, value: key };
    }),

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
      this.updateShareURL();

      if (!isPopStateAdded) {
        isPopStateAdded = true;
        window.addEventListener('popstate', (ev) => {
          const input = parseInputParams();
          this.input = input || DEFAULT_INPUT;
          this.updateInput();
          this.updateShareURL(true);
        });
      }
    },
    setInputCode(code) {
      this.inputCode = inspectArray(this.inputCodeAsHex ? decToHex(code) : code);
    },
    updateInput() {
      const input = this.input;
      const code = input.length === 0 ? [] : Encoding.stringToCode(input);
      this.setInputCode(code);
      this.updateInputByteSize();
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
      this.updateInputByteSize();
    },
    updateInputByteSize() {
      // Inputは常にUTF-8換算でバイト数を計測
      this.inputByteSize = getByteSize(this.input);
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
      this.updateResultByteSize(result, code);
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
      const codeArray = codeToArray(code);
      this.result = Encoding.codeToString(codeArray);
      this.updateResultByteSize(result, codeArray);
    },
    updateResultByteSize(result, codeArray) {
      const hasWideChar = codeArray.some((n) => n > 255);

      // UNICODE指定時、または255を超える値が含まれる場合（=UNICODE）は、
      // バイト配列ではなく文字列とみなしてUTF-8換算で計測
      // UNICODE指定時は内部表現(0-65535)になるため、Inputと同様にUTF-8換算で計測
      if (this.to === 'UNICODE' || hasWideChar) {
        this.resultByteSize = getByteSize(result);
      } else {
        // SJIS, UTF8, UTF16(BE/LE)などの場合はバイト配列(0-255)が返るので、配列長がそのままバイト数
        this.resultByteSize = codeArray.length;
      }
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
        const result = this.withProcessingTime(() => {
          return Encoding.convert(this.input, options);
        });
        this.result = Encoding.codeToString(result);
      } catch (e) {
        this.result = e.message;
      }

      this.updateResult();
      this.updateShareURL();
    },
    detect() {
      this.withProcessingTime(() => {
        this.result = Encoding.detect(this.input);
      });
      this.updateResult();
      this.updateShareURL();
    },
    clear() {
      this.input = '';
      this.inputCode = '';
      this.inputByteSize = null;
      this.result = '';
      this.resultCode = '';
      this.resultByteSize = null;
      this.processingTime = null;
      this.isCopiedShareURL = false;
      this.updateShareURL();
    },
    withProcessingTime(callback) {
      this.processingTime = null;
      const startTime = performance.now();
      const res = callback();
      const endTime = performance.now();
      this.processingTime = Math.round((endTime - startTime) * 10000) / 10000;
      return res;
    },
    updateShareURL(skipPushState = false) {
      if (this.input.length > 1500) {
        this.shareURLInput = 'Input is too long to generate share URL.';
        this.isValidShareURL = false;
        return;
      }

      this.isValidShareURL = true;
      let compressedInput = '';

      if (this.input.length === 0 || this.input === DEFAULT_INPUT) {
        compressedInput = '';
      } else {
        compressedInput = lzbase62.compress(this.input);
      }

      if (!skipPushState) {
        updateURLParam({ input: compressedInput });
      }
      this.shareURLInput = window.location.href;
    },
    copyShareURL() {
      const copyToClipboard = (text) => {
        if (window.isSecureContext && navigator.clipboard && navigator.clipboard.writeText) {
          return navigator.clipboard.writeText(text);
        }
        return Promise.reject();
      };

      copyToClipboard(this.shareURLInput).then(
        () => {
          this.shareURLCopiedMessage = i18n.t('tooltip-copied');
        },
        () => {
          this.shareURLCopiedMessage = i18n.t('tooltip-failed-to-copy');
          console.error('Failed to copy the share URL to clipboard.');
        }
      );

      setTimeout(() => (this.shareURLCopiedMessage = ''), 2000);
    }
  }).mount();
})();
