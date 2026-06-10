import { useEffect, useState } from "react";
import heroImage from "../../asessts/worldcup.png";
import "./index.css";
import {
  getTeams,
  predictMatch,
  getMatchAnalysis,
  getGroups
} from "./api/worldCupApi";
const getFlagUrl = (code) => `https://flagcdn.com/w80/${code}.png`;

const fallbackTeams = [
  {
    name: "USA",
    code: "us",
    summary: "Athletic, direct, and hard-working in transitions.",
    player: "Christian Pulisic",
    playerRole: "Wide creator",
    playerImage: "/assets/players/usa.png",
    attack: 74,
    defense: 72,
    midfield: 71,
    pace: 80,
    pressing: 73,
  },
  {
    name: "Mexico",
    code: "mx",
    summary: "Compact, energetic, and comfortable in possession.",
    player: "Santiago Giménez",
    playerRole: "Finisher",
    playerImage: "/assets/players/mexico.png",
    attack: 73,
    defense: 70,
    midfield: 74,
    pace: 72,
    pressing: 71,
  },
  {
    name: "Canada",
    code: "ca",
    summary: "Fast vertical attacks and strong wide running.",
    player: "Alphonso Davies",
    playerRole: "Transition threat",
    playerImage: "/assets/players/canada.png",
    attack: 75,
    defense: 69,
    midfield: 70,
    pace: 84,
    pressing: 72,
  },
  {
    name: "Argentina",
    code: "ar",
    summary: "Balanced and composed with elite decision making.",
    player: "Lionel Messi",
    playerRole: "Playmaker",
    playerImage: "/assets/players/argentina.png",
    attack: 86,
    defense: 82,
    midfield: 87,
    pace: 74,
    pressing: 78,
  },
  {
    name: "France",
    code: "fr",
    summary: "Explosive pace with elite attacking depth.",
    player: "Kylian Mbappé",
    playerRole: "Match winner",
    playerImage: "/assets/players/france.png",
    attack: 88,
    defense: 84,
    midfield: 83,
    pace: 92,
    pressing: 80,
  },
  {
    name: "Brazil",
    code: "br",
    summary: "Creative width and flair in the final third.",
    player: "Vinícius Júnior",
    playerRole: "Wing attacker",
    playerImage: "/assets/players/brazil.png",
    attack: 87,
    defense: 79,
    midfield: 84,
    pace: 89,
    pressing: 76,
  },
  {
    name: "Belgium",
    code: "be",
    summary: "Experienced, technical, and dangerous between the lines.",
    player: "Kevin De Bruyne",
    playerRole: "Chance creator",
    playerImage: "/assets/players/belgium.png",
    attack: 82,
    defense: 78,
    midfield: 84,
    pace: 76,
    pressing: 77,
  },
  {
    name: "Colombia",
    code: "co",
    summary: "Physical, confident, and sharp in attacking transitions.",
    player: "Luis Diaz",
    playerRole: "Wide attacker",
    playerImage: "/assets/players/colombia.png",
    attack: 80,
    defense: 77,
    midfield: 81,
    pace: 82,
    pressing: 78,
  },
  {
    name: "England",
    code: "gb-eng",
    summary: "Structured, powerful, and tactically disciplined.",
    player: "Jude Bellingham",
    playerRole: "All-action midfielder",
    playerImage: "/assets/players/england.png",
    attack: 83,
    defense: 83,
    midfield: 86,
    pace: 80,
    pressing: 81,
  },
  {
    name: "Croatia",
    code: "hr",
    summary: "Composed, experienced, and excellent at controlling tempo.",
    player: "Luka Modric",
    playerRole: "Tempo setter",
    playerImage: "/assets/players/croatia.png",
    attack: 77,
    defense: 79,
    midfield: 84,
    pace: 72,
    pressing: 76,
  },
  {
    name: "Germany",
    code: "de",
    summary: "Methodical build-up with compact defensive blocks.",
    player: "Florian Wirtz",
    playerRole: "Creator",
    playerImage: "/assets/players/germany.png",
    attack: 80,
    defense: 81,
    midfield: 82,
    pace: 77,
    pressing: 79,
  },
  {
    name: "Uruguay",
    code: "uy",
    summary: "Aggressive, vertical, and relentless in duels.",
    player: "Federico Valverde",
    playerRole: "Ball-winning runner",
    playerImage: "/assets/players/uruguay.png",
    attack: 79,
    defense: 80,
    midfield: 82,
    pace: 81,
    pressing: 84,
  },
  {
    name: "Spain",
    code: "es",
    summary: "Technical possession and patient control.",
    player: "Lamine Yamal",
    playerRole: "Wide technician",
    playerImage: "/assets/players/spain.png",
    attack: 81,
    defense: 80,
    midfield: 88,
    pace: 78,
    pressing: 82,
  },
  {
    name: "Portugal",
    code: "pt",
    summary: "Sharp attacking talent with strong finishing quality.",
    player: "Bruno Fernandes",
    playerRole: "Connector",
    playerImage: "/assets/players/portugal.png",
    attack: 84,
    defense: 79,
    midfield: 82,
    pace: 79,
    pressing: 78,
  },
  {
    name: "Netherlands",
    code: "nl",
    summary: "Compact structure and clean passing lanes.",
    player: "Virgil van Dijk",
    playerRole: "Defensive anchor",
    playerImage: "/assets/players/netherlands.png",
    attack: 79,
    defense: 85,
    midfield: 81,
    pace: 75,
    pressing: 77,
  },
  {
    name: "Morocco",
    code: "ma",
    summary: "Disciplined, resilient, and dangerous on the break.",
    player: "Achraf Hakimi",
    playerRole: "Right-side threat",
    playerImage: "/assets/players/morocco.png",
    attack: 76,
    defense: 82,
    midfield: 77,
    pace: 83,
    pressing: 79,
  },
];

