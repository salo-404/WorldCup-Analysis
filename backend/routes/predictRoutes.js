const express = require("express");
const teams = require("../data/teams");
const { calculatePrediction } = require("../utils/predictionEngine");

const router = express.Router();

const predictionCache = new Map();

function createPredictionCacheKey(teamA, teamB) {
  return `${teamA.trim().toLowerCase()}__${teamB.trim().toLowerCase()}`;
}

router.post("/", async (req, res) => {
  try {
    const { teamA, teamB } = req.body;

    if (!teamA || !teamB) {
      return res.status(400).json({
        error: "Both teamA and teamB are required",
      });
    }

    const selectedTeamA = teams.find((team) => team.name === teamA);
    const selectedTeamB = teams.find((team) => team.name === teamB);

    if (!selectedTeamA || !selectedTeamB) {
      return res.status(404).json({
        error: "One or both teams were not found",
      });
    }
if (selectedTeamA.group !== selectedTeamB.group) {
  return res.status(400).json({
    error: "Group-stage predictions only allow teams from the same group.",
  });
}
    const cacheKey = createPredictionCacheKey(teamA, teamB);

    if (predictionCache.has(cacheKey)) {
      return res.json({
        source: "ml-calibrated-prediction-engine",
        cached: true,
        prediction: predictionCache.get(cacheKey),
      });
    }

    const prediction = await calculatePrediction(selectedTeamA, selectedTeamB);

    predictionCache.set(cacheKey, prediction);

    res.json({
      source: "ml-calibrated-prediction-engine",
      cached: false,
      prediction,
    });
  } catch (error) {
    console.error("Prediction error:", error);

    res.status(500).json({
      error: "Failed to calculate prediction",
    });
  }
});

module.exports = router;