// TYPES

/**
 * Type representing a function that given any number of parameters of any type returns a boolean
 * e.g.: TPredicate<[number]> equals (n: number) => boolean
 * e.g.: TPredicate<[number, string]> equals (n: number, str: string) => boolean
 */
export type TPredicate<T extends any[]> = (...params: T) => boolean;
/**
 * Type representing a function that given any number of parameters of any type returns a TBoolean<any []>
 * e.g.: THigherOrderBooleanPredicate<[number, string], [string]> equals (n: number, str: string) => (arg: string) => boolean
 */
export type THigherOrderPredicate<U extends any[], T extends any[]> = (...params: U) => TPredicate<T>;

type TBooleanOrPredicate = boolean | TPredicate<any[]>;
type TNotArg = TBooleanOrPredicate | THigherOrderPredicate<any[], any[]>;
type TBooleanOrPredicateArray = TBooleanOrPredicate[];

type TIterateMethod = typeof Array.prototype.every | typeof Array.prototype.some;

// UTILS

/** Checking at runtime if a function is a predicate is difficult without parsing it.
 The only way is to invoke it and check the type of the return value to be boolean.
 To be able to invoke any function of any arity and arguments type, the only option invoke it without passing arguments.
 Therefore, the predicate being tested must be resilient to be invoked without arguments.

 Example:
 BAD ❌ const hasLengthGreaterThanZero = (argument: string) => argument.length > 0;
 Invoking it without arguments would throw "Cannot read properties of undefined (reading 'length')"
 GOOD ✅ const hasLengthGreaterThanZero = (argument: string) => argument?.length > 0;

 The return value being true or false, wrong or right, is not important. Must be a boolean and don't throw errors
 when invoked without arguments.
 */
export const isPredicate = (
	arg: TPredicate<any[]> | THigherOrderPredicate<any[], any[]>
): arg is TPredicate<any[]> => {
	if (typeof arg !== 'function') {
		return false;
	}
	let result;
	try {
		result = arg();
	} catch (e) {
		throw new Error(
			`The argument predicate must be resilient to be invoked without parameters. Original error: ${e.message}`
		);
	}
	return typeof result === 'boolean';
};

export const isHigherOrderPredicate = (
	arg: TPredicate<any[]> | THigherOrderPredicate<any[], any[]>
): arg is THigherOrderPredicate<any[], any[]> => {
	if (typeof arg !== 'function') {
		return false;
	}
	let partiallyApplied;
	try {
		partiallyApplied = arg() as TPredicate<any[]>;
	} catch (e) {
		throw new Error(
			`The argument predicate must be resilient to be invoked without parameters. Original error: ${e.message}`
		);
	}

	return isPredicate(partiallyApplied);
};

// IMPLEMENTATION

/**
 * not() can
 * 1. flip a boolean (e.g.: not(true) -> false)
 * 2. invert the behaviour of a predicate (e.g.: not(isEven) -> isOdd)
 * 3. invert the behaviour of a higher-order function that produces a predicate (e.g.: not(is)(5) -> isNot(5))
 */
export function not(value: boolean): boolean;
export function not<T extends any[]>(f: TPredicate<T>): TPredicate<T>;
export function not<U extends any[], T extends any[]>(
	f: THigherOrderPredicate<U, T>
): THigherOrderPredicate<U, T>;
export function not<T extends any[], U extends any[]>(arg: TNotArg): TNotArg {
	if (typeof arg === 'boolean') {
		return !arg;
	}
	if (typeof arg === 'function') {
		if (isPredicate(arg)) {
			return (...args: T) => !arg(...args);
		}

		if (isHigherOrderPredicate(arg)) {
			return (...higherOrderArgs: U) => not(arg(...higherOrderArgs));
		}

		throw new Error(
			`Argument Error: The argument must be a boolean, a predicate or a higher-order predicate`
		);
	}
}

// and() & or() utils

const isBooleanArray = (value: any[]): value is boolean[] => value.every((item) => typeof item === 'boolean');
const isPredicateArray = (value: any[]): value is TPredicate<any[]>[] =>
	value.every((item) => typeof item === 'function');

const iterate =
	(method: TIterateMethod) =>
	(...args: TBooleanOrPredicateArray): TBooleanOrPredicate => {
		if (isBooleanArray(args)) {
			return method.call(args, Boolean);
		}
		if (isPredicateArray(args)) {
			return (...predicatesArgs: any[]) =>
				method.call(args, (f: TPredicate<any[]>) => f(...predicatesArgs));
		}
	};

/**
 * and() can:
 * 1. asserts the truth of all elements in an array of booleans (e.g.: and(true, false) -> false)
 * 2. construct a composite functions out of a list of predicates with the same signature (arity and types)
 *    where all predicates must succeed (e.g.: and(isPositive, isEven) -> isPositiveAndEven)
 */
export function and(...args: boolean[]): boolean;
export function and<T extends any[]>(...args: TPredicate<T>[]): TPredicate<T>;
export function and<T extends any[]>(...args: TBooleanOrPredicateArray): boolean | TPredicate<T> {
	return iterate(Array.prototype.every)(...args);
}

/**
 * or() can:
 * 1. asserts the truth of at least one element in an array of booleans (e.g.: and(true, false) -> true)
 * 2. construct a composite functions out of a list of predicates with the same signature (arity and types)
 *    where at least one predicate must succeed (e.g.: or(isPositive, isEven) -> isPositiveOrEven))
 */
export function or(...args: boolean[]): boolean;
export function or<T extends any[]>(...args: TPredicate<T>[]): TPredicate<T>;
export function or<T extends any[]>(...args: TBooleanOrPredicateArray): boolean | TPredicate<T> {
	return iterate(Array.prototype.some)(...args);
}