const homeHosts = [
  { name: "USA", code: "us" },
  { name: "Mexico", code: "mx" },
  { name: "Canada", code: "ca" },
];

const homePages = [
  { id: "predict", label: "Predict Match" },
  { id: "analysis", label: "View Analysis" },
  { id: "about", label: "About Project" },
];

function normalizeTeam(team) {
  return {
    ...team,
    summary: team.summary ?? `${team.name} brings a balanced tactical profile into the matchup.`,
    player: team.player ?? team.dangerPlayer ?? "Key Player",
    playerRole: team.playerRole ?? "Danger player",
    playerImage: team.playerImage ?? `/assets/players/${team.name.toLowerCase()}.png`,
    attack: team.attack ?? 70,
    defense: team.defense ?? 70,
    midfield: team.midfield ?? 70,
    pace: team.pace ?? Math.round(((team.attack ?? 70) + (team.midfield ?? 70)) / 2),
    pressing: team.pressing ?? Math.round(((team.midfield ?? 70) + (team.defense ?? 70)) / 2),
  };
}

function getFlagEmojiFallback(code) {
  const map = {
    us: "🇺🇸",
    mx: "🇲🇽",
    ca: "🇨🇦",
    ar: "🇦🇷",
    fr: "🇫🇷",
    br: "🇧🇷",
    be: "🇧🇪",
    co: "🇨🇴",
    "gb-eng": "EN",
    hr: "🇭🇷",
    de: "🇩🇪",
    uy: "🇺🇾",
    es: "🇪🇸",
    pt: "🇵🇹",
    nl: "🇳🇱",
    ma: "🇲🇦",
  };

  return map[code] ?? "🏳️";
}

