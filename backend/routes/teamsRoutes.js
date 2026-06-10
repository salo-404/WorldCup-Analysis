const express = require("express");
const teams = require("../data/teams");
const { getWorldCupTeams } = require("../services/footballApiService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const apiData = await getWorldCupTeams();

    res.json({
      source: "football-api",
      teams: apiData.response,
    });
  } catch (error) {
    res.json({
      source: "local-fallback",
      message: "Using local team data because football API is not available yet.",
      teams,
    });
  }
});

module.exports = router;