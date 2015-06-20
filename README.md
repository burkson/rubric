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

```bash
> npm install rubric
```

Or, download the source file [__rubric.js__](https://raw.githubusercontent.com/jinger89/rubric/master/rubric.js) listed above.

Set up your first ruleset and test.

```javascript
var userRuleset = {
    name: {
        first: rubric.str.range(1, 50),
        last: rubric.str.range(1, 50)
    },
    age: [ rubric.optional, rubric.int.range(0, 100) ],
    password: rubric.str.min(6),
    newsletter: rubric.bool
};

if (!rubric.test(userRuleset, userData))
    throw new Error('userData is invalid!');
```

<h2 id="methods">Methods</h2>

<h3 id="rubric.test">rubric.test(ruleset, object)</h3>

Test a ruleset against an object.

See quick start example.

<h3 id="rubric.test.rule">rubric.test.rule(rule, value)</h3>

Test a single rule against a value.

```javascript
rubric.test.rule(rubric.int.range(0, 100), 50); // true
rubric.test.rule(rubric.str.startsWith('foo'), 'hello world'); // false
```

<h3 id="rubric.breakdown">rubric.breakdown(ruleset, object)</h3>

Test a ruleset against an object and return an object that outlines which parameters are valid and invalid.

Using the quick start example ruleset we might expect to get something like this if we using `rubric.breakdown` on it.

```javascript
{
    name: {
        first: true,    // ok
        last: false     // not ok, string length not between 1 and 50
    },
    age: true,          // ok, either not provided or an integer between 0 and 100
    password: false,    // not ok, string length less than 6
    newsletter: true    // ok
}
```

<h3 id="rubric.iterate">rubric.iterate(rule)</h3>

Use this to test an array of values against a rule. This method checks to make sure the value is an array, and will fail if it is not.

```javascript
var ruleset = {
    orders: rubric.iterate([
        [
            rubric.int.range(100, 999),
            rubric.int.even
        ]
    ])
};

rubric.test(ruleset, { orders: [ 100, 200, 300 ] });    // true, all values are within range and even numbers
rubric.test(ruleset, { orders: [ 111, 200, 300 ] });    // false, there is an odd numbers
rubric.test(ruleset, { orders: [ 50 ] });               // false, there is a value not within range
rubric.test(ruleset, { orders: 100 });                  // false, not an array
```

<h2 id="tests">Tests</h2>

Tests that are included as part of the library. Remember, you can always write your own tests in the form of functions or regular expressions.

### Using Rubric Tests
```javascript
var ruleset = {

    // 'name' must be a string, length must be between 1 and 50
    name: rubric.str.range(1,50),

    // 'age' is optional, can be an integer between 0 and 100
    age: [
        rubric.int.range(0, 100),
        rubric.optional
    ],

    // 'email' must be a string that starts with 'foo' AND ends with 'com'
    email: [
        [
            rubric.str.startsWith('foo'),
            rubric.str.endsWith('com')
        ]
    ]
};
```

### Using Functions as Tests
```javascript
var ruleset = {
    age: function (value) {
        // write your own test here
        // must return boolean true if valid
        // all other return values treated as false
    }
};
```

### Using Regex as Tests
```javascript
var ruleset = {
    name: /[a-z\s\-]{1,50}/i,
    email: /^foo.*com$/i
};

```

<h2 id="tests.number">Number</h2>

### rubric.num

Check if value is numeric, which includes: integers, floats, and number strings. This is very loose, `rubric.int` and `rubric.float` should be used instead of this one whenever possible.

### rubric.num.range(min, max)

Must be numeric and within `min` and `max` range.

### rubric.num.greaterThan(num)

Must be numeric and greater than `num`.

### rubric.num.lessThan(num)

Must be numeric and less than `num`.

### rubric.num.min(num)

Must be numeric and no less than `num`.

### rubric.num.max(num)

Must be numeric and no greater than `num`.

### rubric.num.positive

Must be numeric and positive.

### rubric.num.negative

Must be numeric and negative.

<h2 id="tests.integer">Integer</h2>

### rubric.int

Check if value is an integer. Excludes floats and number strings. This is preferred over `rubric.num`.

### rubric.int.range(min, max)

### rubric.int.greaterThan(num)

### rubric.int.lessThan(num)

### rubric.int.min(num)

### rubric.int.max(num)

### rubric.int.even

Must be an integer and even.

### rubric.int.odd

Must be an integer and odd.

### rubric.int.positive

### rubric.int.negative

<h2 id="tests.float">Float</h2>

### rubric.float

Check if value is a float. Excludes integers and number strings. This is preferred over `rubric.num`.

### rubric.float.precision(num)

Must be a float and have decimal precision to `num` degree.

### rubric.float.range(min, max)

### rubric.float.greaterThan(num)

### rubric.float.lessThan(num)

### rubric.float.min(num)

### rubric.float.max(num)

### rubric.float.positive

### rubric.float.negative

<h2 id="tests.string">String</h2>

### rubric.str

Check if value is a string. This includes number strings.

### rubric.str.contains(str, flags)

Must be a string and contain `str` fragment. Case is sensitive by default, but you can set `flags` to `"i"` to make it case insensitive.

### rubric.str.startsWith(str)

Must be a string and start with `str` fragment. Case sensitive.

### rubric.str.endsWith(str)

Must be a string and end with `str` fragment. Case sensitive.

### rubric.str.sizeOf(num)

Must be a string and have length of `num`.

### rubric.str.range(min, max)

Must be a string and have length between `min` and `max`.

### rubric.str.min(num)

Must be a string and have length no less than `num`.

### rubric.str.max(num)

Must be a string and have length no more than `num`.

<h2 id="tests.array">Array</h2>

### rubric.arr

Check if value is an array.

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
