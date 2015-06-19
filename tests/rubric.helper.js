var assert = require('assert');
var mocha = require('mocha');
var rubric = require('../index.js');

describe('rubric.optional(), rubric.opt()', function () {
    var rules = {
        opt: rubric.opt,
        optional: [ rubric.opt, 'a' ],
        required: 'b'
    };

    it('should let the test pass even if the value is missing', function () {
        assert.equal(rubric.test(rules, {
            required: 'b'
        }), true);
    });

    it('should fail if the value is given but invalid', function () {
        assert.equal(rubric.test(rules, {
            optional: 'b',
            required: 'b'
        }), false);
    });

    it('BUG! will fail if only rubric.optional is used and any value is given', function () {
        assert.equal(rubric.test(rules, {
            opt: 'foobar',
            required: 'b'
        }), false);
    });
});

describe('rubric.is', function () {
    it('.number()', function () {
        assert.equal(rubric.test({
            number: rubric.is.number
        }, {
            number: 1
        }), true);

        assert.equal(rubric.test({
            number: rubric.is.number
        }, {
            number: 1.2
        }), true);

        assert.equal(rubric.test({
            number: rubric.is.number
        }, {
            number: 'asdf'
        }), false);

        assert.equal(rubric.test({
            number: rubric.is.number
        }, {
            number: false
        }), false);
    });

    it('.integer()', function () {
        assert.equal(rubric.test({
            integer: rubric.is.integer
        }, {
            integer: 1
        }), true);

        assert.equal(rubric.test({
            integer: rubric.is.integer
        }, {
            integer: -10
        }), true);

        assert.equal(rubric.test({
            integer: rubric.is.integer
        }, {
            integer: 1.2
        }), false);

        assert.equal(rubric.test({
            integer: rubric.is.integer
        }, {
            integer: 'asdf'
        }), false);
    });

    it('.float()', function () {
        assert.equal(rubric.test({
            float: rubric.is.float
        }, {
            float: 1.1
        }), true);

        assert.equal(rubric.test({
            float: rubric.is.float
        }, {
            float: 1
        }), false);

        assert.equal(rubric.test({
            float: rubric.is.float
        }, {
            float: -0.8374
        }), true);

        assert.equal(rubric.test({
            float: rubric.is.float
        }, {
            float: '1.1'
        }), false);
    });

    it('.string()', function () {
        assert.equal(rubric.test({
            string: rubric.is.string
        }, {
            string: 'asdf'
        }), true);

        assert.equal(rubric.test({
            string: rubric.is.string
        }, {
            string: true
        }), false);

        assert.equal(rubric.test({
            string: rubric.is.string
        }, {
            string: [1,2,3]
        }), false);
    });

    it('.array()', function () {
        assert.equal(rubric.test({
            array: rubric.is.array
        }, {
            array: [1,2,3]
        }), true);

        assert.equal(rubric.test({
            array: rubric.is.array
        }, {
            array: { a: 1 }
        }), false);

        assert.equal(rubric.test({
            array: rubric.is.array
        }, {
            array: []
        }), true);
    });

    it('.boolean()', function () {
        assert.equal(rubric.test({
            boolean: rubric.is.boolean
        }, {
            boolean: true
        }), true);

        assert.equal(rubric.test({
            boolean: rubric.is.boolean
        }, {
            boolean: false
        }), true);

        assert.equal(rubric.test({
            boolean: rubric.is.boolean
        }, {
            boolean: 'foobar'
        }), false);

        assert.equal(rubric.test({
            boolean: rubric.is.boolean
        }, {
            boolean: 0
        }), false);

        assert.equal(rubric.test({
            boolean: rubric.is.boolean
        }, {
            boolean: null
        }), false);
    });

    it('.null()', function () {
        assert.equal(rubric.test({
            null: rubric.is.null
        }, {
            null: null
        }), true);

        assert.equal(rubric.test({
            null: rubric.is.null
        }, {
            null: {}
        }), false);

        assert.equal(rubric.test({
            null: rubric.is.null
        }, {
            null: undefined
        }), false);

        assert.equal(rubric.test({
            null: rubric.is.null
        }, {
            null: false
        }), false);
    });

    it('.object()', function () {
        assert.equal(rubric.test({
            object: rubric.is.object
        }, {
            object: {}
        }), true);

        assert.equal(rubric.test({
            object: rubric.is.object
        }, {
            object: new Error('test')
        }), true);

        assert.equal(rubric.test({
            object: rubric.is.object
        }, {
            object: null
        }), false);

        assert.equal(rubric.test({
            object: rubric.is.object
        }, {
            object: []
        }), false);
    });
});

