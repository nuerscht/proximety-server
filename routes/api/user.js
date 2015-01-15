"use strict";

/**
 * @author Andy Villiger
 */

var express = require('express');
var models  = require('../../lib/models');
var auth = require('../../lib/auth');
var router = express.Router();

// Add a new Android ClientID
router.post('/client-id', auth.token, function(req, res) {
    req.checkBody('id', "Missing ClientID").notEmpty();

    var errors = req.validationErrors();
    if (errors) res.status(400).send(errors);
    else {
        var user = req.user;
        var clientID = req.body.id;

        user.clientIDs.addToSet(clientID);
        user.save();

        res.send({ msg: "ClientID added"});
    }
});

// Remove an Android ClientID
router.delete('/client-id', auth.token, function(req, res) {
    req.checkBody('id', "Missing ClientID").notEmpty();

    var errors = req.validationErrors();
    if (errors) res.status(400).send(errors);
    else {
        var user = req.user;
        var clientID = req.body.id;

        user.clientIDs.pull(clientID);
        user.save();

        res.send({ msg: "ClientID removed"});
    }
});

module.exports = router;
