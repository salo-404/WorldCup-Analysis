const express = require("express");

const {
  getLeaguesByName,
  getTeamsByLeagueAndSeason,
  getFixturesByLeagueAndSeason,
  getStandingsByLeagueAndSeason,
} = require("../services/footballApiService");

const router = express.Router();

router.get("/leagues", async (req, res) => {
  try {
    const name = req.query.name || "World Cup";
    const data = await getLeaguesByName(name);

    res.json({
      source: "football-api",
      count: data.results,
      response: data.response,
    });
  } catch (error) {
    res.status(500).json({
      source: "football-api",
      message: "Football API league test failed.",
      error: error.message,
    });
  }
});

router.get("/teams", async (req, res) => {
  try {
    const leagueId = req.query.league;
    const season = req.query.season;

    if (!leagueId || !season) {
      return res.status(400).json({
        message: "league and season query parameters are required.",
        example: "/api/test/teams?league=1&season=2026",
      });
    }

    const data = await getTeamsByLeagueAndSeason(leagueId, season);

    res.json({
      source: "football-api",
      leagueId,
      season,
      count: data.results,
      response: data.response,
    });
  } catch (error) {
    res.status(500).json({
      source: "football-api",
      message: "Football API teams test failed.",
      error: error.message,
    });
  }
});

router.get("/fixtures", async (req, res) => {
  try {
    const leagueId = req.query.league;
    const season = req.query.season;

    if (!leagueId || !season) {
      return res.status(400).json({
        message: "league and season query parameters are required.",
        example: "/api/test/fixtures?league=1&season=2026",
      });
    }

    const data = await getFixturesByLeagueAndSeason(leagueId, season);

    res.json({
      source: "football-api",
      leagueId,
      season,
      count: data.results,
      response: data.response,
    });
  } catch (error) {
    res.status(500).json({
      source: "football-api",
      message: "Football API fixtures test failed.",
      error: error.message,
    });
  }
});

router.get("/standings", async (req, res) => {
  try {
    const leagueId = req.query.league;
    const season = req.query.season;

    if (!leagueId || !season) {
      return res.status(400).json({
        message: "league and season query parameters are required.",
        example: "/api/test/standings?league=1&season=2026",
      });
    }

    const data = await getStandingsByLeagueAndSeason(leagueId, season);

    res.json({
      source: "football-api",
      leagueId,
      season,
      count: data.results,
      response: data.response,
    });
  } catch (error) {
    res.status(500).json({
      source: "football-api",
      message: "Football API standings test failed.",
      error: error.message,
    });
  }
});

module.exports = router;