var assert = require('assert');
var mocha = require('mocha');
var rubric = require('../index.js');

describe('key types', function () {
    describe('standard', function () {
        var legend = {
            'FOO': 'BAR',
            'hello': 'world'
        };
        
        var ru = rubric(legend);
        
        it('should accept keys if are the same', function () {
            assert.equal(ru.test({
                'FOO': 'BAR',
                'hello': 'world'
            }), true);
            
            assert.equal(ru.test({
                'hello': 'world',
                'FOO': 'BAR'
            }), true);
        });
        
        it('should be case sensitive', function () {
            assert.equal(ru.test({
                'foo': 'BAR',
                'hello': 'world'
            }), false);
            
            assert.equal(ru.test({
                'FOO': 'BAR',
                'HeLlO': 'world'
            }), false);
        });
        
        it('should not allow leading or trailing spaces', function () {
            assert.equal(ru.test({
                'FOO ': 'BAR',
                'hello': 'world'
            }), false);
            
            assert.equal(ru.test({
                'foo': 'BAR',
                '  hello': 'world'
            }), false);
        });
    });
    
    describe('scored', function () {
        var legend = {
            'foo': 1,
            'bar:score(10)': 10
        };
        
        var ru = rubric(legend);
        
        it('should only recognize input keys without the :score tag', function () {
            assert.equal(ru.test({
                'foo': 1,
                'bar': 10
            }), true);
            
            assert.equal(ru.test({
                'foo': 1,
                'bar:score(10)': 10
            }), false);
        });
        
        it('should calculate scores based on the specified score values', function () {
            var score = ru.score({
                'foo': 1,
                'bar': 10
            });
            
            assert.equal(score[0], 11);
            assert.equal(score[1], 11);
            
            score = ru.score({
                'foo': 0,
                'bar': 10
            });
            
            assert.equal(score[0], 10);
            assert.equal(score[1], 11);
            
            score = ru.score({
                'foo': 1,
                'bar': 0
            });
            
            assert.equal(score[0], 1);
            assert.equal(score[1], 11);
        });
        
        it('should return NaN as score and total if a non-number is used in the score tag', function () {
            var score = rubric.score({
                'foo:score(invalid)': 'bar'
            }, {
                'foo': 'bar'
            });
            
            assert.equal(isNaN(score[0]), true);
            assert.equal(isNaN(score[1]), true);
        });
    });
    
    describe('optional', function () {
        var legend = {
            'foo': 1,
            'bar:optional': 1
        };
        
        var ru = rubric(legend);
        
        it('should only recognize keys without the :optional tag', function () {
            assert.equal(ru.test({
                'foo': 1,
                'bar': 1
            }), true);
            
            assert.equal(ru.test({
                'foo': 1,
                'bar:optional': 1
            }), true);
        });
        
        it('should not be counted as wrong if optional key is not included', function () {
            assert.equal(ru.test({
                'foo': 1
            }), true);
        });
        
        it('should be counted as wrong if optional key is included and is invalid', function () {
            assert.equal(ru.test({
                'foo': 1,
                'bar': 0
            }), false);
        });
        
        it('should include optional score as part of the total', function () {
            var score = ru.score({
                'foo': 1,
                'bar': 0
            });
            
            assert.equal(score[0], 1);
            assert.equal(score[1], 2);
        });
    });
    
    describe('scored and optional', function () {
        var legend = {
            'foo': 'bar',
            'hello:score(20):optional': 'world',
            'key:optional:score(40)': 'value'
        };
        
        var ru = rubric(legend);
        
        it('should only recognize input keys without either tag', function () {
            assert.equal(ru.test({
                'foo': 'bar',
                'hello': 'world',
                'key': 'value'
            }), true);
        });
        
        it('should not matter the order the tags are in', function () {
            assert.equal(ru.test({
                'foo': 'bar'
            }), true);
            
            assert.equal(ru.test({
                'foo': 'bar',
                'key': 'value'
            }), true);
        });
        
        it('should include optional score as part of the total', function () {
            var score = ru.score({
                'foo': 'bar',
                'hello': 'invalid'
            });
            
            assert.equal(score[0], 41);
            assert.equal(score[1], 61);
        });
    });
});