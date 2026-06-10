const express = require("express");
const teams = require("../data/teams");
const { createAnalysis } = require("../utils/analysisEngine");

const router = express.Router();

router.post("/", (req, res) => {
  const { teamA, teamB } = req.body;

  if (!teamA || !teamB) {
    return res.status(400).json({
      message: "teamA and teamB are required.",
    });
  }

  if (teamA === teamB) {
    return res.status(400).json({
      message: "Please select two different teams.",
    });
  }

  const selectedTeamA = teams.find(
    (team) => team.name.toLowerCase() === teamA.toLowerCase()
  );

  const selectedTeamB = teams.find(
    (team) => team.name.toLowerCase() === teamB.toLowerCase()
  );

  if (!selectedTeamA || !selectedTeamB) {
    return res.status(404).json({
      message: "One or both teams were not found.",
    });
  }

  const analysis = createAnalysis(selectedTeamA, selectedTeamB);

  res.json({
    source: "local-analysis-engine",
    analysis,
  });
});

module.exports = router;