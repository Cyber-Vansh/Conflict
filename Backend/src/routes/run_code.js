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
    let attempts = 0;

    while (attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const check = await axios.get(
        `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": RAPIDAPI_HOST,
          },
        }
      );

      if (check.data.status.id !== 1 && check.data.status.id !== 2) {
        result = check.data;
        break;
      }
      attempts++;
    }

    if (!result) {
      throw new Error("Submission timed out or failed");
    }

    res.json(result);

  } catch (error) {
    console.error("Error in /run endpoint:");
    console.error("Message:", error.message);



    console.error("Response data:", error.response?.data);
    console.error("Stack:", error.stack);

    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("Judge0 Authentication Error. Check RAPIDAPI_KEY and RAPIDAPI_HOST.");
    }

    res.status(500).json({
      error: "Error running code",
      details: error.response?.data || error.message
    });
  }
};

router.post("/run", protect, runCode);

module.exports = router;