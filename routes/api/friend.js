"use strict";

var express = require('express');
var models  = require('../../lib/models');
var auth = require('../../lib/auth');
var router = express.Router();

router.get('/search', auth.token, function(req, res) {
    var friends = req.user.friends;
    res.send(friends);
});

router.post('/', auth.token, function(req, res) {
    req.checkBody('email', "Invalid email address").isEmail();

    models.User.findOne({ email: req.body.email }, function(err, friend) {
        if (err) res.status(500);
        else if (!friend) res.status(400).send({ param: "email", msg: "User with this email address not found", value: req.body.email });
        else {
            var user = req.user;

            user.friends.push(friend);
            user.save();

            friend.friends.push(user);
            friend.save();

            res.send(friend);
        }
    });
});

module.exports = router;
