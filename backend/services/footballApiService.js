const API_HOST = process.env.FOOTBALL_API_HOST || "v3.football.api-sports.io";
const API_KEY = process.env.FOOTBALL_API_KEY;

async function callFootballApi(endpoint) {
  if (!API_KEY) {
    throw new Error("FOOTBALL_API_KEY is missing");
  }

  const response = await fetch(`https://${API_HOST}${endpoint}`, {
    method: "GET",
    headers: {
      "x-rapidapi-host": API_HOST,
      "x-rapidapi-key": API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Football API request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(`Football API returned errors: ${JSON.stringify(data.errors)}`);
  }

  return data;
}

async function getLeaguesByName(name) {
  return callFootballApi(`/leagues?search=${encodeURIComponent(name)}`);
}

async function getTeamsByLeagueAndSeason(leagueId, season) {
  return callFootballApi(`/teams?league=${leagueId}&season=${season}`);
}

async function getFixturesByLeagueAndSeason(leagueId, season) {
  return callFootballApi(`/fixtures?league=${leagueId}&season=${season}`);
}

async function getStandingsByLeagueAndSeason(leagueId, season) {
  return callFootballApi(`/standings?league=${leagueId}&season=${season}`);
}

async function getTeamStatistics({ leagueId, season, teamId }) {
  return callFootballApi(
    `/teams/statistics?league=${leagueId}&season=${season}&team=${teamId}`
  );
}

module.exports = {
  callFootballApi,
  getLeaguesByName,
  getTeamsByLeagueAndSeason,
  getFixturesByLeagueAndSeason,
  getStandingsByLeagueAndSeason,
  getTeamStatistics,
};