describe('rubric.num', function () {
    it('.withinRange()', function () {
        assert.equal(rubric.test({
            num: rubric.num.withinRange(100, 200)
        }, {
            num: 150
        }), true);

        assert.equal(rubric.test({
            num: rubric.num.withinRange(100, 200)
        }, {
            num: 100
        }), true);

        assert.equal(rubric.test({
            num: rubric.num.withinRange(100, 200)
        }, {
            num: 200
        }), true);

        assert.equal(rubric.test({
            num: rubric.num.withinRange(100, 200)
        }, {
            num: 99
        }), false);

        assert.equal(rubric.test({
            num: rubric.num.withinRange(100, 200)
        }, {
            num: 201
        }), false);
    });

    it('.greaterThan()', function () {
        assert.equal(rubric.test({
            num: rubric.num.greaterThan(100)
        }, {
            num: 150
        }), true);

        assert.equal(rubric.test({
            num: rubric.num.greaterThan(100)
        }, {
            num: 100
        }), false);

        assert.equal(rubric.test({
            num: rubric.num.greaterThan(100)
        }, {
            num: 99
        }), false);
    });

    it('.lessThan()', function () {
        assert.equal(rubric.test({
            num: rubric.num.lessThan(100)
        }, {
            num: 50
        }), true);

        assert.equal(rubric.test({
            num: rubric.num.lessThan(100)
        }, {
            num: 100
        }), false);

        assert.equal(rubric.test({
            num: rubric.num.lessThan(100)
        }, {
            num: 101
        }), false);
    });
});

describe('rubric.str', function () {
    it('.contains()', function () {
        assert.equal(rubric.test({
            str: rubric.str.contains('foo')
        }, {
            str: 'hello foo world'
        }), true);

        assert.equal(rubric.test({
            str: rubric.str.contains('foo')
        }, {
            str: 'hello world'
        }), false);

        assert.equal(rubric.test({
            str: rubric.str.contains('foo', 'i')
        }, {
            str: 'asdf FoO bar'
        }), true);
    });

    it('.startsWith()', function () {
        assert.equal(rubric.test({
            str: rubric.str.startsWith('foo')
        }, {
            str: 'foo bar'
        }), true);

        assert.equal(rubric.test({
            str: rubric.str.startsWith('foo')
        }, {
            str: 'not foo bar'
        }), false);
    });

    it('.endsWith()', function () {
        assert.equal(rubric.test({
            str: rubric.str.endsWith('foo')
        }, {
            str: 'bar foo'
        }), true);

        assert.equal(rubric.test({
            str: rubric.str.startsWith('foo')
        }, {
            str: 'bar foo not'
        }), false);
    });

    it('.length()', function () {
        assert.equal(rubric.test({
            str: rubric.str.length(3)
        }, {
            str: 'foo'
        }), true);

        assert.equal(rubric.test({
            str: rubric.str.length(3)
        }, {
            str: 'foobar'
        }), false);
    });

    it('.lengthRange()', function () {
        assert.equal(rubric.test({
            str: rubric.str.lengthRange(2, 5)
        }, {
            str: '123'
        }), true);

        assert.equal(rubric.test({
            str: rubric.str.lengthRange(2, 5)
        }, {
            str: '123456'
        }), false);

        assert.equal(rubric.test({
            str: rubric.str.lengthRange(2, 5)
        }, {
            str: '1'
        }), false);

        assert.equal(rubric.test({
            str: rubric.str.lengthRange(2, 5)
        }, {
            str: '12'
        }), true);

        assert.equal(rubric.test({
            str: rubric.str.lengthRange(2, 5)
        }, {
            str: '12345'
        }), true);
    });

    it('.maxLength()', function () {
        assert.equal(rubric.test({
            str: rubric.str.maxLength(5)
        }, {
            str: 'foo'
        }), true);

        assert.equal(rubric.test({
            str: rubric.str.maxLength(5)
        }, {
            str: 'foobar'
        }), false);
    });

    it('.minLength()', function () {
        assert.equal(rubric.test({
            str: rubric.str.minLength(5)
        }, {
            str: 'foobar'
        }), true);

        assert.equal(rubric.test({
            str: rubric.str.minLength(5)
        }, {
            str: 'foo'
        }), false);
    });
});

