const WORLD_CUP_2026_API_URL =
  process.env.WORLD_CUP_2026_API_URL || "https://worldcup26.ir";

async function fetchJson(endpoint) {
  const response = await fetch(`${WORLD_CUP_2026_API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`World Cup 2026 API failed with status ${response.status}`);
  }

  return response.json();
}

function toArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.response)) return data.response;
  if (Array.isArray(data?.games)) return data.games;
  if (Array.isArray(data?.matches)) return data.matches;
  if (Array.isArray(data?.teams)) return data.teams;
  if (Array.isArray(data?.stadiums)) return data.stadiums;
  if (Array.isArray(data?.groups)) return data.groups;

  return [];
}

async function getRawTeams() {
  const data = await fetchJson("/get/teams");
  return toArray(data);
}

async function getRawMatches() {
  const data = await fetchJson("/get/games");
  return toArray(data);
}

async function getRawStadiums() {
  const data = await fetchJson("/get/stadiums");
  return toArray(data);
}

async function getRawGroups() {
  const data = await fetchJson("/get/groups");
  return toArray(data);
}

function findById(items, id) {
  return items.find((item) => String(item.id) === String(id));
}

function getTeamName(team) {
  return team?.name_en || team?.name || team?.team_name || "TBD";
}

function getTeamCode(team) {
  return team?.fifa_code || team?.code || "";
}

function getStage(match) {
  const type = String(match.type || match.stage || "").toLowerCase();

  if (type.includes("group")) return "Group Stage";
  if (type.includes("32")) return "Round of 32";
  if (type.includes("16")) return "Round of 16";
  if (type.includes("quarter")) return "Quarter-finals";
  if (type.includes("semi")) return "Semi-finals";
  if (type.includes("final")) return "Final";

  if (match.group) return "Group Stage";

  return "Unknown Stage";
}

function getStatus(match) {
  if (match.finished === true) return "Finished";
  if (match.live === true) return "Live";
  if (match.status) return match.status;

  return "Scheduled";
}

function normalizeMatch(match, teams, stadiums) {
  const homeTeam = findById(
    teams,
    match.home_team_id || match.homeTeamId || match.home_id
  );

  const awayTeam = findById(
    teams,
    match.away_team_id || match.awayTeamId || match.away_id
  );

  const stadium = findById(
    stadiums,
    match.stadium_id || match.stadiumId || match.venue_id
  );

  const teamAName = getTeamName(homeTeam);
  const teamBName = getTeamName(awayTeam);

  return {
    id: String(match.id),
    stage: getStage(match),
    group: match.group || match.groups || null,
    matchday: match.matchday || null,
    date: match.local_date || match.date || match.datetime || null,
    status: getStatus(match),

    teamA: {
      id: homeTeam?.id ? String(homeTeam.id) : null,
      name: teamAName,
      code: getTeamCode(homeTeam),
      flag: homeTeam?.flag || null,
      confirmed: teamAName !== "TBD",
    },

    teamB: {
      id: awayTeam?.id ? String(awayTeam.id) : null,
      name: teamBName,
      code: getTeamCode(awayTeam),
      flag: awayTeam?.flag || null,
      confirmed: teamBName !== "TBD",
    },

    score: {
      teamA: match.home_score ?? null,
      teamB: match.away_score ?? null,
    },

    venue: stadium
      ? {
          id: String(stadium.id),
          name: stadium.name_en || stadium.name || stadium.fifa_name || "Unknown stadium",
          city: stadium.city_en || stadium.city || "",
          country: stadium.country_en || stadium.country || "",
        }
      : null,
  };
}

async function getWorldCup2026Matches() {
  const [matches, teams, stadiums] = await Promise.all([
    getRawMatches(),
    getRawTeams(),
    getRawStadiums(),
  ]);

  return matches.map((match) => normalizeMatch(match, teams, stadiums));
}

async function getWorldCup2026Teams() {
  const teams = await getRawTeams();

  return teams.map((team) => ({
    id: String(team.id),
    name: getTeamName(team),
    code: getTeamCode(team),
    group: team.groups || team.group || null,
    flag: team.flag || null,
  }));
}

async function getWorldCup2026Groups() {
  const groups = await getRawGroups();
  return groups;
}

module.exports = {
  getWorldCup2026Matches,
  getWorldCup2026Teams,
  getWorldCup2026Groups,
};