const express = require("express");
const {
    submitCode,
    getSubmissionStatus,
    getSubmissionById,
    getUserSubmissions,
    getBattleSubmissions,
} = require("../controllers/submissionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, submitCode);
router.get("/:id", getSubmissionById);
router.get("/:id/status", getSubmissionStatus);
router.get("/user/:userId", getUserSubmissions);
router.get("/battle/:battleId", getBattleSubmissions);

module.exports = router;
