'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Collaborator.associate = function(models) {
    // associations can be defined here
    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

    Collaborator.addScope("collaboratorsOn", (wikiId) => {
      return {
        include: [{
          model: models.User
        }],
        where: { wikiId: wikiId },
        order: [["createdAt", "DESC"]]
      }
    });

    Collaborator.addScope("collaborationsWith", (userId) => {
      return {
        include: [{
          model: models.Wiki
        }],
        where: { userId: userId },
        order: [["createdAt", "DESC"]]
      }
    });
  };
  return Collaborator;
};
