"use strict";

/**
 * @author avi
 */

var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../../config/config.json')[env];
var crypto = require('crypto');

module.exports.sha1 = function(input) {
    var shasum = crypto.createHash('sha1');
    shasum.update(input);
    return shasum.digest('hex');
};

module.exports.sendGCM = function(data, callback) {
    var options = {
        host: 'android.googleapis.com',
        port: 443,
        path: '/gcm/send',
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "key=" + config.google_apikey
        }
    };

    var req = https.request(options, function(res) {
        res.on('data', function(d) {
            callback(null);
        });
    });
    req.end(JSON.stringify(data));

    req.on('error', function(e) {
        callback(e);
    });
};

module.exports.distanceInKm = function(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km;
};

function deg2rad(deg) {
    return deg * (Math.PI/180)
}
