/**
 *  Rubric object, this gets returned when using the rubric method.
 */

function rubricObject (legend) {
    this.legend = legend;
}

rubricObject.prototype.test = function (object) {
    return rubric.test(this.legend, object);
};

rubricObject.prototype.test.breakdown = function (object) {
    return rubric.test.breakdown(this.legend, object);
};

rubricObject.prototype.score = function (object) {
    return rubric.score(this.legend, object);
};

rubricObject.prototype.score.breakdown = function (object) {
    return rubric.score.breakdown(this.legend, object);
};


/**
 *  Rubric method, this is the public API.
 */

function rubric (legend) {
    return new rubricObject(legend);
}

rubric.test = function (legend, object) {
    for (var i in legend) {
        var key = cleanKey(i);
        var optional = isOptional(i);
        var base = legend[i];
        var value = object[key];
        var type = typeof base;

        if (value === undefined && base !== undefined) {
            if (!optional)
                return false;

        // function
        } else if (type == 'function') {
            if (base(value) !== true)
                return false;

        // regular expression
        } else if (base instanceof RegExp) {
            if (base.test(value) !== true)
                return false;

        // array
        } else if (base instanceof Array) {

            // value is array
            if (value instanceof Array) {

                // for every element in the value array:
                // - test against every element in the rubric test array
                // - continue onto next test element if any pass
                // - if any value element fails, the whole value fails
                for (var v = 0; v < value.length; v++)
                    if (rubric.test({ a: base }, { a: value[v] }) !== true)
                        return false;

            // test value against every element of rubric array, return true if any pass
            } else {
                for (var b = 0; b < base.length; b++)
                    if (rubric.test({ a: base[b] }, { a: value }) === true)
                        return true;

                return false;
            }

        // string, number, boolean, undefined, null
        } else if (['string', 'number', 'boolean', 'undefined'].indexOf(type) > -1 || base === null) {
            if (base !== value)
                return false;

        // rubric object
        } else if (base instanceof rubricObject) {
            if (base.test(value) !== true)
                return false;

        // plain object
        } else if (type == 'object') {
            if (rubric.test(base, value) !== true)
                return false;

        // everything else
        } else {
            if (base !== value)
                return false;
        }
    }

    return true;
};

rubric.test.breakdown = function (legend, object) {
    var result = {};

    for (var i in legend) {
        var key = cleanKey(i);
        var optional = isOptional(i);
        var base = legend[i];
        var value = object[key];
        var type = typeof base;
        var valid = true;

        if (value === undefined && base !== undefined) {
            valid = optional;
        } else if (type == 'function') {
            valid = base(value);
        } else if (base instanceof RegExp) {
            valid = base.test(value);
        } else if (base instanceof Array) {
            if (value instanceof Array) {
                for (var v = 0; v < value.length; v++) {
                    if (rubric.test({ a: base }, { a: value[v] }) !== true) {
                        valid = false;
                        break;
                    }
                }
            } else {
                for (var b = 0; b < base.length; b++) {
                    if (rubric.test({ a: base[b] }, { a: value }) === true) {
                        valid = true;
                        break;
                    }
                }
            }
        } else if (['string', 'number', 'boolean', 'undefined'].indexOf(type) > -1 || base === null) {
            valid = base === value;
        } else if (base instanceof rubricObject) {
            valid = base.test.breakdown(value);
        } else if (type == 'object') {
            valid = rubric.test.breakdown(base, value);
        } else {
            valid = base === value;
        }

        result[key] = valid;
    }

    return result;
};

rubric.score = function (legend, object) {
    var result = 0;
    var total = 0;
    var breakdown = rubric.test.breakdown(legend, object);

    for (var i in legend) {
        var key = cleanKey(i);
        var score = getScore(i);
        var valid = breakdown[key];
        var base = legend[i];
        var value = object[key];

        if (typeof valid == 'boolean') {
            result += valid ? score : 0;
            total += score;
        } else {
            valid = rubric.score(base, value);
            result += valid[0];
            total += valid[1];
        }
    }

    return [result, total];
};

rubric.score.breakdown = function (legend, object) {
    var result = {};
    var breakdown = rubric.test.breakdown(legend, object);

    for (var i in legend) {
        var key = cleanKey(i);
        var score = getScore(i);
        var valid = breakdown[key];
        var base = legend[i];
        var value = object[key];

        if (typeof valid == 'boolean') {
            result[key] = valid ? score : 0;
        } else {
            result[key] = rubric.score.breakdown(base, value);
        }
    }

    return result;
};


