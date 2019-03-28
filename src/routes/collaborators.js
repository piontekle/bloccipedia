const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.post("/wiki/:wikiId/collaborators/add", collaboratorController.add);
router.post("/wiki/:wikiId/collaborators/destroy", collaboratorController.destroy);

module.exports = router;
