"use strict";

var models  = require('./models');
var util = require('./util');

module.exports.token = function(req, res, next) {
    req.assert('token', "Token is missing").notEmpty();

    var tokenHash = req.param('token');

    models.Token
        .findOne({ hash: tokenHash })
        .populate('user')
        .exec(function(err, token) {
            if (err) res.status(500);
            else if (!token) res.status(401).send({param: "token", msg: "Invalid token", value: tokenHash});
            else {
                req.user = token.user;
                next();
            }
        });
};
