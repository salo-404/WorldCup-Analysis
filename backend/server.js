const express = require("express");
const matchesRoutes = require("./routes/matchRoutes");
const groupsRoutes = require("./routes/groupsRoutes");

const cors = require("cors");
require("dotenv").config();

const teamsRoutes = require("./routes/teamsRoutes");
const predictRoutes = require("./routes/predictRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const apiTestRoutes = require("./routes/apiTestRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://world-cup-analysis-tau.vercel.app",
      "http://localhost:5173",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/teams", teamsRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/predict", predictRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/test", apiTestRoutes);
app.use("/api/matches", matchesRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "World Cup backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend API is working",
    apiKeyLoaded: Boolean(process.env.FOOTBALL_API_KEY),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});