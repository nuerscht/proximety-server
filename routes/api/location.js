"use strict";

var _ = require('underscore');
var express = require('express');
var https = require('https');
var models  = require('../../lib/models');
var auth = require('../../lib/auth');
var util = require('../../lib/util');
var env = process.env.NODE_ENV || "development";
var config = require(__dirname + '/../../config/config.json')[env];
var router = express.Router();

var sendGCM = function(data, callback) {
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

// Push location
router.post('/', auth.token, function(req, res) {
    req.checkBody('latitude', "Param latitude must be a decimal number").isFloat();
    req.checkBody('longitude', "Param longitude must be a decimal number").isFloat();

    var errors = req.validationErrors();
    if (errors) res.status(400).send(errors);
    else {
        var user = req.user;
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;

        // save old lat/lon in history
        user.history.push({ latitude: user.latitude, longitude: user.longitude });

        // set new lat/lon
        user.latitude = latitude;
        user.longitude = longitude;
        user.save();

        for (var i = 0; i < user.friends.length; i++) {
            var friend = user.friends[i];

            var distance = util.distanceInKm(latitude, longitude, friend.latitude, friend.longitude);
            if (distance <= 5) {
                var lastPos = _.last(user.history.toJSON());
                if (lastPos) {
                    var lastDistance = util.distanceInKm(lastPos.latitude, lastPos.longitude, friend.latitude, friend.longitude);

                    if (lastDistance > 5) {
                        // send GCM to user
                        sendGCM({
                            registration_ids: user.clientIDs.toJSON(),
                            data: {
                                name: friend.name,
                                email: friend.email,
                                latitude: friend.latitude,
                                longitude: friend.longitude
                            }
                        }, function(err) {
                            console.log("GCM", err);
                        });

                        // send GCM to friend
                        sendGCM({
                            registration_ids: friend.clientIDs.toJSON(),
                            data: {
                                name: user.name,
                                email: user.email,
                                latitude: user.latitude,
                                longitude: user.longitude
                            }
                        }, function(err) {
                            console.log("GCM", err);
                        });
                    }
                }

            }
        }

        res.send({ msg: "Position updated"});
    }
});

module.exports = router;
