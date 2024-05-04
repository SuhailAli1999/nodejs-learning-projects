const express = require("express");
const router = express.Router();
const statisticsController = require("../controllers/statistics");

router.get("/revenues", statisticsController.getAllRevenues);
router.get("/revenues/:trainerId", statisticsController.getSpecificTrainerRevenues);

module.exports = router;
