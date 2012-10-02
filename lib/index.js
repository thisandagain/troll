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
    sentiment   = require('sentiment');

/**
 * Constructor
 */
function Troll (redis) {
    var self = this;

    _.defaults(redis, {
        host: null,
        port: null
    });

    self.analyze    = sentiment.analyze;
    self.redis      = redis.createClient(redis);
};

/**
 * Performs sentiment analysis on a given input.
 *
 * @param {String} Input text
 * @param {String} Unique user identifier (optional) for tracking
 *
 * @return {Number}
 */
Troll.prototype.analyze = function (input, user, callback) {
    // Process args
    if (typeof callback === 'undefined') {
        callback = user;
        user = null;
    }

    // Analyze input
    var result = self.analyze(input);

    // Associate

};

/**
 * Checks the status of a specified user.
 *
 * @param {String} Unique user identifier
 *
 * @return {Object}
 *              - user {String} User identity
 *              - total {Number} Total number of analyses performed
 *              - average {Number} Average rating
 *              - troll {Boolean} Is this user a troll?
 */
Troll.prototype.lookup = function (user, callback) {
    // Fetch list from datastore

    // Parse

    // Calc
};

/**
 * Trains the neural troll detection network.
 *
 * @param {String} Unique user identifier
 * @param {Boolean} Is troll?
 *
 * @return {Err}
 */
Troll.prototype.train = function (user, troll, callback) {
    // body...
};

/**
 * Export
 */
module.exports = Troll;
