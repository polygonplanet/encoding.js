export {};

declare const stringType: string;
declare const anyType: any;
declare const unionType: string | number;
declare const neverType: never;

expectType<string>()(stringType);

// @ts-expect-error
expectType<number>()(stringType);
// @ts-expect-error
expectType<string>()(anyType);
// @ts-expect-error
expectType<string>()(unionType);
// @ts-expect-error
expectType<string | number>()(stringType);
// @ts-expect-error
expectType<string>()(neverType);
// @ts-expect-error
expectType<never>()(stringType);
