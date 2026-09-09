/**
 * Checks whether type A is equal to type B
 * See also: https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
 */
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false;

/**
 * Raises a type error if Actual type is not equal to Expected type
 *
 * @example
 * expectType<string>()("test"); // Passes if the value is of type string
 */
declare function expectType<Expected>(): <Actual>(
  value: Actual,
  // Raise a type error by requiring an impossible second argument
  ...notEqual: Equals<Actual, Expected> extends true ? [] : [never]
) => void;
