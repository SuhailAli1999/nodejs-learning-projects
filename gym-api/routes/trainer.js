const express = require("express");
const router = express.Router();
const trainerController = require("../controllers/trainer");

router.post("/trainer", trainerController.addTrainer);
router.get("/trainers", trainerController.readTrainers);
router.get("/trainer/:trainerId", trainerController.readTrainer);
router.put("/trainer/:trainerId", trainerController.updateTrainer);
router.delete("/trainer/:trainerId", trainerController.deleteTrainer);

module.exports = router;
