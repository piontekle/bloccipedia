const express = require('express');
const router = express.Router();
const collaboratorQueries = require("../db/queries.collaborators.js");
const wikiQueries = require ('../db/queries.wikis.js');
const Authorizer = require('../policies/application');

module.exports = {
  add(req, res, next){
    const authorized = new Authorizer(req.user, req.wiki, req.collaborator).addCollaborator();

    if(true) {
      collaboratorQueries.add(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect(req.headers.referer);
    }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.wikiId, (err, result) => {
      result["wiki"] = wiki;
      result["collaborators"] = collaborators;

      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, req.wiki, collaborators).edit();

        if(true) {
          res.render("collaborators/show", {wiki, collaborators});
        } else {
          req.flash("You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.wikiId}`);
        }
      }
    })
  },
  remove(req, res, next){
    if(req.user) {
      collaboratorQueries.remove(req, (err, collaborator) => {
        if(err){
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      })
    } else {
      req.flash("notice", "You must be signed in to remove Collaborators!");
			res.redirect(req.headers.referer);
    }
  }
}
