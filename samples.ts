/* eslint-disable @typescript-eslint/no-unused-vars */

import {not, and, or} from './index.js';

// Boolean predicates
const isPositive = (n: number) => n > 0;
const isEven = (n: number) => n % 2 === 0;
const isEmptyString = (arg: string) => arg === '';

// Higher order functions
const is =
    <T>(comparison: T) =>
        (arg: T) =>
            arg === comparison;

// SAMPLES

// not()
//  on a boolean
const resultNotOnBoolean = not(true);

//  on a boolean predicate
const isNotPositive = not(isPositive);
const resultNotOnBooleanPredicate = isNotPositive(-1);

//  on a boolean predicate that comes from a partially-applied HoF
const isFive = is(5);
const isNotFive_onABooleanPredicate = not(isFive);
const resultNotOnPartiallyAppliedHoF = isNotFive_onABooleanPredicate(4);

//  on a higher order function that returns a boolean predicate
const isNot = not(is);
const isNotFive_onAHigherOrderFunction = isNot(5);
const resultNotOnHoF = isNotFive_onAHigherOrderFunction(4);

// and()
//  on booleans
const resultAndOnBooleans = and(true, 1 > 0);
// on boolean predicates
const isEvenAndPositive = and(isEven, isPositive);
const resultAndOnBooleanPredicates = isEvenAndPositive(4);
// when the arity or the types of the functions that we want to combine are different, it should produce a TS error
// const isEvenAndEmptyString = and(isEven, isEmptyString); // <- TS Error

// or()
//  on booleans
const resultOrOnBooleans = or(true, 1 < 0);
//  on boolean predicates
const isEvenOrPositive = or(isEven, isPositive);
const resultOrOnBooleanPredicates = isEvenOrPositive(3);
// when the arity or the types of the functions that we want to combine are different, it should produce a TS error
// const isEvenOrEmptyString = or(isEven, isEmptyString); // <- TS Error
