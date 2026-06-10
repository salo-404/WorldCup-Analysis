const fs = require("fs");
const path = require("path");

const teams = require("../backend/data/teams");

const API_URL =
  "http://localhost:5000/api/test/fixtures?league=1&season=2022";

const OUTPUT_PATH = path.join(__dirname, "real_training_matches.csv");

const HEADERS = [
  "teamA",
  "teamB",
  "teamAAttack",
  "teamAMidfield",
  "teamADefense",
  "teamAFormScore",
  "teamAStrength",
  "teamBAttack",
  "teamBMidfield",
  "teamBDefense",
  "teamBFormScore",
  "teamBStrength",
  "stage",
  "teamAScore",
  "teamBScore",
  "result",
];

const TEAM_NAME_MAP = {
  USA: "USA",
  "United States": "USA",
  Wales: "Wales",
  Ecuador: "Ecuador",
  Qatar: "Qatar",
  England: "England",
  Iran: "Iran",
  Senegal: "Senegal",
  Netherlands: "Netherlands",
  Argentina: "Argentina",
  "Saudi Arabia": "Saudi Arabia",
  Denmark: "Denmark",
  Tunisia: "Tunisia",
  Mexico: "Mexico",
  Poland: "Poland",
  France: "France",
  Australia: "Australia",
  Morocco: "Morocco",
  Croatia: "Croatia",
  Germany: "Germany",
  Japan: "Japan",
  Spain: "Spain",
  "Costa Rica": "Costa Rica",
  Belgium: "Belgium",
  Canada: "Canada",
  Switzerland: "Switzerland",
  Cameroon: "Cameroon",
  Uruguay: "Uruguay",
  "South Korea": "South Korea",
  Portugal: "Portugal",
  Ghana: "Ghana",
  Brazil: "Brazil",
  Serbia: "Serbia",
};

function getFormScore(form = []) {
  return form.reduce((score, result) => {
    if (result === "W") return score + 3;
    if (result === "D") return score + 1;
    return score;
  }, 0);
}

function getTeamStrength(team) {
  const formScore = getFormScore(team.form);

  return Math.round(
    team.attack * 0.38 +
      team.midfield * 0.28 +
      team.defense * 0.24 +
      formScore * 0.9
  );
}

function normalizeTeamName(name) {
  return TEAM_NAME_MAP[name] || name;
}

function findLocalTeam(apiTeamName) {
  const normalizedName = normalizeTeamName(apiTeamName);

  return teams.find(
    (team) => team.name.toLowerCase() === normalizedName.toLowerCase()
  );
}

function getResult(homeGoals, awayGoals) {
  if (homeGoals > awayGoals) return "teamAWin";
  if (homeGoals < awayGoals) return "teamBWin";
  return "draw";
}

function csvValue(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function createRow(fixture, homeTeam, awayTeam) {
  const homeGoals = fixture.goals.home;
  const awayGoals = fixture.goals.away;

  const row = {
    teamA: homeTeam.name,
    teamB: awayTeam.name,

    teamAAttack: homeTeam.attack,
    teamAMidfield: homeTeam.midfield,
    teamADefense: homeTeam.defense,
    teamAFormScore: getFormScore(homeTeam.form),
    teamAStrength: getTeamStrength(homeTeam),

    teamBAttack: awayTeam.attack,
    teamBMidfield: awayTeam.midfield,
    teamBDefense: awayTeam.defense,
    teamBFormScore: getFormScore(awayTeam.form),
    teamBStrength: getTeamStrength(awayTeam),

    stage: fixture.league.round,
    teamAScore: homeGoals,
    teamBScore: awayGoals,
    result: getResult(homeGoals, awayGoals),
  };

  return HEADERS.map((header) => csvValue(row[header])).join(",");
}

async function main() {
  console.log("Collecting real World Cup 2022 matches...");
  console.log(`Source: ${API_URL}`);

  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Backend API failed with status ${response.status}`);
  }

  const data = await response.json();
  const fixtures = data.response || [];

  const rows = [HEADERS.join(",")];

  const skipped = [];

  fixtures.forEach((fixture) => {
    const status = fixture.fixture.status.short;

    if (!["FT", "AET", "PEN"].includes(status)) {
      return;
    }

    const homeName = fixture.teams.home.name;
    const awayName = fixture.teams.away.name;

    const homeTeam = findLocalTeam(homeName);
    const awayTeam = findLocalTeam(awayName);

    if (!homeTeam || !awayTeam) {
      skipped.push({
        homeName,
        awayName,
        reason: "Missing local team rating",
      });
      return;
    }

    if (
      typeof fixture.goals.home !== "number" ||
      typeof fixture.goals.away !== "number"
    ) {
      skipped.push({
        homeName,
        awayName,
        reason: "Missing score",
      });
      return;
    }

    rows.push(createRow(fixture, homeTeam, awayTeam));
  });

  fs.writeFileSync(OUTPUT_PATH, rows.join("\n"), "utf8");

  const counts = {
    teamAWin: 0,
    draw: 0,
    teamBWin: 0,
  };

  rows.slice(1).forEach((row) => {
    const result = row.split(",").at(-1).replaceAll('"', "");
    counts[result] += 1;
  });

  console.log("Real training CSV generated");
  console.log("---------------------------");
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Rows used: ${rows.length - 1}`);
  console.log("Class counts:", counts);

  if (skipped.length > 0) {
    console.log();
    console.log("Skipped matches:");
    skipped.forEach((item) => {
      console.log(
        `- ${item.homeName} vs ${item.awayName}: ${item.reason}`
      );
    });
  }
}

main().catch((error) => {
  console.error("Failed to collect real matches:");
  console.error(error.message);
  process.exit(1);
});