function App() {
  const [page, setPage] = useState("home");
  const [teams, setTeams] = useState(fallbackTeams.map(normalizeTeam));
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("A");
  const [teamA, setTeamA] = useState(normalizeTeam(fallbackTeams[1]));
  const [teamB, setTeamB] = useState(normalizeTeam(fallbackTeams[4]));

  useEffect(() => {
    async function loadTeams() {
      try {
        const groupsData = await getGroups();
        const backendGroups = groupsData.groups ?? [];

        if (backendGroups.length > 0) {
          const firstGroup = backendGroups[0];
          const firstGroupTeams = firstGroup.teams.map(normalizeTeam);

          setGroups(backendGroups);
          setSelectedGroup(firstGroup.group);
          setTeams(firstGroupTeams);
          setTeamA(firstGroupTeams[0]);
          setTeamB(firstGroupTeams[1] ?? firstGroupTeams[0]);
          return;
        }

        const data = await getTeams();
        const rawTeams = Array.isArray(data) ? data : data.teams ?? [];
        const backendTeams = rawTeams.map(normalizeTeam);

        if (backendTeams.length > 0) {
          setTeams(backendTeams);
          setTeamA(backendTeams[0]);
          setTeamB(backendTeams[1] ?? backendTeams[0]);
        }
      } catch (error) {
        console.error("Failed to load groups or teams from backend:", error);
      }
    }

    loadTeams();
  }, []);

  const matchup = {
  groups,
  selectedGroup,
  setSelectedGroup,
  teams,
  setTeams,
  teamA,
  teamB,
  setTeamA,
  setTeamB,
  };

  return (
    <div className="app-shell">
      <Navbar page={page} setPage={setPage} />
      <main className="page-shell">
        {page === "home" && <Home onNavigate={setPage} teamA={teamA} teamB={teamB} />}
        {page === "predict" && <PredictMatch matchup={matchup} />}
        {page === "analysis" && <AnalysisPage matchup={matchup} />}
        {page === "about" && <AboutPage />}
      </main>
    </div>
  );
}
  export default App;

