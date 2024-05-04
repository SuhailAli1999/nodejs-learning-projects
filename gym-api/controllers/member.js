const { members, trainers } = require("../db");
let memberId = 1000;

exports.addMember = async (req, res, next) => {
  try {
    const { name, nationalId, phoneNumber, membership, status, trainerId } =
      req.body;

    let find = 0;

    for (let i = 0; i < members.length; i++) {
      if (members[i].nationalId == nationalId) {
        find = 1;
        break;
      }
    }
    if (find == 1) {
      res.status(200).json({
        message: "member is already found in the system!",
      });
      return;
    }

    const newMember = {
      memberId,
      name,
      nationalId,
      phoneNumber,
      membership,
      status,
      trainerId,
    };
    memberId++;
    members.push(newMember);
    res.status(201).json({ message: "member add successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error add member", error: error });
  }
};

exports.readMembers = async (req, res, next) => {
  try {
    let membersAndTrainers = [];
    for (let i = 0; i < members.length; i++) {
      const memberObject = { member: members[i] };
      for (let j = 0; j < trainers.length; j++) {
        if (trainers[j].trainerId === members[i].trainerId) {
          memberObject.trainer = trainers[j];
          break;
        }
      }
      membersAndTrainers.push(memberObject);
    }

    res
      .status(200)
      .json({ membersAndTrainers, message: "members read successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error read members", error: error });
  }
};

exports.readMember = async (req, res, next) => {
  try {
    const memberId = req.params.memberId;
    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    for (let i = 0; i < members.length; i++) {
      if (members[i].memberId == memberId) {
        if (new Date(members[i].membership.to) < todayDate) {
          res
            .status(200)
            .json({ message: "this member is not allowed to enter the gym" });
        } else {
          res
            .status(200)
            .json({ member: members[i], message: "Member read successfully" });
        }
        return;
      }
    }
    res.status(404).json({ message: "No member with this Id found!" });
  } catch (error) {
    res.status(500).json({ message: "Error read members", error: error });
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const { name, membership, trainerId, status } = req.body;
    const memberId = req.params.memberId;
    let find = 0;

    for (let i = 0; i < members.length; i++) {
      if (members[i].memberId == memberId) {
        if (name) members[i].name = name;
        if (status) members[i].status = status;
        if (membership) members[i].membership = membership;
        if (trainerId) members[i].trainerId = trainerId;
        find = 1;
        break;
      }
    }
    if (find == 1) {
      res.status(200).json({ message: "Member update successfully" });
    } else {
      res.status(404).json({ message: "No member with this Id!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error update member", error: error });
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const memberId = req.params.memberId;

    for (let i = 0; i < members.length; i++) {
      if (members[i].memberId == memberId) {
        members.splice(i, 1);
        res.status(200).json({ message: "Member deleted successfully" });
        return;
      }
    }

    res.status(404).json({ message: "No member with this Id found!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleted member", error: error });
  }
};
