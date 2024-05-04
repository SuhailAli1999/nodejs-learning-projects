const { members, trainers } = require("../db");
let trainerId = 3000;

exports.addTrainer = async (req, res, next) => {
  try {
    const { name, duration, nationalId } = req.body;

    let find = 0;

    for (let i = 0; i < trainers.length; i++) {
      if (trainers[i].nationalId == nationalId) {
        find = 1;
        break;
      }
    }
    if (find == 1) {
      res.status(200).json({
        message: "trainer is already found in the system!",
      });
      return;
    }

    const newTrainer = {
      trainerId,
      name,
      nationalId,
      duration,
    };

    trainerId++;
    trainers.push(newTrainer);
    res.status(201).json({ message: "Trainer add successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error add trainer", error: error });
  }
};

exports.readTrainers = async (req, res, next) => {
  try {
    res.status(200).json({ trainers, message: "Trainers read successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error read trainers", error: error });
  }
};

exports.readTrainer = async (req, res, next) => {
  try {
    const trainerId = req.params.trainerId;

    for (let i = 0; i < trainers.length; i++) {
      if (trainers[i].trainerId == trainerId) {
        let membersOfTrainer = [];
        for (let j = 0; j < members.length; j++) {
          if (members[j].trainerId == trainerId) {
            membersOfTrainer.push(members[j]);
          }
        }
        res.status(200).json({
          trainer: trainers[i],
          membersOfTrainer,
          message: "Trainer read successfully",
        });
        return;
      }
    }
    res.status(404).json({ message: "No trainer with this Id!" });
  } catch (error) {
    res.status(500).json({ message: "Error read trainer", error: error });
  }
};

exports.updateTrainer = async (req, res, next) => {
  try {
    const { name, duration } = req.body;
    const trainerId = req.params.memberId;
    let find = 0;

    for (let i = 0; i < trainers.length; i++) {
      if (trainers[i].memberId == trainerId) {
        if (name) trainers[i].name = name;
        if (duration) trainers[i].duration = duration;
        find = 1;
        break;
      }
    }
    if (find == 1) {
      res.status(200).json({ message: "Trainer update successfully" });
    } else {
      res.status(404).json({ message: "No Trainer with this Id found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error update trainer", error: error });
  }
};

exports.deleteTrainer = async (req, res, next) => {
  try {
    const trainerId = req.params.trainerId;

    for (let i = 0; i < trainers.length; i++) {
      if (trainers[i].trainerId == trainerId) {
        trainers.splice(i, 1);
        res.status(200).json({ message: "Trainer deleted successfully" });
        return;
      }
    }

    res.status(404).json({ message: "No trainer with this Id found!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleted trainer", error: error });
  }
};
