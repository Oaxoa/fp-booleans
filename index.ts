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

const isPredicate = (
	arg: TPredicate<any[]> | THigherOrderPredicate<any[], any[]>
): arg is TPredicate<any[]> => typeof arg() === 'boolean';

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
export function not<T extends any[]>(arg: TNotArg): TNotArg {
	if (typeof arg === 'boolean') {
		return !arg;
	}
	if (typeof arg === 'function') {
		if (isPredicate(arg)) {
			return (...args: T) => !arg(...args);
		}
		return (...higherOrderArgs: any[]) => not(arg(...higherOrderArgs));
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
 * 1. assert the truthiness of all elements in an array of booleans (e.g.: and(true, false) -> false)
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
 * 1. assert the truthiness of at least one element in an array of booleans (e.g.: and(true, false) -> true)
 * 2. construct a composite functions out of a list of predicates with the same signature (arity and types)
 *    where at least one predicate must succeed (e.g.: or(isPositive, isEven) -> isPositiveOrEven))
 */
export function or(...args: boolean[]): boolean;
export function or<T extends any[]>(...args: TPredicate<T>[]): TPredicate<T>;
export function or<T extends any[]>(...args: TBooleanOrPredicateArray): boolean | TPredicate<T> {
	return iterate(Array.prototype.some)(...args);
}