describe('rubric.arr', function () {
    it('.contains()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.contains(1)
        }, {
            arr: [1,2,3]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.contains(4)
        }, {
            arr: [1,2,3]
        }), false);
    });

    it('.containsAll()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.containsAll(1,2,3)
        }, {
            arr: [1,2,3]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.containsAll(1,2,3,4)
        }, {
            arr: [1,2,3]
        }), false);
    });

    it('.containsAny()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.containsAny(1,2,3)
        }, {
            arr: [1,10,100]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.containsAny(1,2,3)
        }, {
            arr: [5,10,15]
        }), false);
    });

    it('.containsNone()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.containsNone(1,2,3)
        }, {
            arr: [4,5,6]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.containsNone(1,2,3)
        }, {
            arr: [3,4,5]
        }), false);
    });

    it('.startsWith()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.startsWith(1,2,3)
        }, {
            arr: [1,2,3,4,5,6]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.startsWith(1,2,3)
        }, {
            arr: [2,3,4,5,6]
        }), false);

        assert.equal(rubric.test({
            arr: rubric.arr.startsWith(1,2,3,4,5)
        }, {
            arr: [1,2,3]
        }), false);
    });

    it('.endsWith()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.endsWith(3,4,5)
        }, {
            arr: [1,2,3,4,5]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.endsWith(3,4,5)
        }, {
            arr: [3,4,5,6]
        }), false);

        assert.equal(rubric.test({
            arr: rubric.arr.endsWith(3,4,5)
        }, {
            arr: [3,4,5]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.endsWith(3,4,5)
        }, {
            arr: [4,5]
        }), false);
    });

    it('.length()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.length(3)
        }, {
            arr: [1,2,3]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.length(3)
        }, {
            arr: [1,2]
        }), false);

        assert.equal(rubric.test({
            arr: rubric.arr.length(3)
        }, {
            arr: [1,2,3,4]
        }), false);
    });

    it('.lengthRange()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.lengthRange(2, 4)
        }, {
            arr: [1,2,3]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.lengthRange(2, 4)
        }, {
            arr: [1]
        }), false);

        assert.equal(rubric.test({
            arr: rubric.arr.lengthRange(2, 4)
        }, {
            arr: [1,2,3,4,5]
        }), false);

        assert.equal(rubric.test({
            arr: rubric.arr.lengthRange(2, 4)
        }, {
            arr: [1,2]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.lengthRange(2, 4)
        }, {
            arr: [1,2,3,4]
        }), true);
    });

    it('.maxLength()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.maxLength(4)
        }, {
            arr: [1,2,3]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.maxLength(4)
        }, {
            arr: [1,2,3,4]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.maxLength(4)
        }, {
            arr: [1,2,3,4,5]
        }), false);
    });

    it('.minLength()', function () {
        assert.equal(rubric.test({
            arr: rubric.arr.minLength(2)
        }, {
            arr: [1,2,3]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.minLength(2)
        }, {
            arr: [1,2]
        }), true);

        assert.equal(rubric.test({
            arr: rubric.arr.minLength(2)
        }, {
            arr: [1]
        }), false);
    });
});

describe('rubric.obj', function () {
    it('.instanceof()', function () {
        assert.equal(rubric.test({
            obj: rubric.obj.instanceof(Error)
        }, {
            obj: new Error
        }), true);

        assert.equal(rubric.test({
            obj: rubric.obj.instanceof(Error)
        }, {
            obj: {}
        }), false);
    });

    it('.hasProperty()', function () {
        assert.equal(rubric.test({
            obj: rubric.obj.hasProperty('foo')
        }, {
            obj: {
                foo: 'bar'
            }
        }), true);

        assert.equal(rubric.test({
            obj: rubric.obj.hasProperty('foo')
        }, {
            obj: {
                foo: undefined
            }
        }), true);

        assert.equal(rubric.test({
            obj: rubric.obj.hasProperty('foo')
        }, {
            obj: {
                hello: 'world'
            }
        }), false);
    });
});
