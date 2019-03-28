'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    Wiki.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Wiki.hasMany(models.Collaborator, {
      foreignKey: "wikiId",
      as: "collaborators"
    })

  };

  Wiki.prototype.hasCollaborators = function() {
    if (this.collaborators[0]) {
      return true;
    }
  }

  Wiki.prototype.isCollaboratorOn = function(userId) {
    let isCollab = false;
    this.collaborators.forEach((collaborator) => {
      if (collaborator.userId == userId) {
        isCollab = true;
      }
    })
    return isCollab;
  }

  Wiki.addScope("lastFiveFor", (userId) => {
    return {
      where: { userId: userId },
      limit: 5,
      order: [["createdAt", "DESC"]]
    }
  });

  return Wiki;
};
