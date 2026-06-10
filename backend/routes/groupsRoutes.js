const express = require("express");
const teams = require("../data/teams");

const router = express.Router();

router.get("/", (req, res) => {
  const groupsMap = new Map();

  teams.forEach((team) => {
    const groupName = team.group || "Ungrouped";

    if (!groupsMap.has(groupName)) {
      groupsMap.set(groupName, []);
    }

    groupsMap.get(groupName).push(team);
  });

  const groups = Array.from(groupsMap.entries()).map(([group, groupTeams]) => ({
    group,
    teams: groupTeams,
  }));

  groups.sort((a, b) => a.group.localeCompare(b.group));

  res.json({
    count: groups.length,
    groups,
  });
});

router.get("/:groupName", (req, res) => {
  const groupName = req.params.groupName.toUpperCase();

  const groupTeams = teams.filter(
    (team) => String(team.group).toUpperCase() === groupName
  );

  if (groupTeams.length === 0) {
    return res.status(404).json({
      error: "Group not found",
    });
  }

  res.json({
    group: groupName,
    teams: groupTeams,
  });
});

module.exports = router;