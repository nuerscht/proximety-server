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

        for (var i = 0; i < user.friends.length; i++) {
            var connectionToFriend = user.friends[i];

            models.User.findOne({ _id: connectionToFriend.user, 'friends.user': user._id }).exec(function(err, friend) {
                if (!err && friend != null) {
                    var lastPos = user.history[user.history.length - 1];
                    var distance = util.distanceInKm(latitude, longitude, friend.latitude, friend.longitude);
                    var lastDistance = util.distanceInKm(lastPos.latitude, lastPos.longitude, friend.latitude, friend.longitude);

                    if (connectionToFriend.active &&
                        distance <= connectionToFriend.distance &&
                        lastDistance > connectionToFriend.distance) {

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
                    }

                    var connectionFromFriend = friend.friends[0];

                    if (connectionFromFriend.active &&
                        distance <= connectionFromFriend.distance &&
                        lastDistance > connectionFromFriend.distance) {

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
            });
        }

        res.send({ msg: "Position updated"});
    }
});

module.exports = router;
