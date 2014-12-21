"use strict";

var express = require('express');
var crypto = require('crypto');
var util = require('../../lib/util');
var auth = require('../../lib/auth');
var models  = require('../../lib/models');
var router = express.Router();

router.post('/signup', function(req, res) {
    req.checkBody('name', "Invalid user name").notEmpty();
    req.checkBody('email', "Invalid email address").isEmail();
    req.checkBody('password', "Invalid password").notEmpty();
    req.checkBody('password_confirm', "Passwords don't match").equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) res.status(400).send(errors);
    else {
        var name = req.body.name;
        var email = req.body.email;
        var salt = util.sha1(crypto.pseudoRandomBytes(256));
        var password = util.sha1(salt + req.body.password);

        models.User.findOne({ email: email }, function(err, user) {
            if (err) res.status(500).end();
            else if (user) res.status(400).send({ param: "email", msg: "User with this email address already exists", value: email });
            else {
                user = new models.User({
                    name:       name,
                    email:      email,
                    salt:       salt,
                    password:   password
                });
                user.save();

                res.send(user);
            }
        });
    }
});

router.post('/token', function(req, res) {
    req.checkBody('email', "Invalid email adress").isEmail();
    req.checkBody('password', "Missing password").notEmpty();

    var errors = req.validationErrors();
    if (errors) res.status(400).send(errors);
    else {
        var email = req.body.email;

        models.User.findOne({ email: email }, function(err, user) {
            if (err) res.status(500).end();
            else if (!user) res.status(400).send({ param: "email", msg: "User with this email address not found", value: email });
            else {
                var password = util.sha1(user.salt + req.body.password);

                if (user.password === password) {
                    var tokenHash = util.sha1(crypto.pseudoRandomBytes(256));
                    var token = new models.Token({ hash: tokenHash, user: user });
                    token.save(function(err) {
                        if (err) res.status(500).end();
                        else {
                            res.send({ token: token.hash });
                        }
                    });
                } else {
                    res.status(400).send({ param: "password",  msg: "Invalid password", value: req.body.password });
                }
            }
        });
    }
});

module.exports = router;
