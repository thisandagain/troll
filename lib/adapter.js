/**
 * Redis list utilities for troll.
 *
 * @package troll
 * @author Andrew Sliwinski <andrew@diy.org>
 */

/**
 * Dependencies
 */
var async   = require('async');

/**
 * Constructor
 */
function Adapter (client) {
    var self = this;

    self.client = client;
    self.ns     = 'troll:';
};

Adapter.prototype.push = function (key, value, callback) {
    var self = this;
    self.client.lpush(self.ns + key, value, function (err) {
        callback(err, value);
    });
};

Adapter.prototype.length = function (key, callback) {
    var self = this;
    self.client.llen(self.ns + key, callback);
};

Adapter.prototype.all = function (key, callback) {
    var self = this;
    self.client.lrange(self.ns + key, 0, -1, callback);
};

Adapter.prototype.sum = function (key, callback) {
    var self = this;
    self.all(key, function (err, obj) {
        if (err) {
            callback(err);
        } else {
            async.reduce(obj, 0, function(memo, item, callback){
                callback(null, Number(item) + memo);
            }, callback);
        }
    });
};

/**
 * Export
 */
module.exports = Adapter;
