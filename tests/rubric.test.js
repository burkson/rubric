var assert = require('assert');
var mocha = require('mocha');
var rubric = require('../index.js');

describe('rubric.test()', function () {
    describe('number, string, boolean, undefined, null', function () {
        var rules = {
            'string': 'some string',
            'number': 1,
            'boolean': false,
            'undefined': undefined,
            'null': null
        };

        var ru = rubric(rules);

        it('should return true if all values match exactly', function () {
            assert.equal(ru.test({
                'string': 'some string',
                'number': 1,
                'boolean': false,
                'undefined': undefined,
                'null': null
            }), true);
        });

        it('should return false if any values do not match', function () {
            assert.equal(ru.test({
                'string': 'INVALID STRING',
                'number': 1,
                'boolean': false,
                'undefined': undefined,
                'null': null
            }), false);
        });

        it('should compare values literally', function () {
            assert.equal(rubric.test({ 'a': 1 }, { 'a': '1' }), false);
            assert.equal(rubric.test({ 'a': true }, { 'a': 1 }), false);
            assert.equal(rubric.test({ 'a': false }, { 'a': 0 }), false);
            assert.equal(rubric.test({ 'a': '' }, { 'a': false }), false);
            assert.equal(rubric.test({ 'a': 'a' }, { 'a': true }), false);
            assert.equal(rubric.test({ 'a': undefined }, { 'a': false }), false);
            assert.equal(rubric.test({ 'a': false }, { 'a': null }), false);
            assert.equal(rubric.test({ 'a': null }, { 'a': undefined }), false);
            assert.equal(rubric.test({ 'a': false }, { 'a': undefined }), false);
        });
    });

    describe('regular expressions', function () {
        var rules = {
            'regex': /^123/i
        };

        var ru = rubric(rules);

        it('should use the regular expression to test given strings', function () {
            assert.equal(ru.test({ 'regex': '123!' }), true);
            assert.equal(ru.test({ 'regex': 'invalid /123?/' }), false);
        });

        it('should try and convert non-string values to string', function () {
            assert.equal(ru.test({ 'regex': 123 }), true);
            assert.equal(ru.test({ 'regex': false }), false);
            assert.equal(ru.test({ 'regex': [ 'array' ] }), false);
            assert.equal(ru.test({ 'regex': [ '123' ] }), true);
            assert.equal(ru.test({ 'regex': [ 1, 2, 3 ] }), false);
            assert.equal(ru.test({ 'regex': [ '12', 3 ] }), false);
            assert.equal(ru.test({ 'regex': { 'object': 'value' } }), false);
        });
    });

    describe('functions', function () {
        var rules = {
            'fn': function (val) {
                return val == 1;
            },
            'always': function () {
                return true;
            },
            'invalid': function (val) {
                return val ? true : 'invalid return value';
            }
        };

        var ru = rubric(rules);

        it('should execute functions and use the return value as the result', function () {
            assert.equal(ru.test({
                'fn': 1,
                'always': 'this property can contain any value',
                'invalid': true
            }), true);

            assert.equal(ru.test({
                'fn': 2,
                'always': 'this property can contain any value',
                'invalid': true
            }), false);
        });

        it('should treat non-boolean return values as false', function () {
            assert.equal(ru.test({
                'fn': 1,
                'always': 'this property can contain any value',
                'invalid': false
            }), false);
        });
    });

    describe('objects', function () {
        var rules = {
            'normal': 'value',
            'nested': {
                'hello': 'world',
                'foo': 'bar'
            }
        };

        var ru = rubric(rules);

        it('should treat nested objects as rubrics to use', function () {
            assert.equal(ru.test({
                'normal': 'value',
                'nested': {
                    'hello': 'world',
                    'foo': 'bar'
                }
            }), true);

            assert.equal(ru.test({
                'normal': 'value',
                'nested': {
                    'foo': 'bar'
                }
            }), false);
        });

        it('should treat nested rubric objects as rubrics to use', function () {
            var ru = rubric({
                'normal': 'value',
                'rubric': rubric({
                    'hello': 'world'
                })
            });

            assert.equal(ru.test({
                'normal': 'value',
                'rubric': {
                    'hello': 'world'
                }
            }), true);

            assert.equal(ru.test({
                'normal': 'value',
                'rubric': {
                    'foo': 'bar'
                }
            }), false);
        });
    });

    describe('arrays', function () {
        it('should return false if array is empty', function () {
            assert.equal(rubric.test({
                'foo': []
            }, {
                'foo': ''
            }), false);
        });

        it('should return true if any sub-rules (non-array) pass', function () {
            assert.equal(rubric.test({
                'foo': [ 'red', 'blue' ]
            }, {
                'foo': 'blue'
            }), true);

            assert.equal(rubric.test({
                'foo': rubric.iterate([ 'red', 'blue' ])
            }, {
                'foo': [ 'blue' ]
            }), true);

            assert.equal(rubric.test({
                'foo': [ 'red', 'blue' ]
            }, {
                'foo': [ 'blue' ]
            }), false);
        });

        it('should return true if all sub-sub-rules pass', function () {
            assert.equal(rubric.test({
                'foo': [ [ /^a/i, /c$/i ] ]
            }, {
                'foo': 'abc'
            }), true);
        });

        it('should return false if any sub-sub-rules fail', function () {
            assert.equal(rubric.test({
                'foo': [ [ /^a/i, /c$/i ] ]
            }, {
                'foo': 'ab'
            }), false);
        });

        it('should return false if value is an array and any subvalue fails', function () {
            assert.equal(rubric.test({
                'foo': rubric.iterate([ 'red', 'blue' ])
            }, {
                'foo': [ 'red', 'green' ]
            }), false);
        });

        it('should be able to handle objects', function () {
            assert.equal(rubric.test({
                'foo': [
                    { 'hello': 'world' },
                    { 'key': 'value' }
                ]
            }, {
                'foo': { 'hello': 'world' }
            }), true);

            assert.equal(rubric.test({
                'foo': rubric.iterate([
                    { 'hello': 'world' },
                    { 'key': 'value' }
                ])
            }, {
                'foo': [
                    { 'hello': 'world' },
                    { 'invalid': 'pair' }
                ]
            }), false);
        });
    });
});
