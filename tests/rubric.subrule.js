var assert = require('assert');
var mocha = require('mocha');
var rubric = require('../rubric.js');

describe('array rules', function () {
    it('should work as an "OR" condition between each rule', function () {
        var rules = {
            simple: rubric.num,
            complex: [ rubric.num, rubric.str ]
        };

        assert.equal(rubric.test(rules, {
            simple: 10,
            complex: 10
        }), true);

        assert.equal(rubric.test(rules, {
            simple: 10,
            complex: 'foobar'
        }), true);

        assert.equal(rubric.test(rules, {
            simple: 10,
            complex: true
        }), false);

        assert.equal(rubric.test(rules, {
            simple: 10,
            complex: [ 10, 'foobar' ]
        }), false);
    });

    it('should obey the optional flag no matter where it is placed', function () {
        assert.equal(rubric.test({
            complex: [ rubric.opt, rubric.num ]
        }, {
            complex: 10
        }), true);

        assert.equal(rubric.test({
            complex: [ rubric.opt, rubric.num ]
        }, {
            foobar: 10
        }), true);

        assert.equal(rubric.test({
            complex: [ rubric.str, rubric.opt, rubric.num ]
        }, {
            foobar: 10
        }), true);

        assert.equal(rubric.test({
            complex: [ rubric.str, rubric.num, rubric.opt ]
        }, {
            foobar: 10
        }), true);
    });
});

describe('nested array rules', function () {
    it('should behave as an "AND" condition in the sub array', function () {
        var rules = {
            simple: [ rubric.num, rubric.str ],
            complex: [ rubric.num, [ rubric.str, rubric.str.contains('foo') ] ]
        };

        assert.equal(rubric.test(rules, {
            simple: 10,
            complex: 10
        }), true);

        assert.equal(rubric.test(rules, {
            simple: 10,
            complex: 'foobar'
        }), true);

        assert.equal(rubric.test(rules, {
            simple: 10,
            complex: 'hello world'
        }), false);
    });
});
