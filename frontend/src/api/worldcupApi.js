const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function getTeams() {
  const response = await fetch(`${API_BASE_URL}/teams`);

  if (!response.ok) {
    throw new Error("Failed to fetch teams");
  }

  return response.json();
}

export async function predictMatch(teamA, teamB) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamA, teamB }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate prediction");
  }

  return response.json();
}

export async function getMatchAnalysis(teamA, teamB) {
  const response = await fetch(`${API_BASE_URL}/analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ teamA, teamB }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate analysis");
  }

  return response.json();
}
export async function getGroups() {
  const response = await fetch(`${API_BASE_URL}/groups`);

  if (!response.ok) {
    throw new Error("Failed to fetch groups");
  }

  return response.json();
}

export async function checkOfficialMatch(teamA, teamB) {
  const params = new URLSearchParams({
    teamA,
    teamB,
  });

  const response = await fetch(`${API_BASE_URL}/matches/check?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to check official match");
  }

  return response.json();
}