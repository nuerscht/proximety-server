"use strict";

/**
 * @author Andy Villiger
 */

var mongoose    = require("mongoose");
var env         = process.env.NODE_ENV || "development";
var config      = require(__dirname + '/../config/config.json')[env];
var idValidator = require('mongoose-id-validator');
var ObjectId    = mongoose.Schema.Types.ObjectId;

mongoose.connect(config.database);

/********** Friend **********/
var friendSchema = new mongoose.Schema({
    user:       { type: ObjectId, ref: 'User' },
    active:     { type: Boolean, default: true },
    distance:   { type: Number, default: 5 }
});

/********** User **********/
var userSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true, index: true },
    salt:       { type: String, required: true },
    password:   { type: String, required: true },
    latitude:   { type: Number, default: 0 },
    longitude:  { type: Number, default: 0 },
    history:    [],
    clientIDs:  [],
    friends:    [ friendSchema ]
});

userSchema.plugin(idValidator);

var User = mongoose.model('User', userSchema);

/********** Token **********/
var tokenSchema = new mongoose.Schema({
    hash:       { type: String, required: true, unique: true, index: true },
    user:       { type: ObjectId, ref: 'User', required: true }
});

tokenSchema.plugin(idValidator);

var Token = mongoose.model('Token', tokenSchema);

/********** Request **********/
var requestSchema = new mongoose.Schema({
    requester:  { type: ObjectId, ref: 'User', required: true },
    requestee:  { type: ObjectId, ref: 'User', required: true }
});

requestSchema.plugin(idValidator);

var Request = mongoose.model('Request', requestSchema);

module.exports = {
    User : User,
    Token : Token,
    Request : Request
};
