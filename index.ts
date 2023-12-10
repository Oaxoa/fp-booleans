export type TBooleanPredicate = (...params: any[]) => boolean;
export type THigherOrderBooleanPredicate = (...params: any[]) => TBooleanPredicate;
type TNotArg = boolean | TBooleanPredicate | THigherOrderBooleanPredicate;

const isTBooleanPredicate = (
	arg: TBooleanPredicate | THigherOrderBooleanPredicate
): arg is TBooleanPredicate => typeof arg(0) === 'boolean';

export function not(value: boolean): boolean;
export function not(f: TBooleanPredicate): TBooleanPredicate;
export function not(f: THigherOrderBooleanPredicate): THigherOrderBooleanPredicate;
export function not(arg: TNotArg): TNotArg {
	if (typeof arg === 'function') {
		if (isTBooleanPredicate(arg)) {
			return (...args: any[]) => !arg(...args);
		}
		return (...higherOrderArgs: any[]) => not(arg(...higherOrderArgs));
	}
	return !arg;
}

type TMergeMethodType = typeof Array.prototype.every | typeof Array.prototype.some;
const merge =
	(method: TMergeMethodType) =>
	(...args: boolean[] | TBooleanPredicate[]): boolean | TBooleanPredicate => {
		if (typeof args[0] === 'function') {
			return (...predicatesArgs: any[]) =>
				method.call(args as TBooleanPredicate[], (f: TBooleanPredicate) =>
					f(...predicatesArgs)
				);
		}
		return method.call(args as boolean[], Boolean);
	};

export function and(...args: boolean[]): boolean;
export function and(...args: TBooleanPredicate[]): TBooleanPredicate;
export function and(...args: boolean[] | TBooleanPredicate[]): boolean | TBooleanPredicate {
	return merge(Array.prototype.every)(...args);
}

export function or(...args: boolean[]): boolean;
export function or(...args: TBooleanPredicate[]): TBooleanPredicate;
export function or(...args: boolean[] | TBooleanPredicate[]): boolean | TBooleanPredicate {
	return merge(Array.prototype.some)(...args);
}
