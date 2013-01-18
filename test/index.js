/**
 * Test suite
 *
 * @package troll
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var async   = require('async'),
    test    = require('tap').test,

    troll   = require(__dirname + '/../lib/index.js');

/**
 * Suite
 */
async.auto({

    train:      function (callback) {
        troll.train(callback);
    },

    analyze:    function (callback) {
        troll.analyze('This is lame!', callback);
    },

    positive:   function (callback) {
        troll.analyze('This is totally awesome!', '0', callback);
    },

    negative:   function (callback) {
        // Amplify & override AFINN definition
        troll.inject({
            'stupid': -5,
            'lame': -5
        });

        // Perform analysis operation
        troll.analyze('This is totally stupid and lame!', '1', callback);
    },

    classifyh:  ['train', 'analyze', 'positive', 'negative', function (callback) {
        troll.classify('1', callback);
    }],

    classifyl:  ['train', 'analyze', 'positive', 'negative', function (callback) {
        troll.classify('0', callback);
    }],

    test:       ['classifyh', 'classifyl', function (callback, obj) {
        test('Component definition', function (t) {
            t.type(troll, 'object', 'Component should be an object');
            t.type(troll.analyze, 'function', 'Method should be a function');
            t.type(troll.classify, 'function', 'Method should be a function');
            t.type(troll.train, 'function', 'Method should be a function');
            t.type(troll.inject, 'function', 'Method should be a function');
            t.end();
        });

        test('Train method', function (t) {
            t.type(obj.train, 'object', 'Results should be an object');
            t.end();
        });

        test('Analyze method', function (t) {
            t.type(obj.analyze, 'number', 'Results should be a number');
            t.equal(obj.analyze, -1.3333333333333333, 'Expected result');
            t.type(obj.positive, 'number', 'Results should be a number');
            t.equal(obj.positive, 2.5, 'Expected result');
            t.type(obj.negative, 'number', 'Results should be a number');
            t.equal(obj.negative, -5.833333333333333, 'Expected result');
            t.end();
        });

        test('Classify method', function (t) {
            console.dir(obj.classifyh);
            console.dir(obj.classifyl);
            t.type(obj.classifyh, 'object', 'Results should be an object');
            t.type(obj.classifyl, 'object', 'Results should be an object');
            t.end();
        });

        callback();
    }]

}, function (err, obj) {
    test('Catch errors', function (t) {
        t.equal(err, null, 'Errors should be null');
        t.end();
        process.exit();
    });
});