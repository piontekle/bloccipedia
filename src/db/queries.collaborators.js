const Collaborator = require("./models").Collaborator;
const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports = {
  add(req, callback) {
    if (req.user.email == req.body.collaborator){
      return callback("Cannot add yourself as a collaborator");
    }

    User.findAll({where: { email: req.body.collaborator }})
    .then((users) => {
      if(!users[0]){
        return callback("User not found.");
      }

      Collaborator.findAll({
        where: {
          userId: users[0].id,
          wikiId: req.params.wikiId
        }
      })
      .then((collaborators) => {
        if(collaborators.length != 0){
          return callback(`${req.body.collaborator} is already a collaborator on this wiki.`);
        }

        let newCollaborator = {
          userId: users[0].id,
          wikiId: req.params.wikiId
        };

        return Collaborator.create(newCollaborator)
        .then((collaborator) => {
          callback(null, collaborator);
        })
        .catch((err) => {
          callback(err);
        })
      })
    })
  },
  remove(req, callback) {
    const authorized = new Authorizer(req.user, wiki, req.body.collaborator).editCollaborator();

    if(authorized) {
      Collaborator.destroy({
        where: {
          userId: req.body.collaborator,
          wikiId: wikiId
        }
      })
      .then((collaborators) => {
        callback(null, collaborators);
      })
      .catch((err) => {
        callback(err);
      })
    } else {
      req.flash("notice", "You are not authorized to do that.");
      callback(401);
    }
  }

}
