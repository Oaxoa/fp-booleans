// TYPES

export type TBooleanPredicate<T extends any[]> = (...params: T) => boolean;
export type THigherOrderBooleanPredicate<U extends any[], T extends any[]> = (
	...params: U
) => TBooleanPredicate<T>;

type TBooleanOrBooleanPredicate = boolean | TBooleanPredicate<any[]>;
type TNotArg = TBooleanOrBooleanPredicate | THigherOrderBooleanPredicate<any[], any[]>;
type TBooleanOrBooleanPredicateArray = TBooleanOrBooleanPredicate[];

type TIterateMethod = typeof Array.prototype.every | typeof Array.prototype.some;

// UTILS

const isTBooleanPredicate = (
	arg: TBooleanPredicate<any[]> | THigherOrderBooleanPredicate<any[], any[]>
): arg is TBooleanPredicate<any[]> => typeof arg() === 'boolean';

// IMPLEMENTATION

/**
 * not() can
 * 1. flip a boolean (e.g.: not(true) -> false)
 * 2. invert the behaviour of a boolean predicate (e.g.: not(isEven) -> isOdd)
 * 3. invert the behaviour of a higher-order function that produces a boolean predicate (e.g.: not(is)(5) -> isNot(5))
 */
export function not(value: boolean): boolean;
export function not<T extends any[]>(f: TBooleanPredicate<T>): TBooleanPredicate<T>;
export function not<U extends any[], T extends any[]>(
	f: THigherOrderBooleanPredicate<U, T>
): THigherOrderBooleanPredicate<U, T>;
export function not<T extends any[]>(arg: TNotArg): TNotArg {
	if (typeof arg === 'boolean') {
		return !arg;
	}
	if (typeof arg === 'function') {
		if (isTBooleanPredicate(arg)) {
			return (...args: T) => !arg(...args);
		}
		return (...higherOrderArgs: any[]) => not(arg(...higherOrderArgs));
	}
}

// and() & or() utils

const isBooleanArray = (value: any[]): value is boolean[] => value.every((item) => typeof item === 'boolean');
const isPredicatesArray = (value: any[]): value is TBooleanPredicate<any[]>[] =>
	value.every((item) => typeof item === 'function');

const iterate =
	(method: TIterateMethod) =>
	(...args: TBooleanOrBooleanPredicateArray): TBooleanOrBooleanPredicate => {
		if (isBooleanArray(args)) {
			return method.call(args, Boolean);
		}
		if (isPredicatesArray(args)) {
			return (...predicatesArgs: any[]) =>
				method.call(args, (f: TBooleanPredicate<any[]>) => f(...predicatesArgs));
		}
	};

/**
 * and() can:
 * 1. assert the truthiness of all elements in an array of booleans (e.g.: and(true, false) -> false)
 * 2. construct a composite functions out of a list of boolean predicates with the same signature (arity and types)
 *    where all predicates must succeed (e.g.: and(isPositive, isEven) -> isPositiveAndEven)
 */
export function and(...args: boolean[]): boolean;
export function and<T extends any[]>(...args: TBooleanPredicate<T>[]): TBooleanPredicate<T>;
export function and<T extends any[]>(
	...args: TBooleanOrBooleanPredicateArray
): boolean | TBooleanPredicate<T> {
	return iterate(Array.prototype.every)(...args);
}

/**
 * or() can:
 * 1. assert the truthiness of at least one element in an array of booleans (e.g.: and(true, false) -> true)
 * 2. construct a composite functions out of a list of boolean predicates with the same signature (arity and types)
 *    where at least one predicate must succeed (e.g.: or(isPositive, isEven) -> isPositiveOrEven))
 */
export function or(...args: boolean[]): boolean;
export function or<T extends any[]>(...args: TBooleanPredicate<T>[]): TBooleanPredicate<T>;
export function or<T extends any[]>(
	...args: TBooleanOrBooleanPredicateArray
): boolean | TBooleanPredicate<T> {
	return iterate(Array.prototype.some)(...args);
}
