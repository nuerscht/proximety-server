"use strict";

var express = require('express');
var models  = require('../../lib/models');
var auth = require('../../lib/auth');
var router = express.Router();

// Push location
router.post('/', auth.token, function(req, res) {
    req.checkBody('latitude', "Missing latitude").isNumber();
    req.checkBody('longitude', "Missing longitude").isNumber();

    var errors = req.validationErrors();
    if (errors) res.status(400).send(errors);
    else {
        var user = req.user;
        var latitude = req.body.latitude;
        var longitude = req.body.longitude;

        user.latitude = latitude;
        user.longitude = longitude;
        user.history.push({ latitude: latitude, longitude: longitude });
        user.save();

        res.send({ msg: "Position updated"});
    }
});

module.exports = router;
