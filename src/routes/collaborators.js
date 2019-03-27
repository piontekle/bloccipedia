const express = require("express");
const router = express.Router();

const collaboratorController = require("../controllers/collaboratorController");

router.post("/wiki/:wikiId/collaborators/add", collaboratorController.add);
router.get("/wiki/:wikiId/collaborators", collaboratorController.show);
router.post("/wiki/:wikiId/collaborators/remove", collaboratorController.remove);

module.exports = router;
