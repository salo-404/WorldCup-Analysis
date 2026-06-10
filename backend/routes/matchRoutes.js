const express = require("express");
const matches2026Fallback = require("../data/matches2026Fallback");

const {
  getWorldCup2026Matches,
  getWorldCup2026Teams,
  getWorldCup2026Groups,
} = require("../services/worldCup2026Service");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const stage = req.query.stage;
    const matches = await getWorldCup2026Matches();

    const filteredMatches = stage
      ? matches.filter(
          (match) => match.stage.toLowerCase() === stage.toLowerCase()
        )
      : matches;

    res.json({
      source: "worldcup2026-free-api",
      count: filteredMatches.length,
      matches: filteredMatches,
    });
  } catch (error) {
    const stage = req.query.stage;

    const filteredFallback = stage
      ? matches2026Fallback.filter(
          (match) => match.stage.toLowerCase() === stage.toLowerCase()
        )
      : matches2026Fallback;

    res.json({
      source: "local-fallback",
      message: "Using local fallback matches because the free World Cup 2026 API is not available.",
      error: error.message,
      count: filteredFallback.length,
      matches: filteredFallback,
    });
  }
});

router.get("/stages", async (req, res) => {
  try {
    const matches = await getWorldCup2026Matches();
    const stages = [...new Set(matches.map((match) => match.stage))];

    res.json({
      source: "worldcup2026-free-api",
      stages,
    });
  } catch (error) {
    const stages = [...new Set(matches2026Fallback.map((match) => match.stage))];

    res.json({
      source: "local-fallback",
      message: "Using fallback stages.",
      error: error.message,
      stages,
    });
  }
});

router.get("/teams", async (req, res) => {
  try {
    const teams = await getWorldCup2026Teams();

    res.json({
      source: "worldcup2026-free-api",
      count: teams.length,
      teams,
    });
  } catch (error) {
    res.status(500).json({
      source: "worldcup2026-free-api",
      message: "Could not load World Cup 2026 teams.",
      error: error.message,
    });
  }
});

router.get("/groups", async (req, res) => {
  try {
    const groups = await getWorldCup2026Groups();

    res.json({
      source: "worldcup2026-free-api",
      count: Array.isArray(groups) ? groups.length : null,
      groups,
    });
  } catch (error) {
    res.status(500).json({
      source: "worldcup2026-free-api",
      message: "Could not load World Cup 2026 groups.",
      error: error.message,
    });
  }
});
router.get("/check", async (req, res) => {
  try {
    const { teamA, teamB } = req.query;

    if (!teamA || !teamB) {
      return res.status(400).json({
        message: "teamA and teamB query parameters are required.",
        example: "/api/matches/check?teamA=Mexico&teamB=South%20Africa",
      });
    }

    const matches = await getWorldCup2026Matches();

    const match = matches.find((item) => {
      const home = item.teamA.name.toLowerCase();
      const away = item.teamB.name.toLowerCase();

      const selectedA = teamA.toLowerCase();
      const selectedB = teamB.toLowerCase();

      return (
        (home === selectedA && away === selectedB) ||
        (home === selectedB && away === selectedA)
      );
    });

    if (!match) {
      return res.json({
        isOfficialMatch: false,
        message: "This matchup is not an official scheduled World Cup match.",
      });
    }

    res.json({
      isOfficialMatch: true,
      match,
    });
  } catch (error) {
    const { teamA, teamB } = req.query;

    const match = matches2026Fallback.find((item) => {
      const home = item.teamA.name.toLowerCase();
      const away = item.teamB.name.toLowerCase();

      const selectedA = teamA.toLowerCase();
      const selectedB = teamB.toLowerCase();

      return (
        (home === selectedA && away === selectedB) ||
        (home === selectedB && away === selectedA)
      );
    });

    if (!match) {
      return res.json({
        isOfficialMatch: false,
        source: "local-fallback",
        message: "This matchup is not an official scheduled World Cup match.",
        error: error.message,
      });
    }

    res.json({
      isOfficialMatch: true,
      source: "local-fallback",
      match,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const matches = await getWorldCup2026Matches();
    const match = matches.find((item) => String(item.id) === String(req.params.id));

    if (!match) {
      return res.status(404).json({
        message: "Match not found.",
      });
    }

    res.json({
      source: "worldcup2026-free-api",
      match,
    });
  } catch (error) {
    const match = matches2026Fallback.find(
      (item) => String(item.id) === String(req.params.id)
    );

    if (!match) {
      return res.status(404).json({
        message: "Match not found.",
      });
    }

    res.json({
      source: "local-fallback",
      message: "Using fallback match.",
      error: error.message,
      match,
    });
  }
});

module.exports = router;