const fs = require("fs");
const path = require("path");

const teams = require("../backend/data/teams");

const OUTPUT_PATH = path.join(__dirname, "training_matches.csv");

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
  "result",
];

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

function seededNoise(teamA, teamB) {
  const a = Number(teamA.id || 1);
  const b = Number(teamB.id || 1);

  const value = (a * 9301 + b * 49297) % 233280;
  return value / 233280;
}

function decideResult(teamA, teamB) {
  const strengthGap = getTeamStrength(teamA) - getTeamStrength(teamB);
  const attackGap = teamA.attack - teamB.defense;
  const midfieldGap = teamA.midfield - teamB.midfield;
  const defenseGap = teamA.defense - teamB.attack;

  const noise = (seededNoise(teamA, teamB) - 0.5) * 6;

  const matchScore =
    strengthGap * 0.65 +
    attackGap * 0.2 +
    midfieldGap * 0.1 +
    defenseGap * 0.05 +
    noise;

  if (Math.abs(matchScore) <= 3) {
    return "draw";
  }

  return matchScore > 3 ? "teamAWin" : "teamBWin";
}

function csvValue(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function createRow(teamA, teamB) {
  const row = {
    teamA: teamA.name,
    teamB: teamB.name,

    teamAAttack: teamA.attack,
    teamAMidfield: teamA.midfield,
    teamADefense: teamA.defense,
    teamAFormScore: getFormScore(teamA.form),
    teamAStrength: getTeamStrength(teamA),

    teamBAttack: teamB.attack,
    teamBMidfield: teamB.midfield,
    teamBDefense: teamB.defense,
    teamBFormScore: getFormScore(teamB.form),
    teamBStrength: getTeamStrength(teamB),

    result: decideResult(teamA, teamB),
  };

  return HEADERS.map((header) => csvValue(row[header])).join(",");
}

function main() {
  const rows = [HEADERS.join(",")];

  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      rows.push(createRow(teams[i], teams[j]));
      rows.push(createRow(teams[j], teams[i]));
    }
  }

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

  console.log("Training CSV generated");
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log(`Rows: ${rows.length - 1}`);
  console.log("Class counts:", counts);
}

main();