# Rubric

Simple variable type checking library.

<h2 id="getting-started">Quick Start</h2>

Install using npm:

```bash
npm install rubric
```

Or, download the source file [__rubric.js__](https://raw.githubusercontent.com/jinger89/rubric/master/rubric.js).

Setting up your first ruleset and test.

```javascript
var ruleset = {
    firstName: rubric.string().minLength(1),
    lastName: rubric.string().minLength(1),
    address: rubric.object().ruleset({
        street: rubric.string(),
        street2: rubric.string().optional(),
        city: rubric.string(),
        state: rubric.string().hasLength(2),
        zip: rubric.string().minLength(5)
    }),
    age: rubric.number.min(0).max(100),
    favoriteMovies: rubric.array().forEach(rubric.object().instanceOf(MovieObject))
};

if (rubric.test(ruleset, someData))
    console.log('Passed test!');
else
    console.log('Failed test...');
```

<h2 id="methods">Methods</h2>

<h3 id="rubric.test">rubric.test(ruleset, data)</h3>

Test a ruleset against some data. Both `ruleset` and `data` should be plain objects. Returns true if `data` passes the `ruleset` or false if it fails.

<h3 id="rubric.rules.test">rubric.[rules...].test(value)</h3>

Each Rubric rule has a `test` method that you can use to test an individual value. For example: `rubric.number().min(-100).max(100).test(200)` would return false.

<h3 id="rubric.report">rubric.report(ruleset, data)</h3>

Like `rubric.test`, both `ruleset` and `data` should be plain objects. Returns an object breaking down which properties and values passed/failed the ruleset.

```javascript
// Example return value
{
    firstName: true,
    lastName: true,
    address: {
        street: true,
        city: false, // false if the value failed to pass a rule
        state: false, // false if the value failed to pass a rule
        zip: true
    },
    age: true,
    favoriteMovies: true
}
```

<h2 id="rules-rulesets">Rules and Rulesets</h2>

Rules are individual tests, while rulesets are a collection of rules in the form of a plain object. Rules can be written using the many tests included in this library, or you can write you own in the form of functions, regular expressions, or any other values which will be compared literally (===).

```javascript
// Rule
rubric.array().contains('foo', 'bar');

// Ruleset
{
    firstName: rubric.string(),
    lastName: rubric.string(),
    nickName: rubric.string().optional()
}
```

### Functions as Tests

There are two ways to use functions as tests. The first way is to use the function by itself.

```javascript
{
    someProperty: function (val) {
        // write your custom test here
        // return true or false
    }
}
```

The second way is the chain the function into a Rubric test so you can use it with other tests.

```javascript
{
    someProperty: rubric.string().minLength(10).fn( function (str) {
        // write your custom test here
        // return true or false
    }).optional() // keep chaining on rules like normal
}
```

### Regular Expressions as Tests

You can do the same thing with regular expressions as you can with functions, use them directly or chain them with other Rubric tests.

```javascript
{
    someProperty: /[a-z]/g
}
```

Or...

```javascript
{
    someProperty: rubric.string().minLength(10).regexp(/[a-z]/g).optional()
}
```

<h2 id="tests">Tests</h2>

### Global Tests

- optional() -- value is optional, if value is given it will be tested
- fn(fn)
- regexp(regexp)

### rubric.string()

- minLength(min)
- maxLength(max)
- hasLength(len)
- startsWith(str)
- endsWith(str)
- contains(str)
- regexp(regexp)

### rubric.number()

- max(max) -- inclusive
- min(min) -- inclusive
- greaterThan(min)
- lessThan(max)
- even()
- odd()
- positive()
- negative()

### rubric.float()

- max(max) -- inclusive
- min(min) -- inclusive
- greaterThan(min)
- lessThan(max)
- positive()
- negative()

### rubric.array()

- minLength(min)
- maxLength(max)
- hasLength(len)
- contains(args, ...)
- containsAny(args, ...)
- forEach(rule) -- single rule, not ruleset

### rubric.object()

- instanceOf(obj)
- hasProperty(prop, ...)
- hasAnyProperty(prop, ...)
- ruleset(ruleset) -- full ruleset, use for nested objects

### rubric.boolean()

- true() -- literal, value === true
- false() -- literal, value === false

### rubric.function()

### rubric.truthy()

### rubric.falsy()

### rubric.null()

### rubric.undefined()