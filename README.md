<img src="./assets/logo.png" alt="" width="200" /><br>
<p><img src="https://github.com/oaxoa/fp-booleans/actions/workflows/build.yml/badge.svg" alt="" /></p>

# fp-booleans

A collection of utility functions to apply boolean logic on **functions** (including higher-order):

1. not
2. and
3. or

Written (and can be used) in a functional programming style.

_fp-booleans_ functions are:

1. pure
2. tiny
3. zero-dependencies
5. tree-shakeable
6. 100% tested by design

### Why

Being able to combine or negate booleans, boolean predicate functions and higher-order functions means lots of
💪 power.<br>
With a flexible yet simple API and TS annotations this can be easy too.

## Examples

### not()

Imagine we want to 🟢 pass or 🔴 fail a level in a game based on the score being greater than 100:

```js
const greaterThan100 = (n: number) => n > 100;
const pass = greaterThan100(score);
// we could use `not` to just reverse the boolean value or 
// expression (equivalent to !)
const fail = not(greaterThan100(score));
// ...or reverse the function (boolean predicate) and get 
// a function with the same signature but opposite logic
const fail = not(greaterThan100)(score)
// or
const notGreaterThan100 = not(greaterThan100);
const fail = notGreaterThan100(score);
```

we could also have a higher-order function that accepts the comparison value and returns a boolean predicate:

```js
const greaterThan = (comparison: any) => (arg: any) => arg > comparison;
// It could be used with several levels of partial application:
const pass = greaterThan(100)(score)

// we could reverse the higher-order function:
const fail = not(greaterThan)(100)(score);
// or the partially-applied boolean predicate
const fail = not(greaterThan(100))(score);
// or just the boolean value
const fail = not(greaterThan(100)(score))
```

Being able to move parenthesis around is not for the sake of 🤹 juggling code.
This flexibility allows to have the complexity in one single function, _partially apply_ it in different ways and
then
applying boolean operations on the partially-applied function without the need of writing several similar
functions.<br><br>
Imagine if instead than a simple `score > 100` logic in our examples we had a complex function&hellip; Negating it or
combining it could require writing several slightly different versions of the logic.

## Negate or combine functions

_fp-booleans_ functions can be combined to unleash infinite 🚀 power:

```js
not(is(5));
and(gte(MIN_PRICE), not(isRound));
or(is('admin'), and(startsWith('user_'), isLowerCase));
```

## Used in filters

Can be used in filters:

```js
array.filter(not(is(5)));
array.filter(and(gte(MIN_PRICE), not(isRound)));
array.filter(or(is('admin'), and(startsWith('user_'), isLowerCase)));
```

<img src="https://github.com/Oaxoa/fp-filters/raw/master/assets/logo.png" alt="" width="50" /> 

_fp-booleans_ is a core part of [fp-filters](https://github.com/Oaxoa/fp-booleans).

## Complex combinations

```js
const complexCombination = not(or(and(gt(10), isEven), or(within(0, 5), isEven)));
complexCombination(3) // true
complexCombination(-2) // false
```

### Getting started

#### Installation

_fp-booleans_ runs on Node.js and is available as a NPM package.

```bash
npm install --save fp-booleans
```

or

```bash
yarn add fp-booleans
```

## Contributions

Looking forward for some help.

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2023-present, Pierluigi Pesenti (Oaxoa)