const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll({ include: [ {model: Collaborator, as: "collaborators"} ] })
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    });
  },
  getWiki(id, callback){
    let result = {};
    return Wiki.findByPk(id, {include: [ {model: Collaborator, as: "collaborators"} ] })
    .then((wiki) => {
      if(!wiki) {
        callback(404);
      } else {
        result["wiki"] = wiki;

        Collaborator.scope({method: ["collaboratorsOn", id]}).findAll()
        .then((collaborators) => {
          result["collaborators"] = collaborators;

          callback(null, result);
        })
        .catch((err) => {
          callback(err);
        })
      }
    })

  },
  addWiki(newWiki, callback){
    return Wiki.create(newWiki)
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },
  deleteWiki(req, callback){
    return Wiki.findByPk(req.params.id)
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();

      if(authorized) {
        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    })
  },
  updateWiki(req, updatedWiki, callback){
    return Wiki.findByPk(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }
      let collaborator = Collaborator.findOne({
        where: {
          userId: req.user.id,
          wikiId: wiki.id
        }
      })

      const authorized = new Authorizer(req.user, collaborator, wiki).update();

      if(authorized) {
        updatedWiki.private == undefined ? updatedWiki.private = false : updatedWiki.private = true;
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
         callback("Forbidden");
      }
    });
  },
  downgradeWikis(userId, callback){
    return Wiki.findAll()
    .then((wikis) => {
      wikis.forEach(wiki => {
        if (wiki.userId == userId && wiki.private == true) {
          wiki.update({private: false});
        }
      })
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  }
}
