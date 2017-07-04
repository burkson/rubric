if (module)
    var moment = require('moment');
else if (window)
    var moment = window.moment;

if (!moment)
    throw new Error('Module rubric requires "moment.js"');

var rubric = ( function () {
    const OPTIONAL = 'OPT';
    
    function TestRuleset (ruleset, data) {
        if (data === null || typeof data != 'object')
            return false;
        
        for (var key in ruleset)
            if (TestRule(ruleset[key], data[key]) !== true)
                return false;
        
        return true;
    }
    
    function TestRule (rule, value, report = false) {
        if (rule instanceof RubricTests)
            return rule.test(value, report);
        
        if (rule instanceof RegExp)
            return rule.test(value);
        
        if (typeof rule == 'function')
            return rule(value) === true;
        
        return rule === value;
    }
    
    function TestReport (ruleset, data) {
        var result = {};
        
        if (data === null || typeof data != 'object')
            return { ERROR: 'Second argument is null or is not an object' };
        
        for (var key in ruleset)
            result[key] = TestRule(ruleset[key], data[key], true);
        
        return result;
    }
    
    function RulesetDefaults (ruleset, merge = {}) {
        var defaults = {};
        
        for (var key in ruleset) {
            var optional = ruleset[key].tests.indexOf(OPTIONAL) > -1;
            var defValue = ruleset[key].default();
            
            if (!optional || defValue !== undefined)
                defaults[key] = defValue;
        }
        
        return Object.assign({}, defaults, merge);
    }
    
    /** ----------------------------------------------------------------------------------------- */
    
    function RubricTests (def) {
        var self = this;
        var add = (test) => { self.tests.push(test); return self; };
        
        self.def = def;
        self.tests = [];
        self.optional = () => add(OPTIONAL);
        self.fn = (fn) => add(val => fn(val) === true);
        self.regexp = (exp) => add(val => exp.test(val));
        self.is = (...args) => add(val => args.indexOf(val) > -1);
        
        self.test = function (value, report = false) {
            if (self.tests.indexOf(OPTIONAL) > -1 && (typeof value == 'undefined' || value === null))
                return true;
            
            for (var i = 0; i < self.tests.length; i++)
                if (self.tests[i] !== OPTIONAL)
                    if (self.tests[i](value, report) !== true)
                        return report === true ? self.tests[i](value, report) : false;
            
            return true;
        };
        
        self.default = function () {
            return self.def;
        };
    }
    
    function StringTests () {
        RubricTests.apply(this, arguments);
        
        var self = this;
        var add = (test) => { self.tests.push(test); return self; };
        
        add(str => typeof str == 'string');
        
        self.minLength = n => add(str => str.length >= n);
        self.maxLength = n => add(str => str.length <= n);
        self.hasLength = n => add(str => str.length == n);
        self.startsWith = sub => add(str => str.startsWith(sub));
        self.endsWith = sub => add(str => str.endsWith(sub));
        self.contains = sub => add(str => str.search(sub) > - 1);
        self.regexp = exp => add(str => exp.test(str));
        
    }
    
    StringTests.prototype = Object.create(RubricTests.prototype);
    StringTests.prototype.constructor = StringTests;
    
    function NumberTests () {
        RubricTests.apply(this, arguments);
        
        var self = this;
        var add = (test) => { self.tests.push(test); return self; };
        
        add(num => typeof num == 'number');
        
        self.max = n => add(num => num <= n);
        self.min = n => add(num => num >= n);
        self.greaterThan = n => add(num => num > n);
        self.lessThan = n => add(num => num < n);
        self.even = () => add(num => num % 2 == 0);
        self.odd = () => add(num => num % 2 == 1);
        self.positive = () => add(num => num > 0);
        self.negative = () => add(num => num < 0);
    }
    
    NumberTests.prototype = Object.create(RubricTests.prototype);
    NumberTests.prototype.constructor = NumberTests;
    
    function ArrayTests () {
        RubricTests.apply(this, arguments);
        
        var self = this;
        var add = (test) => { self.tests.push(test); return self; };
        
        add(arr => arr instanceof Array);
        
        self.minLength = n => add(arr => arr.length >= n);
        self.maxLength = n => add(arr => arr.length <= n);
        self.hasLength = n => add(arr => arr.length == n);
        
        self.contains = (...args) => add(arr => {
            for (var i = 0; i < args.length; i++)
                if (arr.indexOf(args[i]) == -1)
                    return false;
            
            return true;
        });
        
        self.containsAny = (...args) => add(arr => {
            for (var i = 0; i < args.length; i++)
                if (arr.indexOf(args[i]) > -1)
                    return true;
            
            return false;
        });
        
        self.forEach = rule => add((arr, report = false) => {
            var result = [];
            
            for (var i = 0; i < arr.length; i++) {
                if (TestRule(rule, arr[i], report) !== true) {
                    if (report === true)
                        result.push(TestRule(rule, arr[i], report));
                    else
                        return false;
                }
            }
            
            return report === true ? result : true;
        });
    }
    
    ArrayTests.prototype = Object.create(RubricTests.prototype);
    ArrayTests.prototype.constructor = ArrayTests;
    
    function ObjectTests () {
        RubricTests.apply(this, arguments);
        
        var self = this;
        var add = (test) => { self.tests.push(test); return self; };
        
        add(obj => typeof obj == 'object' && obj !== null);
        
        self.instanceOf = type => add(obj => obj instanceof type);
        
        self.hasProperty = (...args) => add(obj => {
            for (var i = 0; i < args.length; i++)
                if (!obj.hasOwnProperty(args[i]))
                    return false;
            
            return true;
        });
        
        self.hasAnyProperty = (...args) => add(obj => {
            for (var i = 0; i < args.length; i++)
                if (obj.hasOwnProperty(args[i]))
                    return true;
            
            return false;
        });
        
        self.ruleset = ruleset => add((obj, report = false) => {
            if (report === true)
                return TestReport(ruleset, obj);
            else
                return TestRuleset(ruleset, obj);
        });
    }
    
    ObjectTests.prototype = Object.create(RubricTests.prototype);
    ObjectTests.prototype.constructor = ObjectTests;
    
    function FunctionTests () {
        RubricTests.apply(this, arguments);
        this.tests = [ fn => typeof fn == 'function' ];
    }
    
    FunctionTests.prototype = Object.create(RubricTests.prototype);
    FunctionTests.prototype.constructor = FunctionTests;
    
    function BooleanTests () {
        RubricTests.apply(this, arguments);
        
        var self = this;
        var add = (test) => { self.tests.push(test); return self; };
        
        add(bool => typeof bool == 'boolean');
        
        self.true = () => add(bool => bool === true);
        self.false = () => add(bool => bool === false);
    }
    
    BooleanTests.prototype = Object.create(RubricTests.prototype);
    BooleanTests.prototype.constructor = BooleanTests;
    
    function DateTests () {
        RubricTests.apply(this, arguments);
        
        var self = this;
        var add = (test) => { self.tests.push(test); return self; };
        
        add(date => date instanceof Date || moment(date).isValid());
        
        self.before = (max) => add(date => moment(date).isBefore(max));
        self.after = (min) => add(date => moment(date).isAfter(min));
        self.year = (yr) => add(date => moment(date).year() == year);
        self.quarter = (qtr) => add(date => moment(date).quarter() == qtr);
        self.month = (month) => add(date => moment(date).month() == month);
        self.date = (date) => add(date => moment(date).date() == date);
        self.weekDay = (day) => add(date => moment(date).day() == day);
        self.hour = (hour) => add(date => moment(date).hour() == hour);
        self.minute = (min) => add(date => moment(date).minute() == min);
        self.second = (sec) => add(date => moment(date).second() == sec);
    }
    
    DateTests.prototype = Object.create(RubricTests.prototype);
    DateTests.prototype.constructor = DateTests;
    
    function NullTests () {
        RubricTests.apply(this, arguments);
        this.tests = [ arg => arg === null ];
    }
    
    NullTests.prototype = Object.create(RubricTests.prototype);
    NullTests.prototype.constructor = NullTests;
    
    function UndefinedTests () {
        RubricTests.apply(this, arguments);
        this.tests = [ arg => arg === undefined ];
    }
    
    UndefinedTests.prototype = Object.create(RubricTests.prototype);
    UndefinedTests.prototype.constructor = UndefinedTests;
    
    function TruthyTests () {
        RubricTests.apply(this, arguments);
        this.tests = [ arg => arg ? true : false ];
    }
    
    TruthyTests.prototype = Object.create(RubricTests.prototype);
    TruthyTests.prototype.constructor = TruthyTests;
    
    function FalsyTests () {
        RubricTests.apply(this, arguments);
        this.tests = [ arg => arg ? false : true ];
    }
    
    FalsyTests.prototype = Object.create(RubricTests.prototype);
    FalsyTests.prototype.constructor = FalsyTests;
    
    return {
        test: TestRuleset,
        report: TestReport,
        defaults: RulesetDefaults,
        string: (def) => new StringTests(def),
        number: (def) => new NumberTests(def),
        array: (def) => new ArrayTests(def),
        object: (def) => new ObjectTests(def),
        function: (def) => new FunctionTests(def),
        boolean: (def) => new BooleanTests(def),
        date: (def) => new DateTests(def),
        truthy: (def) => new TruthyTests(def),
        falsy: (def) => new FalsyTests(def),
        null: (def) => new NullTests(def),
        undefined: (def) => new UndefinedTests(def)
    };
})();

if (module)
    module.exports = rubric;