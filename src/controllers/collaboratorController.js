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
  destroy(req, res, next){
    collaboratorQueries.remove(req, (err, comment) => {
      if(err) {
        res.redirect(err, req.headers.referer);
      } else {
        res.redirect(err, req.headers.referer);
      }
    });
  }
}
