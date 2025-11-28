const express = require("express");
const { signup, login, getProfile, updateProfile, getUserStats } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/stats", protect, getUserStats);
router.get("/stats/:userId", protect, getUserStats);

module.exports = router;