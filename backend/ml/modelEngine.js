const { createModelExplanation } = require("./modelExplanation");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeProbabilities(teamAWin, draw, teamBWin) {
  const total = teamAWin + draw + teamBWin;

  const normalizedTeamAWin = Math.round((teamAWin / total) * 100);
  const normalizedDraw = Math.round((draw / total) * 100);
  const normalizedTeamBWin = 100 - normalizedTeamAWin - normalizedDraw;

  return {
    teamAWin: normalizedTeamAWin,
    draw: normalizedDraw,
    teamBWin: normalizedTeamBWin,
  };
}

function predictOutcome(features) {
  const advantage =
    features.strengthDifference * 1.35 +
    features.attackDifference * 0.55 +
    features.midfieldDifference * 0.4 +
    features.defenseDifference * 0.25 +
    features.formDifference * 1.2;

  let teamAWin = 34 + advantage * 0.42;
  let teamBWin = 34 - advantage * 0.42;
  let draw = 32 - Math.abs(advantage) * 0.12;

  if (features.isKnockout) {
    draw -= 4;
    if (advantage > 0) teamAWin += 2;
    if (advantage < 0) teamBWin += 2;
  }

  teamAWin = clamp(teamAWin, 10, 78);
  teamBWin = clamp(teamBWin, 10, 78);
  draw = clamp(draw, 10, 32);

  return normalizeProbabilities(teamAWin, draw, teamBWin);
}

function calculateConfidence(probabilities, features) {
  const winGap = Math.abs(probabilities.teamAWin - probabilities.teamBWin);
  const featureGap = Math.abs(features.strengthDifference);

  return Math.round(clamp(55 + winGap * 0.35 + featureGap * 0.8, 55, 90));
}

function runModel(features) {
  const probabilities = predictOutcome(features);
  const confidence = calculateConfidence(probabilities, features);

  const prediction = {
    teams: {
      teamA: features.teamA,
      teamB: features.teamB,
    },
    probabilities,
    confidence,
  };

  return {
    ...prediction,
    explanation: createModelExplanation(features, prediction),
    model: {
      type: "ML-ready rule-based model",
      version: "1.0",
      featuresUsed: [
        "attackDifference",
        "midfieldDifference",
        "defenseDifference",
        "formDifference",
        "strengthDifference",
        "stage",
      ],
    },
  };
}

module.exports = {
  runModel,
};