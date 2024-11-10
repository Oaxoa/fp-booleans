/* eslint-disable @typescript-eslint/no-unused-vars */

import { not, and, or } from './index.js';

/* SOME EXAMPLE FUNCTIONS */

// Predicates
const isPositive = (n: number) => n > 0;
const isEven = (n: number) => n % 2 === 0;
const isEmptyString = (arg: string) => arg === '';

// Higher order functions
const is =
	<T>(comparison: T) =>
	(arg: T) =>
		arg === comparison;

/* SAMPLES */

/* not() */

// on a boolean
const resultNotOnBoolean = not(true);

// on a predicate
const isNotPositive = not(isPositive);
const resultNotOnPredicate = isNotPositive(-1);

// on a predicate that comes from a partially-applied HoF
const isFive = is(5);
const isNotFive_onAPredicate = not(isFive);
const resultNotOnPartiallyAppliedHoF = isNotFive_onAPredicate(4);

// on a higher order function that returns a predicate
const isNot = not(is);
const isNotFive_onAHigherOrderFunction = isNot(5);
const resultNotOnHoF = isNotFive_onAHigherOrderFunction(4);

/* and() */

// on booleans
const resultAndOnBooleans = and(true, 1 > 0);
// on predicates
const isEvenAndPositive = and(isEven, isPositive);
const resultAndOnPredicates = isEvenAndPositive(4);
// when the arity or the types of the functions that we want to combine are different, it should produce a TS error
// const isEvenAndEmptyString = and(isEven, isEmptyString); // <- TS Error

/* or() */

// on booleans
const resultOrOnBooleans = or(true, 1 < 0);
// on predicates
const isEvenOrPositive = or(isEven, isPositive);
const resultOrOnPredicates = isEvenOrPositive(3);
// when the arity or the types of the functions that we want to combine are different, it should produce a TS error
// const isEvenOrEmptyString = or(isEven, isEmptyString); // <- TS Error
