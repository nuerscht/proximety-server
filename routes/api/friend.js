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

// Get all pending friend requests
router.get('/request', auth.token, function(req, res) {
    var user = req.user;

    models.Request.find({ requestee: user._id }, '_id requester').populate('requester', '_id name email latitude longitude').exec(function(err, requests) {
        if (err) res.status(500).end();
        else res.send(requests);
    });
});

// Create a friend request
router.post('/request', auth.token, function(req, res) {
    req.checkBody('email', "Invalid email address").isEmail();

    models.User.findOne({ email: req.body.email }, '_id name email latitude longitude clientIDs', function(err, friend) {
        var user = req.user;

        if (err) res.status(500).end();
        else if (!friend) res.status(400).send({ param: "email", msg: "User with this email address not found", value: req.body.email });
        else if (friend && friend._id == user._id)  res.status(400).send({ msg: "You can't add yourself as a friend" });
        else {
            var request = new models.Request({
                requester: user,
                requestee: friend
            });

            request.save();

            console.log(friend);

            // send GCM to friend
            if (friend.clientIDs.length > 0) {
                util.sendGCM({
                    registration_ids: friend.clientIDs,
                    data: {
                        type: "friend_request",
                        name: user.name
                    }
                }, function(err) {
                    if (err) console.log("GCM", err);
                });
            }

            res.send(request);
        }
    });
});

// Accept a friend request
router.put('/request', auth.token, function(req, res) {
    var requestId = req.body.request_id;
    var user = req.user;

    models.Request.findOne({ _id: requestId, requestee: user._id }, '_id requester')
        .populate('requester', '_id name email latitude longitude friends alarm').exec(function(err, request) {
            if (err) res.status(500).end();
            else if (!request) res.status(400).send({ param: "request_id", msg: "Request with this ID not found", value: requestId });
            else {
                var friend = request.requester;

                user.friends.addToSet(friend);
                user.alarm.addToSet(friend);
                user.save();

                friend.friends.addToSet(user);
                friend.alarm.addToSet(user);
                friend.save();

                request.remove();

                res.send(_.omit(friend.toJSON(), 'friends', 'alarm'));
            }
        });
});

// Decline a friend request
router.delete('/request', auth.token, function(req, res) {
    var requestId = req.param('request_id');
    var user = req.user;

    models.Request.findOne({ _id: requestId, requestee: user._id }, function(err, request) {
        if (err) res.status(500).end();
        else if (!request) res.status(400).send({ param: "request_id", msg: "Request with this ID not found", value: requestId });
        else {
            request.remove();

            res.send({ msg: "Request declined" });
        }
    });
});

// Get all friends from my friendlist
router.get('/', auth.token, function(req, res) {
    var friendIds = req.user.friends;
    if (friendIds && friendIds.length) {
        models.User.find({ _id: { $in: friendIds } }, '_id name email latitude longitude', function(err, friends) {
            if (err) res.status(500).end();
            else res.send(friends || []);
        });
    } else {
        res.send([]);
    }
});

// Get details of a friend
router.get('/:id', auth.token, function(req, res) {
    var friendId = req.params.id;

    models.User.find({ _id: friendId }, '_id name email latitude longitude').exec(function(err, friend) {
        if (err) res.status(500).end();
        else res.send(friend);
    });
});

// Update the alarm settings
router.get('/:id/alarm', auth.token, function(req, res) {
    var friendId = req.params.id;
    var user = req.user;
    var active = user.alarm.indexOf(friendId) < 0 ? 0 : 1;

    res.send({ active: active });
});

// Update the alarm settings
router.put('/:id/alarm', auth.token, function(req, res) {
    req.checkBody('active', "Param active must be either 0 or 1").optional().isIn(["0", "1"]);

    var errors = req.validationErrors();
    if (errors) res.status(400).send(errors);
    else {
        var friendId = req.params.id;
        var user = req.user;
        var active = req.body.active == 1;

        if (user.friends.indexOf(friendId) < 0) res.status(400).send({ param: 'id', msg: "Friend with this id not found", value: friendId });
        else {
            if (active) {
                user.alarm.pull(friendId);
            } else {
                user.alarm.addToSet(friendId);
            }

            res.send({ active: active });
        }
    }
});

// Remove a friend from my friendlist
router.delete('/', auth.token, function(req, res) {
    var friendId = req.param('friend_id');
    var user = req.user;

    models.User.findOne({ _id: friendId }, function(err, friend) {
        if (err) res.status(500).end();
        else if (!friend) res.status(400).send({ param: "request_id", msg: "Request with this ID not found", value: requestId });
        else {
            user.friends.pull(friend);
            user.alarm.pull(friend);
            user.save();

            friend.friends.pull(user);
            friend.alarm.pull(user);
            friend.save();

            res.send({ msg: "Friend removed" });
        }
    });
});

module.exports = router;
