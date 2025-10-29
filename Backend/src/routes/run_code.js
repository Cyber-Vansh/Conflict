const express = require("express");
const axios = require("axios");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

const runCode = async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  try {
    const submission = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
      { source_code, language_id, stdin },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      }
    );

    const token = submission.data.token;

    let result = null;
    while (!result || !result.status || result.status.id < 3) {
      const resCheck = await axios.get(`${JUDGE0_URL}/submissions/${token}?base64_encoded=false`, {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      });

      result = resCheck.data;

      if (result.status.id < 3) await new Promise((r) => setTimeout(r, 500));
    }

    res.json({
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      exit_code: result.exit_code,
      status: result.status,
      memory: result.memory,
      time: result.time,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Error running code" });
  }
};

router.post("/run", protect, runCode);

module.exports = router;