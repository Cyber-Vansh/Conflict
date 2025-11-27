const express = require("express");
const {
    createBattle,
    getActiveBattles,
    getBattleById,
    joinBattle,
    startBattle,
    endBattle,
    leaveBattle,
    getUserBattles,
} = require("../controllers/battleController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createBattle);
router.get("/", getActiveBattles);
router.get("/:id", getBattleById);
router.post("/:id/join", protect, joinBattle);
router.post("/:id/start", protect, startBattle);
router.post("/:id/end", protect, endBattle);
router.post("/:id/leave", protect, leaveBattle);
router.get("/user/:userId", getUserBattles);

module.exports = router;
