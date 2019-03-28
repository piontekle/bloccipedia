const Collaborator = require("./models").Collaborator;
const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Authorizer = require("../policies/application");

module.exports = {
  add(req, callback) {

    if (req.user.email == req.body.email){
      return callback("Cannot add yourself as a collaborator");
    }

    User.findOne({where: { email: req.body.email }})
    .then((user) => {
      if(!user){
        return callback("User not found.");
      }

      Collaborator.findAll({
        where: {
          userId: user.id,
          wikiId: req.params.wikiId
        }
      })
      .then((collaborators) => {
        if(collaborators.length != 0){
          return callback(`${req.body.email} is already a collaborator on this wiki.`);
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
    return Collaborator.findByPk(req.params.id)
    .then((collaborator) => {
      const authorized = new Authorizer(req.user, wiki, req.body.email).editCollaborator();

      if(authorized) {
        collaborator.destroy();

        callback(null, collaborator);
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401)
      }
    })
  }

}
