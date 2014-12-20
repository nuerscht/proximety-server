"use strict";

var express = require('express');
var models  = require('../../lib/models');
var auth = require('../../lib/auth');
var router = express.Router();

router.get('/search', auth.token, function(req, res) {
    var friends = req.user.getFriends();
    res.send(friends);
});

router.post('/', auth.token, function(req, res) {
    req.checkBody('email', "Invalid email address").isEmail();

    models.User.find({ where: { email: req.body.email } }).then(function(friend) {
        if (friend) {
            req.user.addFriend(friend);
            res.send(friend);

            //req.user.addFriend(friend);
            //friend.salt = undefined;
            //friend.password = undefined;

        } else {
            res.status(400).send({ param: "email", msg: "User with this email address not found", value: req.body.email });
        }
    });
});

module.exports = router;
