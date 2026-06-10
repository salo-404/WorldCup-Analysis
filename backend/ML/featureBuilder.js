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

function buildMatchFeatures(teamA, teamB, matchContext = {}) {
  const teamAFormScore = getFormScore(teamA.form);
  const teamBFormScore = getFormScore(teamB.form);

  const teamAStrength = getTeamStrength(teamA);
  const teamBStrength = getTeamStrength(teamB);

  const features = {
    teamA: teamA.name,
    teamB: teamB.name,

    attackDifference: teamA.attack - teamB.attack,
    midfieldDifference: teamA.midfield - teamB.midfield,
    defenseDifference: teamA.defense - teamB.defense,
    formDifference: teamAFormScore - teamBFormScore,
    strengthDifference: teamAStrength - teamBStrength,

    teamAAttack: teamA.attack,
    teamAMidfield: teamA.midfield,
    teamADefense: teamA.defense,
    teamAFormScore,
    teamAStrength,

    teamBAttack: teamB.attack,
    teamBMidfield: teamB.midfield,
    teamBDefense: teamB.defense,
    teamBFormScore,
    teamBStrength,

    stage: matchContext.stage || "Unknown",
    isKnockout:
      matchContext.stage &&
      !String(matchContext.stage).toLowerCase().includes("group"),
  };

  return features;
}

module.exports = {
  getFormScore,
  getTeamStrength,
  buildMatchFeatures,
};