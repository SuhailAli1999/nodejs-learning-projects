const { members, trainers } = require("../db");

exports.getAllRevenues = async (req, res, next) => {
  try {
    let AllRevenues = 0;
    for (let i = 0; i < members.length; i++) {
      AllRevenues += members[i].membership.cost;
    }

    res.status(201).json({
      AllRevenues,
      message: "Get all revenues of all members successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error Get all revenues of all members", error: error });
  }
};

exports.getSpecificTrainerRevenues = async (req, res, next) => {
  try {
    const trainerId = req.params.trainerId;
    let revenues = 0;
    for (let i = 0; i < trainers.length; i++) {
      if (trainers[i].trainerId == trainerId) {
        for (let j = 0; j < members.length; j++) {
          if (members[j].trainerId == trainerId) {
            revenues += members[j].membership.cost;
          }
        }
        res.status(200).json({
          revenues,
          message: `Get revenues of trainer with id ${trainerId} successfully`,
        });
        return;
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Error Get revenues of trainer with id ${trainerId}",
      error: error,
    });
  }
};
