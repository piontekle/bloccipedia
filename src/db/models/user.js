'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { msg: "must be a valid email" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 0
    }
  }, {});
  User.associate = function(models) {

    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    });

  };
  User.prototype.isAdmin = function() {
    return this.role === 2;
  };

  User.prototype.isPremium = function() {
    return this.role === 1;
  }

  return User;
};