/**
 * Built in testing functions
 */

// Type

rubric.is = {
    number: function (value) {
        return typeof value == 'number';
    },
    integer: function (value) {
        return Number(value) === value && value % 1 === 0;
    },
    float: function (value) {
        return value === Number(value) && value % 1 !== 0;
    },
    string: function (value) {
        return typeof value == 'string';
    },
    array: function (value) {
        return value instanceof Array;
    },
    bool: function (value) {
        return typeof value == 'boolean';
    },
    boolean: function (value) {
        return typeof value == 'boolean';
    },
    null: function (value) {
        return value === null;
    },
    object: function (value) {
        return typeof value == 'object' && value !== null;
    }
};

// Numbers

rubric.withinRange = function (min, max) {
    return function (val) {
        if (typeof val == 'number')
            return val >= min && val <= max;

        if (val instanceof Array)
            return val.length >= min && val.length <= max;

        return false;
    };
};

rubric.greaterThan = function (num) {
    return function (val) {
        if (typeof val == 'number')
            return val > num;

        return false;
    };
};

rubric.greaterThanOrEqual = function (num) {
    return function (val) {
        if (typeof val == 'number')
            return val >= num;

        return false;
    };
};

rubric.lessThan = function (num) {
    return function (val) {
        if (typeof val == 'number')
            return val < num;

        return false;
    };
};

rubric.lessThanOrEqual = function (num) {
    return function (val) {
        if (typeof val == 'number')
            return val <= num;

        return false;
    };
};

// Arrays and strings

rubric.contains = function (thing, flags) {
    var regex = /(?!)/;

    if (typeof thing == 'string') {
        regex = new RegExp(
            thing.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),
            flags || 'g'
        );
    }

    return function (val) {
        if (typeof val == 'string')
            return regex.test(val);

        if (val instanceof Array)
            return val.indexOf(thing);

        return false;
    };
};

// Array only
rubric.containsAll = function () {
    var args = Array.prototype.slice.apply(arguments);

    return function (val) {
        if (!(val instanceof Array))
            return false;

        for (var i = 0; i < args.length; i++)
            if (val.indexOf(args[i]) == -1)
                return false;

        return true;
    };
};

// Array only
rubric.containsAny = function () {
    var args = Array.prototype.slice.apply(arguments);

    return function (val) {
        if (!(val instanceof Array))
            return false;

        for (var i = 0; i < args.length; i++)
            if (val.indexOf(args[i]) > -1)
                return true;

        return false;
    };
};

// Array only
rubric.containsNone = function () {
    var args = Array.prototype.slice.apply(arguments);

    return function (val) {
        if (!(val instanceof Array))
            return false;

        for (var i = 0; i < args.length; i++)
            if (val.indexOf(args[0]) > -1)
                return false;

        return true;
    };
};

rubric.startsWith = function (thing) {
    return function (val) {
        if (typeof val == 'string' && typeof thing == 'string')
            return val.substr(0, thing.length) === thing;

        if (val instanceof Array)
            return val[0] === thing;

        return false;
    };
};

rubric.endsWith = function (thing) {
    return function (val) {
        if (typeof val == 'string' && typeof thing == 'string')
            return val.substr(val.length - thing.length) === thing;

        if (val instanceof Array)
            return val[val.length - 1] === thing;

        return false;
    };
};

rubric.length = function (num) {
    return function (val) {
        if (typeof val == 'string' || val instanceof Array)
            return val.length == num;

        return false;
    };
};

rubric.lengthRange = function (min, max) {
    return function (val) {
        if (typeof val == 'string' || val instanceof Array)
            return val.length >= min && val.length <= max;

        return false;
    };
};

// Objects and misc

rubric.instanceof = function (object) {
    return function (val) {
        return val instanceof object;
    };
};

rubric.typeof = function (type) {
    return function (val) {
        return typeof val == type;
    };
};

rubric.hasProperty = function (key) {
    return function (val) {
        if (typeof val == 'object');
            return val.hasOwnProperty(key);

        return false;
    };
};

/**
 *  Helper functions
 */

function isOptional (key) {
    return /.+:optional*/.test(key);
}

function isLiteral (key) {
    return /.+:literal*/.test(key);
}

function getScore (key) {
    var capture = /.+:score\((.+)\)*/.exec(key);

    if (capture === null)
        return 1;
    else
        return parseInt(capture[1]);
}

function cleanKey (key) {
    return key.replace(/:optional/, '').replace(/:score\(.+\)/, '');
}

module.exports = exports = rubric;
