function ro (rules) {
    this.rules = rules;
}

ro.prototype.test = function (object) {
    return r.test(this.rules, object);
};

ro.prototype.breakdown = function (object) {
    return r.breakdown(this.rules, object);
};

function r (rules) {
    return new ro(rules);
}

r.test = function (rules, obj) {
    if (obj === null || typeof obj != 'object')
        return false;

    for (var param in rules) {
        var rule = rules[param];
        var value = obj[param];

        if (testRule(rule, value) !== true)
            return false;
    }

    return true;
};

r.breakdown = function (rules, obj) {
    var result = {};

    if (obj === null || typeof obj != 'object')
        return false;

    for (var param in rules) {
        var rule = rules[param];
        var value = obj[param];

        if (rule instanceof ro) {
            result[param] = rule.breakdown(value);
        } else if (typeof rule == 'object' && rule !== null && !(rule instanceof Array)) {
            result[param] = r.breakdown(rule, value);
        } else {
            result[param] = testRule(rule, value);
        }
    }

    return result;
};

// Optional flag
r.optional = 'RUBRIC.OPTIONAL';
r.opt = r.optional;

// Iterate
r.iterate = function (rule) {
    return function (value) {
        if (!(value instanceof Array))
            return false;

        for (var i = 0; i < value.length; i++)
            if (testRule(rule, value[i]) !== true)
                return false;

        return true;
    }
};

// Type
r.is = {
    number: function (value) {
        return typeof value == 'number' || !isNaN(value);
    },
    num: function (value) {
        return r.is.number(value);
    },
    integer: function (value) {
        return Number(value) === value && value % 1 === 0;
    },
    int: function (value) {
        return r.is.integer(value);
    },
    float: function (value) {
        return value === Number(value) && value % 1 !== 0;
    },
    string: function (value) {
        return typeof value == 'string';
    },
    str: function (value) {
        return r.is.string(value);
    },
    array: function (value) {
        return value instanceof Array;
    },
    arr: function (value) {
        return r.is.array(value);
    },
    boolean: function (value) {
        return typeof value == 'boolean';
    },
    bool: function (value) {
        return r.is.boolean(value);
    },
    null: function (value) {
        return value === null;
    },
    object: function (value) {
        return typeof value == 'object' && value !== null && !(value instanceof Array);
    },
    obj: function (value) {
        return r.is.object(value);
    }
};

// Number
r.num = {
    withinRange: function (min, max) {
        return function (value) {
            return value >= min && value <= max;
        }
    },
    range: function (min, max) {
        return function (value) {
            return value >= min && value <= max;
        }
    },
    equalTo: function (num) {
        return function (value) {
            return value == num;
        }
    },
    greaterThan: function (num) {
        return function (value) {
            return value > num;
        }
    },
    lessThan: function (num) {
        return function (value) {
            return value < num;
        }
    }
};

// String
r.str = {
    contains: function (str, flags) {
        var regex = new RegExp(
            str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),
            flags || 'g'
        );

        return function (value) {
            return regex.test(value);
        }
    },
    startsWith: function (str) {
        return function (value) {
            return value.substr(0, str.length) === str;
        }
    },
    endsWith: function (str) {
        return function (value) {
            return value.substr(value.length - str.length) === str;
        }
    },
    length: function (num) {
        return function (value) {
            return value.length == num;
        }
    },
    lengthRange: function (min, max) {
        return function (value) {
            return value.length >= min && value.length <= max;
        }
    },
    maxLength: function (max) {
        return function (value) {
            return value.length <= max;
        }
    },
    minLength: function (min) {
        return function (value) {
            return value.length >= min;
        }
    }
};

// Array
r.arr = {
    contains: function (item) {
        return function (value) {
            return value.indexOf(item) > -1;
        }
    },
    containsAll: function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            for (var i = 0; i < args.length; i++)
                if (value.indexOf(args[i]) == -1)
                    return false;

            return true;
        }
    },
    containsAny: function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            for (var i = 0; i < args.length; i++)
                if (value.indexOf(args[i]) > -1)
                    return true;

            return false;
        }
    },
    containsNone: function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            for (var i = 0; i < args.length; i++)
                if (value.indexOf(args[i]) > -1)
                    return false;

            return true;
        }
    },
    startsWith: function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            if (args.length > value.length)
                return false;

            for (var i = 0; i < args.length; i++)
                if (value[i] !== args[i])
                    return false;

            return true;
        }
    },
    endsWith: function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            var i = args.length;
            var j = value.length;

            if (args.length > value.length)
                return false;

            for (var i = value.length - args.length, j = 0; i < value.length && j < args.length; i++, j++)
                if (args[j] !== value[i])
                    return false;

            return true;
        }
    },
    length: function (num) {
        return function (value) {
            return value.length == num;
        }
    },
    lengthRange: function (min, max) {
        return function (value) {
            return value.length >= min && value.length <= max;
        }
    },
    maxLength: function (max) {
        return function (value) {
            return value.length <= max;
        }
    },
    minLength: function (min) {
        return function (value) {
            return value.length >= min;
        }
    }
};

// Object
r.obj = {
    instanceof: function (object) {
        return function (value) {
            return value instanceof object;
        }
    },
    hasProperty: function (prop) {
        return function (value) {
            return value.hasOwnProperty(prop);
        }
    }
};

function testRule (rule, value) {

    // optional flag
    if (rule === r.opt && typeof value == 'undefined')
        return true;

    // rule is function
    if (typeof rule == 'function') {
        if (rule(value) !== true)
            return false;
    }

    // rule is regexp
    else if (rule instanceof RegExp) {
        if (rule.test(value) !== true)
            return false;
    }

    // rule is array
    else if (rule instanceof Array) {

        // optional
        if (rule.indexOf(r.opt) > -1 && typeof value == 'undefined')
            return true;

        // for each rule in array...
        for (var i = 0; i < rule.length; i++) {

            // rule in array is an array, all rules in sub-array must pass
            if (rule[i] instanceof Array) {
                for (var j = 0; j < rule[i].length; j++)
                    if (testRule(rule[i][j], value) !== true)
                        return false;

                return true;
            }

            // test rule in array against value
            else {
                if (testRule(rule[i], value) === true)
                    return true;
            }
        }

        return false;
    }

    // rule is string, number, boolean, null, undefined
    else if (typeof rule == 'string' || typeof rule == 'number' || typeof rule == 'boolean' || typeof rule == 'undefined' || rule === null) {
        if (rule !== value)
            return false;
    }

    // rule is rubric object
    else if (rule instanceof ro) {
        if (rule.test(value) !== true)
            return false;
    }

    // rule is object
    else if (typeof rule == 'object') {
        if (r.test(rule, value) !== true)
            return false;
    }

    // everything else
    else {
        if (rule !== value)
            return false;
    }

    return true;
}

module.exports = exports = r;
