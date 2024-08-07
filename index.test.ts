import { not, and, or } from './index.js';

//some example functions to play around with
const gt = (comparison: number) => (n: number) => n > comparison;
const within = (leftBound: number, rightBound: number) => (n: number) => gt(leftBound)(n) && n < rightBound;
const isEven = (n: number) => n % 2 === 0;
const is =
	<T>(c: T) =>
	(n: T) =>
		c === n;
const someNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

describe('fp-booleans', () => {
	describe('not()', () => {
		it.each([
			{ value: true, expected: false },
			{ value: false, expected: true },
			{ value: 1 > 2, expected: true },
			{ value: 2 > 1, expected: false },
		])('boolean (or a boolean expression)', ({ value, expected }) => {
			expect(not(value)).toBe(expected);
		});
		it.each([
			{ predicate: is(5), arg: 5, expected: false },
			{ predicate: is(5), arg: 6, expected: true },
		])('boolean predicate', ({ predicate, arg, expected }) => {
			expect(not(predicate)(arg)).toBe(expected);
		});
		it.each([
			{ higherOrderFunction: is, curryArg: 5, arg: 5, expected: false },
			{ higherOrderFunction: is, curryArg: 5, arg: 6, expected: true },
		])(
			'higher-order function that returns a boolean predicate',
			({ higherOrderFunction, curryArg, arg, expected }) => {
				const negatedHigherOrderFunction = not(higherOrderFunction);
				const appliedNegatedHigherOrderFunction = negatedHigherOrderFunction(curryArg);
				expect(appliedNegatedHigherOrderFunction(arg)).toBe(expected);
			}
		);
		it.each([
			{ higherOrderFunction: within, left: 5, right: 10, arg: 6, expected: false },
			{
				higherOrderFunction: within,
				left: 5,
				right: 10,
				arg: 2,
				expected: true,
			},
		])('higher-order function of any arity', ({ higherOrderFunction, left, right, arg, expected }) => {
			const negatedHigherOrderFunction = not(higherOrderFunction);
			const appliedNegatedHigherOrderFunction = negatedHigherOrderFunction(left, right);
			expect(appliedNegatedHigherOrderFunction(arg)).toBe(expected);
		});

		const upTo5 = [1, 2, 3, 4, 5];

		it.each([{ input: someNumbers, expected: upTo5 }])('inside a filter', ({ input, expected }) => {
			expect(input.filter(not(gt(5)))).toEqual(expected);
			expect(input.filter(not(gt)(5))).toEqual(expected);
		});
	});

	describe('and()', () => {
		it.each([
			{ values: [true], expected: true },
			{ values: [true, true], expected: true },
			{ values: [false], expected: false },
			{ values: [false, true], expected: false },
			{ values: [false, false], expected: false },
			{ values: [2 > 1], expected: true },
			{ values: [1 > 2], expected: false },
			{ values: [1 > 2, 2 > 1], expected: false },
		])('boolean (or a boolean expression)', ({ values, expected }) => {
			expect(and(...values)).toBe(expected);
		});
		it.each([
			{ predicates: [gt(0), isEven], arg: 2, expected: true },
			{ predicates: [gt(0), not(isEven)], arg: 2, expected: false },
			{ predicates: [gt(4), isEven], arg: 2, expected: false },
		])('boolean predicate', ({ predicates, arg, expected }) => {
			expect(and(...predicates)(arg)).toBe(expected);
		});
		it.each([{ input: someNumbers, expected: [6, 8] }])(
			'combines more than one filter where all must be true',
			({ input, expected }) => {
				// @ts-ignore
				expect(input.filter(and(isEven, gt(5)))).toEqual(expected);
			}
		);
	});

	describe('or()', () => {
		it.each([
			{ values: [true], expected: true },
			{ values: [true, true], expected: true },
			{ values: [false], expected: false },
			{ values: [true, false, false], expected: true },
			{ values: [false, false], expected: false },
			{ values: [2 > 1], expected: true },
			{ values: [1 > 2], expected: false },
			{ values: [1 > 2, 2 > 1], expected: true },
		])('boolean (or a boolean expression)', ({ values, expected }) => {
			expect(or(...values)).toBe(expected);
		});
		it.each([
			{ predicates: [gt(0), isEven], arg: 2, expected: true },
			{ predicates: [gt(4), isEven], arg: 2, expected: true },
			{ predicates: [gt(0), isEven], arg: 3, expected: true },
			{ predicates: [gt(0), isEven], arg: -2, expected: true },
			{ predicates: [gt(0), isEven], arg: -1, expected: false },
		])('boolean predicate', ({ predicates, arg, expected }) => {
			expect(or(...predicates)(arg)).toBe(expected);
		});
		it.each([{ input: someNumbers, expected: [2, 4, 6, 7, 8, 9] }])(
			'combines more than one filter where all must be true',
			({ input, expected }) => {
				// @ts-ignore
				expect(input.filter(or(isEven, gt(5)))).toEqual(expected);
			}
		);
	});

	describe('complex combinations', () => {
		const complex1 = or(and(gt(10), isEven), or(within(0, 5), isEven));
		it.each([
			{ f: complex1, arg: 12, expected: true },
			{ f: not(complex1), arg: 12, expected: false },
			{ f: complex1, arg: 3, expected: true },
			{ f: not(complex1), arg: 3, expected: false },
			{ f: complex1, arg: -1, expected: false },
			{ f: not(complex1), arg: -1, expected: true },
			{ f: complex1, arg: 13, expected: false },
			{ f: not(complex1), arg: 13, expected: true },
			{ f: complex1, arg: -2, expected: true },
			{ f: not(complex1), arg: -2, expected: false },
		])('combine all the functions', ({ f, arg, expected }) => {
			expect(f(arg)).toBe(expected);
		});
	});
});
