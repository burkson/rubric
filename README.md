# Rubric

Easy-to-use and simple-to-read object validation library.

- <a href="#quick-start">Quick Start</a>
- <a href="#methods">Methods</a>
    - <a href="#rubric.test">rubric.test(ruleset, object)</a>
    - <a href="#rubric.test.rule">rubric.test.rule(rule, value)</a>
    - <a href="#rubric.breakdown">rubric.breakdown(ruleset, object)</a>
- <a href="#tests">Tests</a>
    - <a href="#tests.number">Number</a>
    - <a href="#tests.integer">Integer</a>
    - <a href="#tests.float">Float</a>
    - <a href="#tests.string">String</a>
    - <a href="#tests.array">Array</a>
    - <a href="#tests.object">Object</a>
    - <a href="#tests.function">Function</a>
    - <a href="#tests.misc">Misc</a>

<h2 id="quick-start">Quick Start</h2>

Install using npm:

```
> npm install rubric
```

Or, download the source file [__rubric.js__](https://raw.githubusercontent.com/jinger89/rubric/master/rubric.js) listed above.

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

if (!rubric.test(userRuleSet, userData))
    throw new Error('userData is invalid!');
```

<h2 id="methods">Methods</h2>

<h3 id="rubric.test">rubric.test(ruleset, object)</h3>

Test a ruleset against an object.

<h3 id="rubric.test.rule">rubric.test.rule(rule, value)</h3>

Test a single rule against a value.

<h3 id="rubric.breakdown">rubric.breakdown(ruleset, object)</h3>

Test a ruleset against an object and return an object that outlines which parameters are valid and invaid.

<h2 id="tests">Tests</h2>

Tests that are included as part of the library. Remember, you can always write your own tests in the form of functions or regular expressions.

<h2 id="tests.number">Number</h2>

### rubric.num

### rubric.num.range(min, max)

### rubric.num.greaterThan(num)

### rubric.num.lessThan(num)

### rubric.num.min(num)

### rubric.num.max(num)

### rubric.num.positive

### rubric.num.negative

<h2 id="tests.integer">Integer</h2>

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

<h2 id="tests.float">Float</h2>

### rubric.float

### rubric.float.precision

### rubric.float.range(min, max)

### rubric.float.greaterThan(num)

### rubric.float.lessThan(num)

### rubric.float.min(num)

### rubric.float.max(num)

### rubric.float.positive

### rubric.float.negative

<h2 id="tests.string">String</h2>

### rubric.str

### rubric.str.contains(str, flags)

### rubric.str.startsWith(str)

### rubric.str.endsWith(str)

### rubric.str.sizeOf(num)

### rubric.str.range(min, max)

### rubric.str.min(num)

### rubric.str.max(num)

<h2 id="tests.array">Array</h2>

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

<h2 id="tests.object">Object</h2>

### rubric.obj

### rubric.obj.instanceof(object)

### rubric.obj.hasProperty(str)

<h2 id="tests.function">Function</h2>

### rubric.fn

### rubric.fn.args(num)

<h2 id="tests.misc">Misc</h2>

### rubric.bool

### rubric.null

### rubric.undefined

### rubric.truthy

### rubric.falsy
