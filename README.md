# Rubric

## Getting Started

Install the module:
```
npm install rubric
```

Setup your object to test against.

```
var legend = {
    color: /red|green|blue/i,
    size: rubric.withinRange(1, 10)
};
```

Create a rubric object:

```
var myRubric = rubric(legend);
myRubric.test({ ... });
```

OR go straight to testing:

```
rubric.test(legend, { ... });
```

## Testing

Test an object against a rubric to determine whether or not the object is valid. Only returns true if all given values are valid, and false if any fail.

```
rubric.test({
    size: rubric.withinRange(1, 10)
}, {
    size: 20
});
```
```
false
```
*Returns false because size is out of the predefined range.*

## Scoring

Objects can also be scored against a rubric, so you can see how many keys failed or passed. Returns an array containing the score achieved (index 0), and total possible score (index 1).

```
rubric.test({
    color: /red|green|blue/i,
    size: rubric.withinRange(1, 10)
}, {
    color: 'orange',
    size: 5
});
```
```
[1,2]
```

*Returns [1, 2], because color is not a valid option, therefore losing 1 point from the total possible of 2.*

## Breakdown

Get a breakdown of test results and scores to see each individual property's evaluation. This can be useful to figure out why an object failed or scored a certain way.

### Testing Breakdown
```
rubric.test.breakdown({
    color: /red|green|blue/i,
    size: rubric.withinRange(1, 10),
    comments: /*/
}, {
    color: 'red',
    size: 5
});
```
```
{
    color: true,
    size: true,
    comments: false
}
```

### Scoring Breakdown
```
rubric.score.breakdown({
    color: /red|green|blue/i,
    size: rubric.withinRange(1, 10),
    comments: /*/
}, {
    color: 'red',
    size: 5
});
```
```
{
    color: 1,
    size: 1,
    comments: 0
}
```


---


## Keys

### :optional

All keys are required by default. If a key is optional, add the ":optional" tag to the end of the key and it will not be counted as wrong if the either the key is not there or the value is undefined.

### :score(n)

All keys are worth 1 point by default. Set a different score value using the ":score(n)" tag, where "n" is an number. "intval" will be used to parse the number, any non-numbers will result in NaN being returned for both score and total.

Optional key scores are counted toward the total. If a key is missing or the value is valid, the points are given. If the key is set and the value is invalid, no points are given.


---


## Values

### Strings, Numbers, Booleans, Undefined, Null

These rubric value types will be treated literally. Meaning the tested value must match the rubric value exactly. This is probably not too useful.

### Regular Expression

Regular expressions will be used to test the given value. All non-string values will attempted to be converted to strings before testing.

```
{
    'color': /red|blue|green/i
}
```

### Functions

Functions will be given the current value as the first argument. Expected return values of true or false. Anything else besides true will be interpreted as false.

```
{
    'color': function (value) {
        if (['red', 'blue', 'green'].indexOf(value) > -1)
            return true;

        return false;
    }
}
```

### Plain Objects

Values that are objects or other rubrics will be treated as another rubric, meaning you can nest rubrics to test multi-level objects.

```
{
    'color': {
        'value': rubric.containsAny('red', 'blue', 'green')
    }
}

{
    'color': rubric({
        'value': rubric.containsAny('red', 'blue', 'green')
    })
}
```

Objects that are not plain or not rubrics should not be used. Resulting behavior is unpredictable.

### Arrays

An array can be used in 2 different ways. One, if the given value is an array, test every element in the array against every element in the test array, Two, for any other value type, test that value against every element in the test array. Only 1 test in in the test array needs to pass.

```
{
    'color': [
        rubric.options('red', 'blue', 'green')
    ]
}
```

---

## Built In Functions

### For Number
```
rubric.withinRange(min, max)
rubric.greaterThan(num)
rubric.greaterThanOrEqual(num)
rubric.lessThan(num)
rubric.lessThanOrEqual(num)
```

### For Strings and Arrays
```
rubric.contains(str|any)
rubric.containsAll(n1, n2, ..)  // arrays only
rubric.containsAny(n1, n2, ..)  // arrays only
rubric.containsNone(n1, n2, ..) // arrays only
rubric.startsWith(str|any)
rubric.endsWith(str|any)
rubric.length(num)
rubric.lengthRange(min, max)
```

### For Objects
```
rubric.instanceof(object)
rubric.typeof(type)
rubric.hasProperty(key)
```
