/**
 * Language sentiment analysis and neural networks... for trolls.
 *
 * @package troll
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var _           = require('underscore'),
    async       = require('async'),
    brain       = require('brain'),
    sentimental = require('Sentimental'),
    redis       = require('redis');

var Adapter     = require('./adapter'),
    Trainer     = require('./trainer.json');

/**
 * Simple numeric range mapping function.
 *
 * @param {Number} Input value
 * @param {Array} Source range (e.g. [-5,5])
 * @param {Array} Destination range (e.g. [0,1])
 *
 * @return {Number}
 */
function convertToRange(value, srcRange, dstRange){
    // value is outside source range return
    if (value < srcRange[0] || value > srcRange[1]){
        return NaN; 
    }

    var srcMax = srcRange[1] - srcRange[0],
        dstMax = dstRange[1] - dstRange[0],
        adjValue = value - srcRange[0];

    return (adjValue * dstMax / srcMax) + dstRange[0];
}

/**
 * Converts redis list into an array of numbers between 0 and 1.
 *
 * @param {Array} Input array
 *
 * @return {Array}
 */
function convertList (list, callback) {
    // Trim list to the latest 12 values
    var set = list.slice(0, 10);
    for (var i = set.length; i < 10; i++) {
        set.push(0);
    }

    // Map AFINN data
    async.map(set, function (item, callback) {
        callback(null, convertToRange(Number(item), [-10,10], [0,1]));
    }, callback);
}

/**
 * Constructor
 */
function Troll () {
    var self = this;

    _.defaults(process.env, {
        TROLL_HOST:     'localhost',
        TROLL_PORT:     6379
    });

    // Redis connection
    var client = redis.createClient(
        Number(process.env.TROLL_PORT),
        process.env.TROLL_HOST
    );
    if (typeof process.env.TROLL_PASS !== 'undefined') {
        client.auth(process.env.TROLL_PASS, function (err) {
            if (err) process.stderr.write(err);
        });
    }

    // Setup
    self.adapter    = new Adapter(client);
    self.sentiment  = sentimental.analyze;
    self.net        = new brain.NeuralNetwork();
};

/**
 * Performs sentiment analysis on a given input.
 *
 * @param {String} Input text
 * @param {String, Optional} Unique user identifier for tracking
 *
 * @return {Number}
 */
Troll.prototype.analyze = function (input, user, callback) {
    var self = this;

    // Process args
    if (typeof callback === 'undefined') {
        callback = user;
        user = null;
    }

    // Analyze input
    var result = self.sentiment(input).score;

    // Associate
    if (user === null) {
        callback(null, result);
    } else {
        self.adapter.push(user, result, callback);
    }
};

/**
 * Checks the status of a specified user.
 *
 * @param {String} Unique user identifier
 *
 * @return {Object}
 *              - total {Number} Total number of analyses performed
 *              - sum {Number} Sum of all ratings
 *              - troll {Number} Probability of this user being a troll
 */
Troll.prototype.classify = function (user, callback) {
    var self = this;

    // Fetch from datastore
    async.auto({
        total:  function (callback) {
            self.adapter.length(user, callback);
        },
        sum:    function (callback) {
            self.adapter.sum(user, callback);
        },
        troll:  ['total', 'sum', function (callback, obj) {
            self.adapter.all(user, function (err, all) {
                if (err) {
                    callback(err);
                } else {
                    convertList(all, function (err, result) {
                        callback(null, self.net.run(result)[0]);
                    });
                }
            });
        }]
    }, callback);
};

/**
 * Trains the troll detection network. :-)
 *
 * @param {String} Training data (optional)
 *
 * @return {Object}
 *              - error {Number} Training error
 *              - iterations {Number} Training iterations
 */
Troll.prototype.train = function (data, callback) {
    var self = this;

    // Process arguments
    if (typeof callback === 'undefined') {
        callback = data;
        data = Trainer;
    }

    // Train
    callback(null, self.net.train(data));
};

/**
 * Export
 */
module.exports = new Troll();
