var assert = require('assert');
var mocha = require('mocha');
var rubric = require('../index.js');

describe('rubric.breakdown()', function () {
    describe('flat object', function () {
        var rules = {
            one: 'one',
            two: 'two'
        };

        it('should return a flat object containing only the rule parameters', function () {
            var result = rubric.breakdown(rules, {
                three: 'three'
            });

            assert.equal(typeof result == 'object', true);
            assert.equal(result.hasOwnProperty('one'), true);
            assert.equal(result.hasOwnProperty('two'), true);
            assert.equal(result.hasOwnProperty('three'), false);
        });

        it('should return false on the invalid parameters', function () {
            var result = rubric.breakdown(rules, {
                one: 'one',
                two: 'foobar'
            });

            assert.equal(result.one, true);
            assert.equal(result.two, false);
        });
    });

    describe('multi-level object', function () {
        var rules = {
            a: {
                one: 'one',
                two: 'two'
            },
            b: 'b'
        };

        it('should return a multi-level object containing only the rule parameters', function () {
            var result = rubric.breakdown(rules, {
                a: {
                    three: 'three'
                },
                c: 'foobar'
            });

            assert.equal(typeof result == 'object', true);
            assert.equal(result.hasOwnProperty('a'), true);
            assert.equal(result.hasOwnProperty('b'), true);
            assert.equal(result.hasOwnProperty('c'), false);

            assert.equal(typeof result.a == 'object', true);
            assert.equal(result.a.hasOwnProperty('one'), true);
            assert.equal(result.a.hasOwnProperty('two'), true);
            assert.equal(result.a.hasOwnProperty('three'), false);
        });

        it('should return false on invalid parameters', function () {
            var result = rubric.breakdown(rules, {
                a: {
                    one: 'one',
                    two: 'foobar'
                },
                b: 'foobar'
            });

            assert.equal(result.a.one, true);
            assert.equal(result.a.two, false);
            assert.equal(result.b, false);
        });
    });
});
