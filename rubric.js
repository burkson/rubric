( function () {
    var r = {};

    // global on the server, window in the browser
    var root;

    if (typeof window == 'object' && this === window)
        root = window;
    else if (typeof global == 'object' && this === global)
        root = global;
    else
        root = this;

    r.test = function (rules, obj) {
        if (obj === null || typeof obj != 'object')
            return false;

        for (var param in rules) {
            var rule = rules[param];
            var value = obj[param];

            if (r.test.rule(rule, value) !== true)
                return false;
        }

        return true;
    };

    r.test.rule = function (rule, value) {

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
                        if (r.test.rule(rule[i][j], value) !== true)
                            return false;

                    return true;
                }

                // test rule in array against value
                else {
                    if (r.test.rule(rule[i], value) === true)
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
    };

    r.breakdown = function (rules, obj) {
        var result = {};

        if (obj === null || typeof obj != 'object')
            return false;

        for (var param in rules) {
            var rule = rules[param];
            var value = obj[param];

            if (typeof rule == 'object' && rule !== null && !(rule instanceof Array)) {
                result[param] = r.breakdown(rule, value);
            } else {
                result[param] = r.test.rule(rule, value);
            }
        }

        return result;
    };

    // Optional flag
    r.optional = r.opt = 'RUBRIC_OPT';

    // Iterate
    r.iterate = function (rule) {
        return function (value) {
            if (!(value instanceof Array))
                return false;

            for (var i = 0; i < value.length; i++)
                if (r.test.rule(rule, value[i]) !== true)
                    return false;

            return true;
        }
    };

    // Number
    r.num = r.number = r.numeric = function (value) {
        return typeof value == 'number' || isFinite(String(value));
    };

    r.num.range = function (min, max) {
        return function (value) {
            return r.num(value) && value >= min && value <= max;
        }
    };

    r.num.greaterThan = function (num) {
        return function (value) {
            return r.num(value) && value > num;
        }
    };

    r.num.lessThan = function (num) {
        return function (value) {
            return r.num(value) && value < num;
        }
    };

    r.num.max = function (num) {
        return function (value) {
            return r.num(value) && value <= num;
        }
    };

    r.num.min = function (num) {
        return function (value) {
            return r.num(value) && value >= num;
        }
    };

    r.num.pos = r.num.positive = function (value) {
        return r.num(value) && value > 0;
    };

    r.num.neg = r.num.negative = function (value) {
        return r.num(value) && value < 0;
    };

    // Integer
    r.int = r.integer = function (value) {
        return Number(value) === value && value % 1 === 0;
    };

    r.int.range = function (min, max) {
        return function (value) {
            return r.int(value) && value >= min && value <= max;
        }
    };

    r.int.greaterThan = function (num) {
        return function (value) {
            return r.int(value) && value > num;
        }
    };

    r.int.lessThan = function (num) {
        return function (value) {
            return r.int(value) && value < num;
        }
    };

    r.int.min = function (min) {
        return function (value) {
            return r.int(value) && value >= min;
        }
    };

    r.int.max = function (max) {
        return function (value) {
            return r.int(value) && value <= max;
        }
    };

    r.int.even = function (value) {
        return r.int(value) && value % 2 == 0;
    };

    r.int.odd = function (value) {
        return r.int(value) && Math.abs(value) % 2 == 1;
    };

    r.int.pos = r.int.positive = function (value) {
        return r.int(value) && value > 0;
    };

    r.int.neg = r.int.negative = function (value) {
        return r.int(value) && value < 0;
    };

    // Float
    r.float = r.dec = r.decimal = function (value) {
        return value === Number(value) && value % 1 !== 0;
    };

    r.float.precision = function (num) {
        return function (value) {
            return r.float(num) && ( value + '' ).split('.')[1].length >= num;
        }
    };

    r.float.range = function (min, max) {
        return function (value) {
            return r.float(num) && value >= min && value <= max;
        }
    };

    r.float.greaterThan = function (num) {
        return function (value) {
            return r.float(num) && value > num;
        }
    };

    r.float.lessThan = function (num) {
        return function (value) {
            return r.float(num) && value < num;
        }
    };

    r.float.min = function (min) {
        return function (value) {
            return r.float(num) && value >= min;
        }
    };

    r.float.max = function (max) {
        return function (value) {
            return r.float(num) && value <= max;
        }
    };

    r.float.pos = r.float.positive = function (value) {
        return r.float(value) && value > 0;
    };

    r.float.neg = r.float.negative = function (value) {
        return r.float(value) && value < 0;
    };

    // String
    r.string = r.str = function (value) {
        return typeof value == 'string';
    };

    r.str.contains = function (str, flags) {
        var regex = new RegExp(
            str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),
            flags || 'g'
        );

        return function (value) {
            return r.string(value) && regex.test(value);
        }
    };

    r.str.startsWith = r.str.prefix = function (str) {
        return function (value) {
            return r.string(value) && value.substr(0, str.length) === str;
        }
    };

    r.str.endsWith = r.str.suffix = function (str) {
        return function (value) {
            return r.string(value) && value.substr(value.length - str.length) === str;
        }
    };

    r.str.size = r.str.sizeOf = r.str.lengthOf = function (num) {
        return function (value) {
            return r.string(value) && value.length == num;
        }
    };

    r.str.range = function (min, max) {
        return function (value) {
            return r.string(value) && value.length >= min && value.length <= max;
        }
    };

    r.str.max = function (max) {
        return function (value) {
            return r.string(value) && value.length <= max;
        }
    };

    r.str.min = function (min) {
        return function (value) {
            return r.string(value) && value.length >= min;
        }
    };

    // Array
    r.arrary = r.arr = function (value) {
        return value instanceof Array;
    };

    r.arr.contains = function (item) {
        return function (value) {
            return value.indexOf(item) > -1;
        }
    };

    r.arr.containsAll = function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            for (var i = 0; i < args.length; i++)
                if (value.indexOf(args[i]) == -1)
                    return false;

            return true;
        }
    };

    r.arr.containsAny = function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            for (var i = 0; i < args.length; i++)
                if (value.indexOf(args[i]) > -1)
                    return true;

            return false;
        }
    };

    r.arr.containsNone = function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            for (var i = 0; i < args.length; i++)
                if (value.indexOf(args[i]) > -1)
                    return false;

            return true;
        }
    };

    r.arr.startsWith = function () {
        var args = Array.prototype.slice.apply(arguments);

        return function (value) {
            if (args.length > value.length)
                return false;

            for (var i = 0; i < args.length; i++)
                if (value[i] !== args[i])
                    return false;

            return true;
        }
    };

    r.arr.endsWith = function () {
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
    };

    r.arr.size = r.arr.sizeOf = function (num) {
        return function (value) {
            return value.length == num;
        }
    };

    r.arr.range = function (min, max) {
        return function (value) {
            return value.length >= min && value.length <= max;
        }
    };

    r.arr.max = function (max) {
        return function (value) {
            return value.length <= max;
        }
    };

    r.arr.min = function (min) {
        return function (value) {
            return value.length >= min;
        }
    };

    // Object
    r.obj = r.object = function (value) {
        return typeof value == 'object' && value !== null;
    };

    r.obj.instanceof = function (obj) {
        return function (value) {
            return r.obj(value) && value instanceof obj;
        }
    };

    r.obj.hasProperty = function (prop) {
        return function (value) {
            return r.obj(value) && value.hasOwnProperty(prop);
        }
    };

    // Function
    r.fn = r.function = function (value) {
        return typeof value == 'function';
    };

    r.fn.args = function (num) {
        return function (value) {
            return r.fn(value) && value.length == num;
        }
    };

    // Boolean, NULL, Undefined
    r.bool = r.boolean = function (value) {
        return typeof value == 'boolean';
    };

    r.null = function (value) {
        return value === null;
    };

    r.und = r.undefined = function (value) {
        return typeof value == 'undefined';
    };

    r.truthy = function (value) {
        return ( value == true || value == 'yes' || value == '1' || value == 'true' )
            && value != '0'
            && value != 'false'
            && value != 'no'
            && value != 'null'
            && value != 'undefined';
    };

    r.falsy = r.falsey = function (value) {
        return value == false || value == 'no' || value == '0' || value == 'false' || value == 'null' || value == 'undefined';
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exports = r;

    // AMD / RequireJS
    } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return r;
        });

    // included directly via <script> tag
    } else {
        root.rubric = r;
    }
}());
