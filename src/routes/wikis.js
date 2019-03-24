const express = require("express");
const router = express.Router();

const wikiController = require("../controllers/wikiController");
const validation = require("./validation");

router.get("/wiki", wikiController.index);
router.get("/wiki/new", wikiController.new);
router.post("/wiki/create", validation.validateWikis, wikiController.create);
router.get("/wiki/:id", wikiController.show);
router.post("/wiki/:id/destroy", wikiController.destroy);
router.get("/wiki/:id/edit", wikiController.edit);
router.post("/wiki/:id/update", wikiController.update);

module.exports = router;
