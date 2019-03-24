const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");

module.exports = {
  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wiki/index", {wikis});
      }
    })
  },
  new(req, res, next){
    const authorized = new Authorizer(req.user).new();

    if(authorized) {
      res.render("wiki/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wiki");
    }
  },
  create(req, res, next){
    const authorized = new Authorizer(req.user, req.wiki).create();

    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: req.user.id
      };
      if (newWiki.private == undefined) { newWiki.private = false }

      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err){
          res.redirect(500, "wiki/new");
        } else {
          res.redirect(303, `/wiki/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wiki");
    }
  },
  show(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).show();

        if(authorized) {
          res.render("wiki/show", {wiki});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect("/wiki");
        }
      }
    })
  },
  destroy(req, res, next){
    wikiQueries.deleteWiki(req, (err, post) => {
      if (err){
        res.redirect(
          typeof err === "number" ? err : 500, `/wiki/${req.params.id}`
        );
      } else {
        res.redirect(303, `/wiki`)
      }
    });
  },
  edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null){
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();

        if(authorized) {
          res.render("wiki/edit", {wiki});
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/topics/${req.params.topicId}/posts/${req.params.id}`);
        }
      }
    });
  },
  update(req, res, next){
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null){
        console.log(err)
        res.redirect(401, `/wiki/${req.params.id}`);
      } else {
        res.redirect(`/wiki/${req.params.id}`);
      }
    });
  }
}
