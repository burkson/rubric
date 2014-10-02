Rubric
===

```
var myRubric = {

    // "color" is required, worth 1 point, and can only be "red", "blue", or "green"
    "color": rubric.options("red", "blue", "green"),

    // "size" is optional, worth 1 point, must be >= 1 and <= 10
    "size:optional": rubric.range(1, 10),

    // "comments" is required, worth 2 points, can be anything
    "comments:score(2)": /*/
};

var okObj = {
    "color": "red",
    "comments": "this object will pass"
};

var badObj = {
    "color": "orange",
    "size": 20,
    "comments": "this object will fail"
};

rubric(myRubric, okObj);   // true
rubric(myRubric, badObj);  // false
rubric.score(myRubric, okObj);   // [4, 4] 4 points out of 4 possible
rubric.score(myRubric, badObj);  // [2, 4] 2 points out of 4 possible
```

## Keys

Keys must match exactly (===) for it to be counted. Meaning leading or trailing spaces, and capitalization errors will result in a mismatched key.

### :optional

All keys are required by default. If a key is optional, add the ":optional" tag to the end of the key and it will not be counted as wrong if the either the key is not there or the value is undefined.

### :score(n)

All keys are worth 1 point by default. Set a different score value using the ":score(n)" tag, where "n" is an number. "intval" will be used to parse the number, any non-numbers will fail hilariously.

Optional key scores are counted toward the total. If a key is missing, or the value is valid, a point is given. If the key is set and the value is invalid, no points are given.

## Values

Rubric values can be anything and will be interpreted differently depending on the value type.

### Strings, Numbers, Booleans, Undefined, Null

These rubric value types will be treated literally. Meaning the tested value must match the rubric value exactly (===). This is probably not too useful, but hey, you never know.

### Regular Expression

Regular expressions will be used to test the given value. All values will be converted to strings before testing. Meaning 1 will be "1" and undefined will be "undefined". Use carefully.

```
{
    "colors": /red|blue|green/i
}
```

### Functions

Functions will be given the current value as the first argument. Expected return values of true or false. Anything else besides true will be interpreted as false.

```
function (value) {
    // your test here
    // return true or false
}
```

### Objects

Values that are objects will be treated as another rubric, meaning you can nest rubrics to test multi-level objects.

```
{
    "name": "*",
    "options": {
        "color": rubric.options("red", "blue", "green")
    }
 }
 ```

### Arrays

Arrays should contain at least one rubric item. That item will be used as the rubric for all items in the given array to test. If more than one item is given in the rubric array, tested items only need to pass one test.

```
    {
        "shapes": [
            rubric.options("circle", "square", "triangle")
        ]
    }
```

### Wildcard

Wildcard test will accept any value. Use the regular expression to achieve this.

```
{
    "wildcard": /*/
}
```

---

## Built In Functions

Here are some built in functions you can use in place of writing your own custom functions.

```
rubric.options(n1, n2, ...)         // any, literal
rubric.range(min, max)              // number or array, inclusive
rubric.greaterThan(num)             // number
rubric.greaterThanOrEqual(num)      // number
rubric.lessThan(num)                // number
rubric.lessThanOrEqual(num)         // number
rubric.contains(n1, n2, ...)        // string or array, literal
rubric.startsWith(str)              // string
rubric.startsWith(n1, n2, ...)      // array, [n1, n2, ...]
rubric.endsWith(str)                // string
rubric.endsWith(n1, n2, ...)        // array, [..., n2, n1]
rubric.length(num)                  // string or array
rubric.lengthRange(min, max)        // string or array, inclusive
```
