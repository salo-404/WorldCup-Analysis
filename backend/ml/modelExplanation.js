function getMainAdvantages(features) {
  const advantages = [];

  if (Math.abs(features.attackDifference) >= 5) {
    advantages.push({
      area: "attack",
      team: features.attackDifference > 0 ? features.teamA : features.teamB,
    });
  }

  if (Math.abs(features.midfieldDifference) >= 5) {
    advantages.push({
      area: "midfield control",
      team: features.midfieldDifference > 0 ? features.teamA : features.teamB,
    });
  }

  if (Math.abs(features.defenseDifference) >= 5) {
    advantages.push({
      area: "defensive stability",
      team: features.defenseDifference > 0 ? features.teamA : features.teamB,
    });
  }

  if (Math.abs(features.formDifference) >= 3) {
    advantages.push({
      area: "recent form",
      team: features.formDifference > 0 ? features.teamA : features.teamB,
    });
  }

  return advantages;
}

function createModelExplanation(features, prediction) {
  const favorite =
    prediction.probabilities.teamAWin >= prediction.probabilities.teamBWin
      ? features.teamA
      : features.teamB;

  const advantages = getMainAdvantages(features);

  if (advantages.length === 0) {
    return `This matchup is balanced. ${features.teamA} and ${features.teamB} have similar team profiles, so the prediction is mainly influenced by small differences in form, midfield control, and defensive stability.`;
  }

  const advantageText = advantages
    .slice(0, 3)
    .map((item) => `${item.team}'s ${item.area}`)
    .join(", ");

  return `${favorite} has the stronger match profile because of ${advantageText}. The model compares attack, midfield, defense, recent form, and overall team strength. This prediction is for football analysis and project demonstration, not betting.`;
}

module.exports = {
  createModelExplanation,
};