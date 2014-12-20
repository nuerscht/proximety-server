"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(__dirname + '/../config/config.json')[env];
var sequelize = new Sequelize(config.database, {
    define: {
        underscored: true
    }
});

var User = sequelize.define("user", {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    salt: Sequelize.STRING,
    password: Sequelize.STRING
});

var Token = sequelize.define("token", {
    hash: Sequelize.STRING
});

var Friend = sequelize.define("friend", {});

User.hasMany(User, { as: 'friends', through: Friend });
User.hasMany(Token);
Token.belongsTo(User);

module.exports = {
    sequelize : sequelize,
    Sequelize : Sequelize,
    User : User,
    Token : Token
};
