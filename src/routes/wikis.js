const express = require("express");
const router = express.Router();

const wikiController = require("../controllers/wikiController");
const validation = require("./validation");
const helper = require("../auth/helpers");

router.get("/wiki", wikiController.index);
router.get("/wiki/new", wikiController.new);
router.post("/wiki/create", validation.validateWikis, helper.ensureAuthenticated, wikiController.create);
router.get("/wiki/:id", wikiController.show);
router.post("/wiki/:id/destroy", helper.ensureAuthenticated, wikiController.destroy);
router.get("/wiki/:id/edit", wikiController.edit);
router.post("/wiki/:id/update", helper.ensureAuthenticated, wikiController.update);

module.exports = router;
