"use strict";

var crypto = require('crypto');

module.exports.sha1 = function(input) {
    var shasum = crypto.createHash('sha1');
    shasum.update(input);
    return shasum.digest('hex');
};
