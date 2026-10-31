// TypeScript declarations originally from DefinitelyTyped
// Upstream package: @types/encoding-japanese 2.2.1
// Thanks to the DefinitelyTyped contributors
// Licensed under the MIT License. See the LICENSE file

export as namespace Encoding;

export type Encoding =
    | "UTF32"
    | "UTF16"
    | "UTF16BE"
    | "UTF16LE"
    | "BINARY"
    | "ASCII"
    | "JIS"
    | "UTF8"
    | "EUCJP"
    | "SJIS"
    | "UNICODE"
    | "AUTO";

// `string & {}` accepts other aliases (such as "Shift_JIS" and "utf-8").
export type EncodingName =
    | Encoding
    | Lowercase<Encoding>
    | (string & {});

type IntArrayType =
    | readonly number[]
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array;

type FallbackType =
    | 'html-entity'
    | 'html-entity-hex'
    | 'ignore'
    | 'error';

type EncodingDetection = Encoding | false;

export type ConvertOptions =
    | ConvertStringOptions
    | ConvertArrayBufferOptions
    | ConvertArrayOptions
    | ConvertUnknownOptions;

export interface ConvertStringOptions {
    to: EncodingName;
    from?: EncodingName | undefined;
    type: "string";
    fallback?: FallbackType;
    bom?: boolean | string | undefined;
}

export interface ConvertArrayBufferOptions {
    to: EncodingName;
    from?: EncodingName | undefined;
    type: "arraybuffer";
    fallback?: FallbackType;
    bom?: boolean | string | undefined;
}

export interface ConvertArrayOptions {
    to: EncodingName;
    from?: EncodingName | undefined;
    type: "array";
    fallback?: FallbackType;
    bom?: boolean | string | undefined;
}

export interface ConvertUnknownOptions {
    to: EncodingName;
    from?: EncodingName | undefined;
    fallback?: FallbackType;
    bom?: boolean | string | undefined;
}

export function detect(data: IntArrayType | string, encodings?: EncodingName | EncodingName[]): EncodingDetection;
export function convert(data: IntArrayType, to: EncodingName, from?: EncodingName): number[];
export function convert(data: string, to: EncodingName, from?: EncodingName): string;
export function convert(data: IntArrayType | string, options: ConvertStringOptions): string;
export function convert(data: IntArrayType | string, options: ConvertArrayBufferOptions): Uint16Array;
export function convert(data: IntArrayType | string, options: ConvertArrayOptions): number[];
export function convert(data: string, options: ConvertUnknownOptions): string;
export function convert(data: IntArrayType, options: ConvertUnknownOptions): number[];
export function urlEncode(data: IntArrayType | string): string;
export function urlDecode(data: string): number[];
export function base64Encode(data: IntArrayType | string): string;
export function base64Decode(data: string): number[];
export function codeToString(data: IntArrayType): string;
export function stringToCode(data: string): number[];
export function toHankakuCase(data: IntArrayType): number[];
export function toHankakuCase(data: string): string;
export function toZenkakuCase(data: IntArrayType): number[];
export function toZenkakuCase(data: string): string;
export function toHiraganaCase(data: IntArrayType): number[];
export function toHiraganaCase(data: string): string;
export function toKatakanaCase(data: IntArrayType): number[];
export function toKatakanaCase(data: string): string;
export function toHankanaCase(data: IntArrayType): number[];
export function toHankanaCase(data: string): string;
export function toZenkanaCase(data: IntArrayType): number[];
export function toZenkanaCase(data: string): string;
export function toHankakuSpace(data: IntArrayType): number[];
export function toHankakuSpace(data: string): string;
export function toZenkakuSpace(data: IntArrayType): number[];
export function toZenkakuSpace(data: string): string;

export const version: string;
export const orders: string[];

export {};
