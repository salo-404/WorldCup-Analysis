const { buildMatchFeatures } = require("../ml/featureBuilder");
const { runModel } = require("../ml/modelEngine");
const { runPythonModel } = require("../ml/pythonModelService");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeProbabilities(probabilities) {
  const total =
    probabilities.teamAWin + probabilities.draw + probabilities.teamBWin;

  if (total <= 0) {
    return {
      teamAWin: 34,
      draw: 24,
      teamBWin: 42,
    };
  }

  const teamAWin = Math.round((probabilities.teamAWin / total) * 100);
  const draw = Math.round((probabilities.draw / total) * 100);
  const teamBWin = 100 - teamAWin - draw;

  return {
    teamAWin,
    draw,
    teamBWin,
  };
}

function getDrawCap(features) {
  const strengthGap = Math.abs(features.strengthDifference);
  const attackGap = Math.abs(features.attackDifference);
  const midfieldGap = Math.abs(features.midfieldDifference);

  const isVeryBalanced =
    strengthGap <= 2 &&
    attackGap <= 3 &&
    midfieldGap <= 3;

  const isBalanced =
    strengthGap <= 5 &&
    attackGap <= 6 &&
    midfieldGap <= 6;

  if (features.isKnockout) {
    return isVeryBalanced ? 24 : 20;
  }

  if (isVeryBalanced) {
    return 30;
  }

  if (isBalanced) {
    return 26;
  }

  return 22;
}

function calibrateProbabilities(mlProbabilities, fallbackProbabilities, features) {
  const safeMl = normalizeProbabilities(mlProbabilities);
  const drawCap = getDrawCap(features);

  const strengthGap = Math.abs(features.strengthDifference);

  /*
    The stronger the team gap, the more we trust the structured JS model.
    The closer the teams, the more we allow the ML model to influence it.
  */
  const mlWeight = strengthGap <= 4 ? 0.5 : 0.35;
  const fallbackWeight = 1 - mlWeight;

  let blended = {
    teamAWin:
      safeMl.teamAWin * mlWeight +
      fallbackProbabilities.teamAWin * fallbackWeight,

    draw:
      safeMl.draw * mlWeight +
      fallbackProbabilities.draw * fallbackWeight,

    teamBWin:
      safeMl.teamBWin * mlWeight +
      fallbackProbabilities.teamBWin * fallbackWeight,
  };

  /*
    Force draw into a realistic football dashboard range.
    Draw should not dominate unless the teams are extremely close.
  */
  blended.draw = clamp(blended.draw, 12, drawCap);

  const remaining = 100 - blended.draw;
  const winTotal = blended.teamAWin + blended.teamBWin;

  if (winTotal <= 0) {
    blended.teamAWin = remaining / 2;
    blended.teamBWin = remaining / 2;
  } else {
    blended.teamAWin = (blended.teamAWin / winTotal) * remaining;
    blended.teamBWin = (blended.teamBWin / winTotal) * remaining;
  }

  /*
    Prevent unrealistic 90+ predictions for normal match previews.
    A football analysis dashboard should show confidence, not certainty.
  */
  blended.teamAWin = clamp(blended.teamAWin, 8, 78);
  blended.teamBWin = clamp(blended.teamBWin, 8, 78);

  return normalizeProbabilities(blended);
}

function calculateDashboardConfidence(probabilities, features) {
  const winGap = Math.abs(probabilities.teamAWin - probabilities.teamBWin);
  const strengthGap = Math.abs(features.strengthDifference);

  return Math.round(clamp(54 + winGap * 0.25 + strengthGap * 0.9, 54, 84));
}

function createDashboardSummary(features, probabilities) {
  const favorite =
    probabilities.teamAWin >= probabilities.teamBWin
      ? features.teamA
      : features.teamB;

  const underdog =
    favorite === features.teamA ? features.teamB : features.teamA;

  const drawText =
    probabilities.draw >= 26
      ? "The draw probability is meaningful because the teams are close in overall profile."
      : "The draw probability is controlled because one team has clearer advantages.";

  return `${favorite} is projected as the stronger side, but ${underdog} still has a realistic path through tactical execution and match momentum. ${drawText} The model combines trained ML probabilities with calibrated football logic using attack, midfield, defense, recent form, and team strength.`;
}
function alignScoreWithProbabilities(score, probabilities) {
  const winner =
    probabilities.teamAWin >= probabilities.draw &&
    probabilities.teamAWin >= probabilities.teamBWin
      ? "teamA"
      : probabilities.teamBWin >= probabilities.draw &&
        probabilities.teamBWin >= probabilities.teamAWin
      ? "teamB"
      : "draw";

  let teamAScore = score.teamA;
  let teamBScore = score.teamB;

  if (winner === "draw") {
    const averageScore = Math.round((teamAScore + teamBScore) / 2);
    const drawScore = clamp(averageScore, 0, 3);

    return {
      teamA: drawScore,
      teamB: drawScore,
      raw: score.raw,
    };
  }

  if (winner === "teamA" && teamAScore <= teamBScore) {
    teamAScore = Math.min(teamBScore + 1, 5);
  }

  if (winner === "teamB" && teamBScore <= teamAScore) {
    teamBScore = Math.min(teamAScore + 1, 5);
  }

  return {
    teamA: teamAScore,
    teamB: teamBScore,
    raw: score.raw,
  };
}
async function calculatePrediction(teamA, teamB, matchContext = {}) {
  const features = buildMatchFeatures(teamA, teamB, matchContext);

  const fallbackPrediction = runModel(features);

  try {
    const pythonResult = await runPythonModel(features);

    if (pythonResult.error) {
      return fallbackPrediction;
    }

    const calibratedProbabilities = calibrateProbabilities(
      pythonResult.probabilities,
      fallbackPrediction.probabilities,
      features
    );

    const confidence = calculateDashboardConfidence(
      calibratedProbabilities,
      features
    );

    return {
      ...fallbackPrediction,
      probabilities: calibratedProbabilities,
      confidence,
      explanation: createDashboardSummary(features, calibratedProbabilities),
      model: {
        ...fallbackPrediction.model,
        activeModel: "python-trained-model",
        pythonModel: pythonResult.model,
        calibration:
          "ML probabilities calibrated with football-specific draw caps, team-gap weighting, and realistic dashboard limits",
      },
    };
  } catch (error) {
    console.error(
      "Python ML model failed. Using JS fallback model:",
      error.message
    );

    return fallbackPrediction;
  }
}

module.exports = {
  calculatePrediction,
};