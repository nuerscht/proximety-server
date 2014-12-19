"use strict";

module.exports = function(sequelize, DataTypes) {
    var Token = sequelize.define("Token", {
        hash: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Token.belongsTo(models.User)
            }
        }
    });

    return Token;
};
