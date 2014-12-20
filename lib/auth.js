"use strict";

var models  = require('./models');
var util = require('./util');

module.exports.token = function(req, res, next) {
    req.assert('token', "Token is missing").notEmpty();

    var tokenHash = req.param('token');

    models.Token.find({ where: { hash: tokenHash }}).then(function(token) {
        if (token) {
            token.getUser().then(function(user) {
                req.user = user;
                next();
            });
        } else {
            res.status(401).send({ param: "token", msg: "Invalid token", value: tokenHash });
        }
    });
};