function Navbar({ page, setPage }) {
  const links = [
    { id: "home", label: "Home" },
    { id: "predict", label: "Predict Match" },
    { id: "analysis", label: "Analysis" },
    { id: "about", label: "About" },
  ];

  return (
    <header className="navbar">
      <button type="button" className="brand" onClick={() => setPage("home")}>
        <span className="brand-main">WorldCup</span>
        <span className="brand-sub">match centre</span>
      </button>

      <nav className="nav-links" aria-label="Primary">
        {links.map((link) => (
          <button
            key={link.id}
            type="button"
            className={page === link.id ? "nav-link active" : "nav-link"}
            onClick={() => setPage(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

function Home({ onNavigate, teamA, teamB }) {
  return (
    <section className="home-layout">
      <div className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">World Cup 2026 Match Centre</p>
          <h1>Tournament predictions with a clean matchday feel.</h1>
          <p className="hero-text">
            Compare national teams, read a model scoreline, and move into tactical analysis.
          </p>
        </div>

        <div className="hero-media">
          <AssetImage
            src={heroImage}
            alt="World Cup 2026 logo"
            className="trophy-image"
            fallback={<LogoPlaceholder />}
          />

          <div className="host-strip" aria-label="Host countries">
            {homeHosts.map((host) => (
              <FlagImage key={host.code} code={host.code} name={host.name} compact />
            ))}
          </div>

          <div className="home-matchup" aria-label="Selected matchup">
            <TeamBadge team={teamA} />
            <span>vs</span>
            <TeamBadge team={teamB} />
          </div>

          <div className="hero-actions">
            {homePages.map((item) => (
              <Button
                key={item.id}
                variant={item.id === "predict" ? "gold" : item.id === "analysis" ? "navy" : "ghost"}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PredictMatch({ matchup }) {
  const {
    groups,
    selectedGroup,
    setSelectedGroup,
    setTeams,
    teams,
    teamA,
    teamB,
    setTeamA,
    setTeamB,
  } = matchup;
  const [prediction, setPrediction] = useState(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  const [predictionError, setPredictionError] = useState("");

  function handleGroupChange(groupName) {
    const groupData = groups.find((item) => item.group === groupName);

    if (!groupData) return;

    const groupTeams = groupData.teams.map(normalizeTeam);

    setSelectedGroup(groupName);
    setTeams(groupTeams);
    setTeamA(groupTeams[0]);
    setTeamB(groupTeams[1] ?? groupTeams[0]);
    setPrediction(null);
    setPredictionError("");
  }

  useEffect(() => {
   async function loadPrediction() {
  try {
    setLoadingPrediction(true);
    setPredictionError("");
    setPrediction(null);

    const data = await predictMatch(teamA.name, teamB.name);
    setPrediction(data.prediction);
  } catch (error) {
    console.error("Failed to generate prediction:", error);
    setPredictionError("Prediction is not available for this group-stage matchup.");
  } finally {
    setLoadingPrediction(false);
  }
}

    if (teamA?.name && teamB?.name && teamA.name !== teamB.name) {
      loadPrediction();
    }
  }, [teamA, teamB]);

  return (
    <section className="page-stack">
      <SectionTitle
        eyebrow="Prediction Desk"
        title="Predict Match"
        text="Choose a group, then select two teams from that group to generate a group-stage prediction."
      />

      <div className="match-row">
        <GroupSelector
          groups={groups}
          selectedGroup={selectedGroup}
          onChange={handleGroupChange}
        />

        <TeamSelector
          label="Team A"
          team={teamA}
          teams={teams}
          onChange={setTeamA}
          exclude={teamB.name}
        />

        <div className="vs-pill">VS</div>

        <TeamSelector
          label="Team B"
          team={teamB}
          teams={teams}
          onChange={setTeamB}
          exclude={teamA.name}
        />
      </div>
      <p className="match-helper-text">
        Group-stage predictions are limited to teams from the same World Cup group.
      </p>

      {loadingPrediction && <p className="loading-text">Generating group-stage prediction...</p>}

      {predictionError && <p className="error-text">{predictionError}</p>}

      {prediction && <PredictionResult teamA={teamA} teamB={teamB} prediction={prediction} />}
    </section>
  );
}

function TeamSelector({ label, team, teams, onChange, exclude }) {
  if (!team) {
    return null;
  }

  return (
    <div className="team-selector-card">
      <div className="card-head">
        {label ? <span className="section-label">{label}</span> : null}
      </div>

      <div className="team-compact">
        <FlagImage code={team.code} name={team.name} />

        <select
          className="team-select"
          value={team.name}
          onChange={(event) => onChange(teams.find((item) => item.name === event.target.value) ?? team)}
        >
          {teams.map((item) => (
            <option key={item.name} value={item.name} disabled={item.name === exclude && item.name !== team.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PredictionResult({ teamA, teamB, prediction }) {
  const favoriteTeam =
    prediction.probabilities.teamAWin >= prediction.probabilities.teamBWin
      ? teamA.name
      : teamB.name;
  const winGap = Math.abs(
    prediction.probabilities.teamAWin - prediction.probabilities.teamBWin
  );
  const outlookLabel =
    winGap <= 8 ? "Balanced outlook" : `${favoriteTeam} have the edge`;
  const drawState = prediction.probabilities.draw >= 26 ? "live" : "contained";

  return (
    <section className="result-shell">
      <div className="result-card">
        <div className="result-topline">
          <div className="result-summary">
            <span className="section-label">Match outlook</span>
            <h2>{outlookLabel}</h2>
            <p>
              {favoriteTeam} are projected to edge the matchup, while the draw
              is currently {drawState} based on the current model blend.
            </p>

            <div className="result-chips" aria-label="Probability summary">
              <span>{teamA.name} {prediction.probabilities.teamAWin}%</span>
              <span>Draw {prediction.probabilities.draw}%</span>
              <span>{teamB.name} {prediction.probabilities.teamBWin}%</span>
            </div>
          </div>

          <div className="confidence-box">
            <span>Confidence</span>
            <strong>{prediction.confidence}%</strong>
          </div>
        </div>

        <div className="prob-grid">
          <PredictionStatCard
            label={`${teamA.name} Win`}
            value={prediction.probabilities.teamAWin}
            flag={teamA.code}
            tone="team"
          />
          <PredictionStatCard label="Draw" value={prediction.probabilities.draw} tone="draw" />
          <PredictionStatCard
            label={`${teamB.name} Win`}
            value={prediction.probabilities.teamBWin}
            flag={teamB.code}
            tone="team"
          />
        </div>

        <div className="result-explanation">
          <span className="section-label">Model explanation</span>
          <p>{prediction.explanation}</p>
        </div>
      </div>
    </section>
  );
}

function AnalysisPage({ matchup }) {
  const {
    groups,
    selectedGroup,
    setSelectedGroup,
    setTeams,
    teams,
    teamA,
    teamB,
    setTeamA,
    setTeamB,
  } = matchup;
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  function handleGroupChange(groupName) {
    const groupData = groups.find((item) => item.group === groupName);

    if (!groupData) return;

    const groupTeams = groupData.teams.map(normalizeTeam);

    setSelectedGroup(groupName);
    setTeams(groupTeams);
    setTeamA(groupTeams[0]);
    setTeamB(groupTeams[1] ?? groupTeams[0]);
    setAnalysis(null);
    setAnalysisError("");
  }

  useEffect(() => {
    async function loadAnalysis() {
      try {
        setLoadingAnalysis(true);
        setAnalysisError("");

        const data = await getMatchAnalysis(teamA.name, teamB.name);
        setAnalysis(data.analysis);
      } catch (error) {
        console.error("Failed to generate analysis:", error);
        setAnalysisError("Analysis is not available right now.");
        setAnalysis(null);
      } finally {
        setLoadingAnalysis(false);
      }
    }

    if (teamA?.name && teamB?.name && teamA.name !== teamB.name) {
      loadAnalysis();
    }
  }, [teamA, teamB]);

  const teamAStats = analysis?.stats?.teamA ?? teamA;
  const teamBStats = analysis?.stats?.teamB ?? teamB;

  const attackBias = teamAStats.attack >= teamBStats.attack ? `${teamA.name} attack` : `${teamB.name} attack`;
  const midfieldBias = teamAStats.midfield >= teamBStats.midfield ? `${teamA.name} midfield` : `${teamB.name} midfield`;

  return (
    <section className="page-stack">
      <SectionTitle
        eyebrow="Match Analysis"
        title={`${teamA.name} vs ${teamB.name}`}
        text="A compact scouting view for team strengths, control zones, and the tactical pressure points that can decide the match."
      />

      <div className="match-row analysis-row">
        <GroupSelector
          groups={groups}
          selectedGroup={selectedGroup}
          onChange={handleGroupChange}
        />

        <TeamSelector
          label="Team A"
          team={teamA}
          teams={teams}
          onChange={setTeamA}
          exclude={teamB.name}
        />

        <div className="vs-pill">VS</div>

        <TeamSelector
          label="Team B"
          team={teamB}
          teams={teams}
          onChange={setTeamB}
          exclude={teamA.name}
        />
      </div>

      {loadingAnalysis && <p className="loading-text">Loading analysis...</p>}
      {analysisError && <p className="error-text">{analysisError}</p>}

      <div className="analysis-grid">
        <div className="content-card">
          <span className="section-label">Team comparison stats</span>
          <div className="stats-stack">
            <StatBar label="Attack" left={teamAStats.attack} right={teamBStats.attack} />
            <StatBar label="Defense" left={teamAStats.defense} right={teamBStats.defense} />
            <StatBar label="Midfield" left={teamAStats.midfield} right={teamBStats.midfield} />
            <StatBar label="Pace" left={teamA.pace} right={teamB.pace} />
          </div>
        </div>

        <div className="content-card radar-card">
          <span className="section-label">Team profile radar</span>
          <RadarPlaceholder teamA={teamA} teamB={teamB} diagram={analysis?.diagram} />
        </div>
      </div>

      <div className="content-card">
        <span className="section-label">Tactical notes</span>

        {analysis ? (
          <>
            <p>{analysis.tacticalComparison.teamA}</p>
            <p>{analysis.tacticalComparison.teamB}</p>
            <p>
              Key battle: <strong>{analysis.keyBattle.title}</strong>. {analysis.keyBattle.explanation}
            </p>
          </>
        ) : (
          <>
            <p>
              The match is likely to tilt toward {attackBias} in the final third and {midfieldBias} in possession phases.
            </p>
            <p>
              Key battle: {teamA.player} against {teamB.name.toLowerCase()}’s defensive line.
            </p>
          </>
        )}
      </div>

      <div className="pitch-card">
        <span className="section-label">Football pitch analysis</span>
        <PitchAnalysis teamA={teamA} teamB={teamB} heatMap={analysis?.heatMap} />
        <p className="card-footnote">
          {analysis?.pitchAnalysis?.summary ??
            "Attack zones are shown as simple visual bands, with markers for defensive weakness and direct routes forward."}
        </p>
      </div>
    </section>
  );
}

function PitchAnalysis({ teamA, teamB, heatMap }) {
  const teamAHeat = heatMap?.teamA ?? {
    left: teamA.pace,
    center: teamA.midfield,
    right: teamA.attack,
  };

  const teamBHeat = heatMap?.teamB ?? {
    left: teamB.pace,
    center: teamB.midfield,
    right: teamB.attack,
  };

  const zones = [
    {
      id: "left",
      title: "Left channel",
      team: teamA.name,
      value: teamAHeat.left,
      description: "Wide attack",
    },
    {
      id: "center",
      title: "Central zone",
      team: "Shared control",
      value: Math.round((teamAHeat.center + teamBHeat.center) / 2),
      description: "Midfield control",
    },
    {
      id: "right",
      title: "Right channel",
      team: teamB.name,
      value: teamBHeat.right,
      description: "Counter space",
    },
  ];

  const strongestZone = zones.reduce((best, zone) =>
    zone.value > best.value ? zone : best
  );

  const teamARisk =
    teamA.defense < teamB.attack
      ? `${teamA.name} defensive risk`
      : `${teamA.name} stable`;

  const teamBRisk =
    teamB.defense < teamA.attack
      ? `${teamB.name} defensive risk`
      : `${teamB.name} stable`;

  return (
    <div className="pitch-analysis">
      <div className="pitch-surface enhanced-pitch">
        <div className="pitch-outline" />
        <div className="pitch-halfway" />
        <div className="pitch-center-circle" />

        {zones.map((zone) => (
          <div
            key={zone.id}
            className={`heat-zone heat-zone-${zone.id}`}
            style={{
              opacity: 0.35 + zone.value / 160,
            }}
          >
            <div className="heat-zone-content">
              <span>{zone.title}</span>
              <strong>{zone.value}%</strong>
              <small>{zone.description}</small>
              <em>{zone.team}</em>
            </div>
          </div>
        ))}

        <div className="pitch-risk pitch-risk-left">{teamARisk}</div>
        <div className="pitch-risk pitch-risk-right">{teamBRisk}</div>
      </div>

      <div className="pitch-summary-grid">
        <div>
          <span className="section-label">Strongest zone</span>
          <strong>{strongestZone.title}</strong>
          <p>
            {strongestZone.team} shows the highest attacking influence in this
            area.
          </p>
        </div>

        <div>
          <span className="section-label">Defensive pressure</span>
          <strong>
            {teamA.defense < teamB.attack ? teamA.name : teamB.name}
          </strong>
          <p>
            The marker highlights the side more likely to face pressure based on
            the opponent attack rating.
          </p>
        </div>
      </div>
    </div>
  );
}


function AboutPage() {
  return (
    <section className="page-stack about-page">
      <SectionTitle
        eyebrow="About"
        title="About Project"
        text="A professional World Cup prediction and tactical analysis website built with a React frontend and Express backend."
      />

      <div className="text-block">
        <h2>Who I am</h2>
        <p>
          I am building this project as a football prediction and analysis platform focused on the World Cup. The goal is to create a clean,
          professional website that allows users to explore match predictions, compare teams, and understand tactical strengths in a simple way.
        </p>

        <h2>What this project does</h2>
        <p>
          The website lets users choose two World Cup teams and checks whether the matchup exists in the official tournament schedule. If the
          matchup is valid, the system generates a predicted score, win/draw/loss probabilities, confidence level, and a short football-based
          explanation.
        </p>

        <h2>Data and team structure</h2>
        <p>
          The project uses a 48-team World Cup dataset in the backend. Each team includes attack, midfield, defense, recent form, playing style,
          group information, and a danger player profile. The backend also includes match schedule validation so predictions are only shown for
          scheduled World Cup matchups.
        </p>

        <h2>Prediction system</h2>
        <p>
          The prediction engine is a rule-based model that compares team attack, midfield, defense, form, and playing style. It is designed for
          project demonstration and football analysis, not for betting or gambling. The model can later be improved with real historical statistics,
          live match data, and machine learning.
        </p>

        <h2>Tactical analysis</h2>
        <p>
          The analysis page includes team comparison stats, a radar-style profile chart, tactical notes, and a pitch heat map. The heat map shows
          left, central, and right attacking influence zones based on team strengths and defensive pressure.
        </p>

        <h2>Current limitations</h2>
        <p>
          The current system uses estimated team ratings and available free data sources. Some live 2026 World Cup data may be limited depending on
          free API access. Because of that, the project includes local fallback data so the website continues working during demos.
        </p>

        <h2>Future improvements</h2>
        <p>
          Future versions can add live fixture updates, real match statistics, player availability, injuries, current form, API-based standings,
          and a trained machine learning model for stronger prediction accuracy.
        </p>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <header className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="subtitle">{text}</p>
    </header>
  );
}

function Button({ variant = "ghost", children, ...props }) {
  return (
    <button type="button" className={`button button-${variant}`} {...props}>
      {children}
    </button>
  );
}

function TeamBadge({ team }) {
  return (
    <div className="team-badge">
      <FlagImage code={team.code} name={team.name} compact />
      <span>{team.name}</span>
    </div>
  );
}

function PredictionStatCard({ label, value, flag, tone }) {
  return (
    <div className={tone === "draw" ? "prediction-stat prediction-stat-draw" : "prediction-stat"}>
      <div className="prediction-stat-head">
        {flag ? <FlagImage code={flag} name={label} compact /> : null}
        <span>{label}</span>
      </div>
      <strong>{value}%</strong>
      <div className="prediction-bar" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function FlagImage({ code, name, compact = false }) {
  const fallback = getFlagEmojiFallback(code);

  return (
    <span className={compact ? "flag-image flag-compact" : "flag-image"}>
      <img
        src={getFlagUrl(code)}
        alt={`${name} flag`}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          const parent = event.currentTarget.parentElement;
          if (parent && !parent.querySelector(".flag-fallback")) {
            const fallbackNode = document.createElement("span");
            fallbackNode.className = "flag-fallback";
            fallbackNode.textContent = fallback;
            parent.appendChild(fallbackNode);
          }
        }}
      />
    </span>
  );
}

function AssetImage({ src, alt, className, fallback }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return fallback;
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function LogoPlaceholder() {
  return (
    <div className="logo-placeholder">
      <div className="logo-trophy">🏆</div>
      <p>World Cup 2026</p>
    </div>
  );
}

function StatBar({ label, left, right }) {
  const total = left + right;
  const leftPercent = Math.round((left / total) * 100);
  const rightPercent = 100 - leftPercent;

  return (
    <div className="stat-bar">
      <div className="stat-bar-labels">
        <span>{label}</span>
        <strong>
          {left} - {right}
        </strong>
      </div>
      <div className="bar-track">
        <span className="bar-left" style={{ width: `${leftPercent}%` }} />
        <span className="bar-right" style={{ width: `${rightPercent}%` }} />
      </div>
    </div>
  );
}

function RadarPlaceholder({ teamA, teamB, diagram }) {
  const getDiagramValue = (label, side, fallback) => {
    const item = diagram?.find((row) => row.label.toLowerCase() === label.toLowerCase());
    return item ? item[side] : fallback;
  };

  const stats = [
    {
      label: "Attack",
      a: getDiagramValue("Attack", "teamA", teamA.attack),
      b: getDiagramValue("Attack", "teamB", teamB.attack),
    },
    {
      label: "Midfield",
      a: getDiagramValue("Midfield", "teamA", teamA.midfield),
      b: getDiagramValue("Midfield", "teamB", teamB.midfield),
    },
    {
      label: "Defense",
      a: getDiagramValue("Defense", "teamA", teamA.defense),
      b: getDiagramValue("Defense", "teamB", teamB.defense),
    },
    {
      label: "Pace",
      a: teamA.pace,
      b: teamB.pace,
    },
  ];

  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = (value / 100) * 120;

    return {
      x: 150 + Math.cos(angle) * radius,
      y: 150 + Math.sin(angle) * radius,
    };
  };

  const createPolygonPoints = (side) =>
    stats
      .map((stat, index) => {
        const point = getPoint(stat[side], index, stats.length);
        return `${point.x},${point.y}`;
      })
      .join(" ");

  return (
    <div className="radar-placeholder">
      <svg viewBox="0 0 300 300" className="radar-svg" role="img" aria-label="Team radar comparison">
        {[30, 60, 90, 120].map((radius) => (
          <circle
            key={radius}
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
        ))}

        {stats.map((stat, index) => {
          const end = getPoint(100, index, stats.length);

          return (
            <g key={stat.label}>
              <line
                x1="150"
                y1="150"
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              <text
                x={end.x}
                y={end.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#d8d8d8"
                fontSize="13"
                fontWeight="700"
              >
                {stat.label}
              </text>
            </g>
          );
        })}

        <polygon
          points={createPolygonPoints("a")}
          fill="rgba(212, 175, 55, 0.28)"
          stroke="#d4af37"
          strokeWidth="3"
        />

        <polygon
          points={createPolygonPoints("b")}
          fill="rgba(66, 133, 244, 0.22)"
          stroke="#4f8cff"
          strokeWidth="3"
        />

        <circle cx="150" cy="150" r="3" fill="#ffffff" />
      </svg>

      <div className="radar-legend">
        <span>
          <i className="legend-dot gold-dot" /> {teamA.name}
        </span>
        <span>
          <i className="legend-dot blue-dot" /> {teamB.name}
        </span>
      </div>
    </div>
  );
}
function GroupSelector({ groups, selectedGroup, onChange }) {
  return (
    <div className="team-selector-card">
      <div className="card-head">
        <span className="section-label">Group</span>
      </div>

      <select
        className="team-select"
        value={selectedGroup}
        onChange={(event) => onChange(event.target.value)}
      >
        {groups.map((group) => (
          <option key={group.group} value={group.group}>
            Group {group.group}
          </option>
        ))}
      </select>
    </div>
  );
}