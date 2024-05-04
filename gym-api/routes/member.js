const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.js");

router.post("/member", memberController.addMember);
router.get("/member", memberController.readMembers);
router.get("/member/:memberId", memberController.readMember);
router.put("/member/:memberId", memberController.updateMember);
router.delete("/member/:memberId", memberController.deleteMember);

module.exports = router;
