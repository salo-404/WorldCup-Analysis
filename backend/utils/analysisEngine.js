function getStrongestArea(team) {
  const areas = [
    { name: "attack", value: team.attack },
    { name: "midfield", value: team.midfield },
    { name: "defense", value: team.defense },
  ];

  return areas.sort((a, b) => b.value - a.value)[0].name;
}

function getWeakestArea(team) {
  const areas = [
    { name: "attack", value: team.attack },
    { name: "midfield", value: team.midfield },
    { name: "defense", value: team.defense },
  ];

  return areas.sort((a, b) => a.value - b.value)[0].name;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function createHeatMap(team) {
  const style = team.style.toLowerCase();

  let left = Math.round(team.attack * 0.85);
  let center = Math.round((team.attack + team.midfield) / 2);
  let right = Math.round(team.attack * 0.85);

  if (style.includes("wide")) {
    left += 8;
    right += 8;
    center -= 4;
  }

  if (style.includes("possession") || style.includes("buildup")) {
    center += 10;
  }

  if (style.includes("counter") || style.includes("transition")) {
    left += 5;
    right += 5;
  }

  return {
    left: clamp(left, 30, 99),
    center: clamp(center, 30, 99),
    right: clamp(right, 30, 99),
  };
}

function createAnalysis(teamA, teamB) {
  const teamAStrongest = getStrongestArea(teamA);
  const teamBStrongest = getStrongestArea(teamB);

  const teamAWeakest = getWeakestArea(teamA);
  const teamBWeakest = getWeakestArea(teamB);

  const teamAHeatMap = createHeatMap(teamA);
  const teamBHeatMap = createHeatMap(teamB);

  return {
    teams: {
      teamA: teamA.name,
      teamB: teamB.name,
    },

    stats: {
      teamA: {
        attack: teamA.attack,
        midfield: teamA.midfield,
        defense: teamA.defense,
        form: teamA.form,
        style: teamA.style,
      },
      teamB: {
        attack: teamB.attack,
        midfield: teamB.midfield,
        defense: teamB.defense,
        form: teamB.form,
        style: teamB.style,
      },
    },

    diagram: [
      {
        label: "Attack",
        teamA: teamA.attack,
        teamB: teamB.attack,
      },
      {
        label: "Midfield",
        teamA: teamA.midfield,
        teamB: teamB.midfield,
      },
      {
        label: "Defense",
        teamA: teamA.defense,
        teamB: teamB.defense,
      },
    ],

    heatMap: {
      teamA: teamAHeatMap,
      teamB: teamBHeatMap,
    },

    tacticalComparison: {
      teamA: `${teamA.name} plays with a ${teamA.style.toLowerCase()} style. Their strongest area is ${teamAStrongest}.`,
      teamB: `${teamB.name} plays with a ${teamB.style.toLowerCase()} style. Their strongest area is ${teamBStrongest}.`,
    },

    defensiveWeaknesses: {
      teamA: `${teamA.name} may be exposed when opponents pressure their ${teamAWeakest}.`,
      teamB: `${teamB.name} may be exposed when opponents pressure their ${teamBWeakest}.`,
    },

    keyBattle: {
      title: `${teamAStrongest} vs ${teamBStrongest}`,
      explanation: `The key battle is how ${teamA.name}'s ${teamAStrongest} competes against ${teamB.name}'s ${teamBStrongest}. This matchup can decide which team controls the rhythm of the game.`,
    },

    pitchAnalysis: {
      summary: `${teamA.name} is expected to attack with strength through ${getMainZone(teamAHeatMap)}, while ${teamB.name} may focus on ${getMainZone(teamBHeatMap)}.`,
      teamAMainZone: getMainZone(teamAHeatMap),
      teamBMainZone: getMainZone(teamBHeatMap),
    },
  };
}

function getMainZone(heatMap) {
  const zones = [
    { name: "left side", value: heatMap.left },
    { name: "central areas", value: heatMap.center },
    { name: "right side", value: heatMap.right },
  ];

  return zones.sort((a, b) => b.value - a.value)[0].name;
}

module.exports = {
  createAnalysis,
};