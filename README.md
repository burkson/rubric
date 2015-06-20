# Rubric

Easy-to-use and simple-to-read object validation library.

## Quick Start

Install using npm:

```
> npm install rubric
```

Or, download the source file `rubric.js` listed above.

Set up your first ruleset and test.

```
var userRuleSet = {
    name: {
        first: rubric.str.max(50),
        last: rubric.str.max(50)
    },
    age: [ rubric.optional, rubric.num.range(0, 100) ],
    password: rubric.str.min(6),
    newsletter: rubric.bool
};

if (rubric.test(userRuleSet, userData) === false)
    throw new Error('userData is invalid!');
```

## Methods

### rubric.test(ruleset, object)

Test a ruleset against an object.

### rubric.test.rule(rule, value)

Test a single rule against a value.

### rubric.breakdown(ruleset, object)

Test a ruleset against an object and return an object that outlines which parameters are valid and invaid.

## Tests

Tests that are included as part of the library. Remember, you can always write your own tests in the form of functions or regular expressions.

## Numbers

### rubric.num

### rubric.num.range(min, max)

### rubric.num.greaterThan(num)

### rubric.num.lessThan(num)

### rubric.num.min(num)

### rubric.num.max(num)

### rubric.num.positive

### rubric.num.negative

## Integers

### rubric.int

### rubric.int.range(min, max)

### rubric.int.greaterThan(num)

### rubric.int.lessThan(num)

### rubric.int.min(num)

### rubric.int.max(num)

### rubric.int.even

### rubric.int.odd

### rubric.int.positive

### rubric.int.negative

## Float

### rubric.float

### rubric.float.precision

### rubric.float.range(min, max)

### rubric.float.greaterThan(num)

### rubric.float.lessThan(num)

### rubric.float.min(num)

### rubric.float.max(num)

### rubric.float.positive

### rubric.float.negative

## String

### rubric.str

### rubric.str.contains(str, flags)

### rubric.str.startsWith(str)

### rubric.str.endsWith(str)

### rubric.str.sizeOf(num)

### rubric.str.range(min, max)

### rubric.str.min(num)

### rubric.str.max(num)

## Array

### rubric.arr

### rubric.arr.contains(element)

### rubric.arr.containsAll(element, ...)

### rubric.arr.containsAny(element, ...)

### rubric.arr.containsNone(element, ...)

### rubric.arr.startsWith(element, ...)

### rubric.arr.endsWith(element, ...)

### rubric.arr.sizeOf(num)

### rubric.arr.range(min, max)

### rubric.arr.min(num)

### rubric.arr.max(num)

## Object

### rubric.obj

### rubric.obj.instanceof(object)

### rubric.obj.hasProperty(str)

## Function

### rubric.fn

### rubric.fn.args(num)

## Misc

### rubric.bool

### rubric.null

### rubric.undefined

### rubric.truthy

### rubric.falsy
