const express = require("express");
const {
    sendFriendRequest,
    respondToRequest,
    getFriends,
    getPendingRequests,
    removeFriend,
    blockUser,
} = require("../controllers/friendController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/request", protect, sendFriendRequest);
router.put("/:id", protect, respondToRequest);
router.get("/", protect, getFriends);
router.get("/pending", protect, getPendingRequests);
router.delete("/:id", protect, removeFriend);
router.post("/block", protect, blockUser);

module.exports = router;
