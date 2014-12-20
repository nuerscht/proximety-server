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
    if (errors) {
        res.status(400).send(errors);
    } else {
        var salt = util.sha1(crypto.pseudoRandomBytes(256));
        var password = util.sha1(salt + req.body.password);

        models.User.findOrCreate(
            { where: { email: req.body.email }, defaults: { name: req.body.name, salt: salt, password: password } })
            .spread(function(user, created) {
                if (created) {
                    user.salt = undefined; // hide
                    user.password = undefined; // hide
                    res.send(user);
                } else {
                    res.status(400).send({ msg: "User with this email address already exists" });
                }
            });
    }
});

router.post('/token', function(req, res) {
    req.checkBody('email', "Invalid email adress").isEmail();
    req.checkBody('password', "Missing password").notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(errors);
    } else {
        models.User.find({ where: { email: req.body.email }}).then(function(user) {
            if (user) {
                var password = util.sha1(user.salt + req.body.password);

                if (user.password === password) {
                    var tokenHash = util.sha1(crypto.pseudoRandomBytes(256));
                    var token = models.Token.build({ hash: tokenHash });
                    user.addToken(token).then(function(token) {
                        res.send({ token: token.hash });
                    });
                } else {
                    res.status(400).send({ param: "password",  msg: "Invalid password", value: req.body.password });
                }
            } else {
                res.status(400).send({ msg: "User with this email address not found"});
            }
        });
    }
});

module.exports = router;
