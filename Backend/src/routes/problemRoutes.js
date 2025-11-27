const express = require("express");
const {
    getAllProblems,
    getProblemById,
    getRandomProblem,
    createProblem,
    updateProblem,
    deleteProblem,
} = require("../controllers/problemController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllProblems);
router.get("/random", getRandomProblem);
router.get("/:id", getProblemById);
router.post("/", protect, createProblem);
router.put("/:id", protect, updateProblem);
router.delete("/:id", protect, deleteProblem);

module.exports = router;
