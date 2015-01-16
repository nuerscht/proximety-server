"use strict";

/**
 * @author Andy Villiger
 */

var _ = require('underscore');
var express = require('express');
var models  = require('../../lib/models');
var auth = require('../../lib/auth');
var util = require('../../lib/util');
var router = express.Router();

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

        models.User.find({ _id: { $in: _.pluck(user.friends.toObject(), 'user') } },
            '_id name email latitude longitude clientIDs alarm',
            function(err, friends) {
            if (!err) {
                for (var i = 0; i < friends.length; i++) {
                    var friend = friends[i];

                    var distance = util.distanceInKm(latitude, longitude, friend.latitude, friend.longitude);
                    if (distance <= 5) {
                        if (user.history && user.history.length > 0) {
                            var lastPos = user.history[user.history.length - 1];
                            var lastDistance = util.distanceInKm(lastPos.latitude, lastPos.longitude, friend.latitude, friend.longitude);

                            if (lastDistance > 5) {
                                // send GCM to user
                                if (user.clientIDs.length > 0) {
                                    util.sendGCM({
                                        registration_ids: user.clientIDs,
                                        data: {
                                            type: "alert",
                                            _id: friend._id,
                                            name: friend.name,
                                            email: friend.email,
                                            latitude: friend.latitude,
                                            longitude: friend.longitude
                                        }
                                    }, function(err) {
                                        if (err) console.log("GCM", err);
                                    });
                                }

                                // send GCM to friend
                                if (friend.clientIDs.length > 0) {
                                    util.sendGCM({
                                        registration_ids: friend.clientIDs,
                                        data: {
                                            type: "alert",
                                            _id: user._id,
                                            name: user.name,
                                            email: user.email,
                                            latitude: user.latitude,
                                            longitude: user.longitude
                                        }
                                    }, function(err) {
                                        if (err) console.log("GCM", err);
                                    });
                                }
                            }
                        }

                    }
                }
            }
        });

        res.send({ msg: "Position updated"});
    }
});

module.exports = router;
