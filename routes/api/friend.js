"use strict";

var express = require('express');
var models  = require('../../lib/models');
var auth = require('../../lib/auth');
var router = express.Router();

// Get all pending friend requests
router.get('/request', auth.token, function(req, res) {
    var user = req.user;

    models.Request.find({ requestee: user._id }).populate('requester requestee').exec(function(err, requests) {
        if (err) res.status(500).end();
        else res.send(requests);
    });
});

// Create a friend request
router.post('/request', auth.token, function(req, res) {
    req.checkBody('email', "Invalid email address").isEmail();

    models.User.findOne({ email: req.body.email }, function(err, friend) {
        if (err) res.status(500).end();
        else if (!friend) res.status(400).send({ param: "email", msg: "User with this email address not found", value: req.body.email });
        else {
            var user = req.user;

            var request = new models.Request({
                requester: user,
                requestee: friend
            });

            request.save();

            res.send(request);
        }
    });
});

// Accept a friend request
router.put('/request', auth.token, function(req, res) {
    var requestId = req.body.request_id;
    var user = req.user;

    models.Request.findOne({ _id: requestId, requestee: user._id }).populate('requester requestee').exec(function(err, request) {
        if (err) res.status(500).end();
        else if (!request) res.status(400).send({ param: "request_id", msg: "Request with this ID not found", value: requestId });
        else {
            var friend = request.requester;

            user.friends.addToSet(friend);
            user.save();

            friend.friends.addToSet(user);
            friend.save();

            request.remove();

            res.send(friend);
        }
    });
});

// Decline a friend request
router.delete('/request', auth.token, function(req, res) {
    var requestId = req.body.request_id;
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
        models.User.find({ _id: friendIds }, function(err, friends) {
            if (err) res.status(500).end();
            else res.send(friends || []);
        });
    } else {
        res.send([]);
    }
});

// Remove a friend from my friendlist
router.delete('/', auth.token, function(req, res) {
    var friendId = req.body.friend_id;
    var user = req.user;

    models.User.findOne({ _id: friendId }, function(err, friend) {
        if (err) res.status(500).end();
        else if (!friend) res.status(400).send({ param: "request_id", msg: "Request with this ID not found", value: requestId });
        else {
            user.friends.pull(friend);
            user.save();

            friend.friends.pull(user);
            friend.save();

            res.send({ msg: "Friend removed" });
        }
    });
});

module.exports = router;
