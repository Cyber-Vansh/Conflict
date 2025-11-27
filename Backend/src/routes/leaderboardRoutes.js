const express = require("express");
const {
    getGlobalLeaderboard,
    getFriendsLeaderboard,
    getUserRank,
} = require("../controllers/leaderboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/global", getGlobalLeaderboard);
router.get("/friends", protect, getFriendsLeaderboard);
router.get("/user/:userId", getUserRank);

module.exports = router;
