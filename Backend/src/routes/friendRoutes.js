const express = require("express");
const { sendRequest, acceptRequest, rejectRequest, getFriends, getRequests, searchUsers, removeFriend } = require("../controllers/friendController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/request", protect, sendRequest);
router.post("/accept", protect, acceptRequest);
router.post("/reject", protect, rejectRequest);
router.get("/", protect, getFriends);
router.get("/requests", protect, getRequests);
router.get("/search", protect, searchUsers);
router.post("/remove", protect, removeFriend);

module.exports = router;
