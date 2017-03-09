# Rubric

Simple variable type checking library.

- [Quick Start](#user-content-quick-start)
- [Rules and Rulesets](#user-content-rules-rulesets)
- [Methods](#user-content-methods)
    - [rubric](#user-content-rubric-root)
    - [rubric.string()](#user-content-rubric.string)
    - [rubric.number()](#user-content-rubric.number)
    - [rubric.array()](#user-content-rubric.array)
    - [rubric.object()](#user-content-rubric.object)
    - [rubric.boolean()](#user-content-rubric.boolean)
    - [rubric.date()](#user-content-rubric.date)
    - [rubric.function()](#user-content-rubric.function)
    - [rubric.truthy()](#user-content-rubric.truthy)
    - [rubric.falsy()](#user-content-rubric.falsy)
    - [rubric.null()](#user-content-rubric.null)
    - [rubric.undefined()](#user-content-rubric.undefined)

<h2 id="quick-started">Quick Start</h2>

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

<h2 id="methods">Methods</h2>

<h3 id="rubric-root">rubric</h3>

`test(ruleset, data)` Tests a ruleset against data, returns true or false

`[rules...].test(value)` Tests a single rule against a given value

`report(ruleset, data)` Tests a ruleset against data, returns an object explaining which property passed/failed

<h3 id="rubric-global">rubric.[ANY]()</h3>

These methods can be with any of the following types.

`optional()` sets value as optional, if value is given it will be tested

`fn(fn)` return boolean true if valid, all other return values will fail

`regexp(regexp)` given regular expression is used like `regexp.test(val)`

`is(str, ...)` tests if value is any of the given arguments

<h3 id="rubric.string">rubric.string()</h3>

`minLength(min)`

`maxLength(max)`

`hasLength(len)`

`startsWith(str)`

`endsWith(str)`

`contains(str)`

`regexp(regexp)`

<h3 id="rubric.number">rubric.number()</h3>

`max(max)` inclusive

`min(min)` inclusive

`greaterThan(min)`

`lessThan(max)`

`even()`

`odd()`

`positive()`

`negative()`

<h3 id="rubric.array">rubric.array()</h3>

`minLength(min)`

`maxLength(max)`

`hasLength(len)`

`contains(args, ...)`

`containsAny(args, ...)`

`forEach(rule)` single rule, not ruleset

<h3 id="rubric.object">rubric.object()</h3>

`instanceOf(obj)`

`hasProperty(prop, ...)`

`hasAnyProperty(prop, ...)`

`ruleset(ruleset)` full ruleset, use for nested objects

<h3 id="rubric.boolean">rubric.boolean()</h3>

`true()` literal, value === true

`false()` literal, value === false

<h3 id="rubric.date">rubric.date()</h3>

`before(date)`

`after(date)`

`year(year)` use full year, i.e. use 2017 not 17

`quarter(qtr)` 1 to 4

`month(month)` 0 to 12

`date(date)` 1 to 31

`weekDay(day)` 0 to 7, 0 is Sunday, 6 is Saturday

`hour(hr)` 0 to 23

`minute(min)` 0 to 59

`second(sec)` 0 to 59

<h3 id="rubric.function">rubric.function()</h3>

<h3 id="rubric.truthy">rubric.truthy()</h3>

<h3 id="rubric.falsy">rubric.falsy()</h3>

<h3 id="rubric.null">rubric.null()</h3>

<h3 id="rubric.undefined">rubric.undefined()</h3>