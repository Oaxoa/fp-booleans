<img src="./assets/logo.png" alt="" width="200" /><br>
<p><img src="https://github.com/oaxoa/fp-booleans/actions/workflows/build.yml/badge.svg" alt="" /></p>

# fp-booleans

A collection of utility functions to apply boolean logic **on functions** (including higher-order).

Written (and can be used) in a functional programming style.

> _fp-booleans_ functions are:
>
> 1. Small
> 1. Pure
> 1. Zero-dependencies
> 1. Tree-shakeable
> 1. Fully tested by design

### Functions

1. `not()`
2. `and()`
3. `or()`

### Why

Being able to combine or negate booleans, predicate functions and higher-order predicate functions means lots of
💪 power.<br>
With a flexible yet simple API and TS annotations this can be easy too.

## Examples

### `not()`

Unary function: accepts boolean, predicate, higher-order predicate.

#### On predicates

We can use `not()` on a predicate function to "reverse" it and get
a function with the same signature but opposite logic

```js
const notGreaterThan100 = not(greaterThan100);
const fail = notGreaterThan100(score);
// same as
const fail = not(greaterThan100)(score)
```

#### On a higher order functions

The best part is we can also use it on a higher-order function that returns a predicate:

```js
const greaterThan = (comparison: number) => (arg: number) => arg > comparison;

// we now have several options:

// we could just reverse the boolean value
const fail = not(greaterThan(100)(score))
// or the predicate (which is a partially-applied HoF)
const fail = not(greaterThan(100))(score);
// or reverse the higher-order function itself
const fail = not(greaterThan)(100)(score);
```

> [!TIP]
> Being able to move parenthesis around is not for the sake of 🤹 juggling code.<br><br>
> This flexibility allows to have the complexity (and unit tests) in one single function, _partially apply_ it as much
> as needed and then applying boolean operations on the specialized function without the need of writing several similar
> functions (and testing them, as the partial application is declarative in nature).<br><br>Imagine if instead than a
> simple `score > 100` logic in our examples we had a
> complex function&hellip; <br>Negating it or combining it could require writing several slightly different versions
> of the logic (that should all be
> unit tested). With `not()` we can avoid this duplication.

#### On boolean values (or expressions)

This is the simplest use case:
Imagine we want to pass or fail a level in a game based on the score being greater than 100:

```js
const greaterThan100 = (n: number) => n > 100;
const pass = greaterThan100(score);
const fail = !pass;
```

The `!` only works on the boolean value (or equivalent expression), not on the function reference.

In this case we could use `not()` to just reverse the boolean value or expression.
(nothing fancy here, just equivalent to `!`)

```js
const fail = not(pass);
```

but `not()` can also be used as mapper:

```js
const flippedValues = [true, false].map(not); // [false, true]
```

```ts
const flippedValues = [true, false].map(not as (value: boolean) => boolean); // [false, true]
```

### `and()`

N-ary function.

Combining functions is a foundation of functional programming.

Imagine again some code where we are granting a special bonus score based on some logic:

```js
const isBonusScore = score => score % 2 === 0 && score > 0 && score <= 100;
```

This code, while still being simple, is hard to read, to test and maintain.
This kind of code tends to be infused with business logic and be rewritten with mild differences in several places.
Combining simpler functions would help almost not writing code and ease readability using a declarative syntax.

The first step would be to isolate the logic into simpler functions:

```js
const isEven = n => n % 2 === 0;
const isGreaterThan = compare => n => n > compare;
const isBetween = (min, max) => isGreaterThan(min) && not(isGreaterThan(max));
```

> [!NOTE]
> This is a one-time job (or no job at all if you already have them or use some external package) and once tested these
> functions are going to be
> bullet-proof.

With these _utils_ in place, we could create one function that combines expressions (booleans) with the `&&` operator,
but it would require to
have a function signature, invoke all functions, and passing the same parameter and would look like:

```js
const isBonusScore = score => isEven(score) && isBetween(0, 100)(score);
```

Instead, we could just `and()` (combine the function references) and go point-free.

```js
const isBonusScore = and(isEven, isBetween(0, 100));
isBonusScore(50); // true
```

See how combining functions references is more compact than combining expressions in a function?

### `or()`

What just described about the `and()` function applies to `or()`. E.g.:

```js
const isValid = or(isNegative, isGreaterThan(100));
```

## All together

_fp-booleans_ functions can be all combined to unleash infinite 🚀 power:

```js
not(is(5));
not(is)(5);
and(greaterThanOrEqual(MIN_PRICE), not(isRound));
or(is('admin'), and(startsWith('user_'), isLowerCase));
```

## Used in filters

Can be used in filters:

```js
array.filter(not(is(5)));
array.filter(and(
    greaterThanOrEqual(MIN_PRICE),
    not(isRound))
);
array.filter(or(
        is('admin'),
        and(
            startsWith('user_'),
            isLowerCase)
    )
);
```

> [!TIP]
> <img src="https://github.com/Oaxoa/fp-filters/raw/master/assets/logo.png" alt="" width="50" />
> _fp-booleans_ is used at the core of [fp-filters](https://github.com/Oaxoa/fp-filters), a curated list of filter
> functions. Check it, and you may never have to write another filter function 🚀!

### Additional Exports

Two more utils functions are exported:

1. `isPredicate`
1. `isHigherOrderPredicate`

#### Examples

```ts
isPredicate(someFunction);
isHigherOrderPredicate(someFunction);
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

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2023-present, Pierluigi Pesenti