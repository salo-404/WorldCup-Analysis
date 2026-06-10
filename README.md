# WorldCup Analysis

A full-stack World Cup 2026 prediction and tactical analysis platform built with a React frontend, Express backend, and Python machine learning models.

The project allows users to select a World Cup group, choose two teams from that group, and generate a model-based match prediction including predicted score, win/draw/loss probabilities, confidence level, and tactical analysis.

Live frontend: https://world-cup-analysis-tau.vercel.app/
Live backend: https://salo-worldcup-analysis-backend.onrender.com

---

## Project Overview

WorldCup Analysis is designed as a professional football prediction dashboard for the FIFA World Cup 2026.

The system combines:

* A React/Vite frontend for the user interface
* An Express.js backend API
* Local World Cup team and group data
* Python scikit-learn machine learning models
* Tactical analysis logic
* Group-stage prediction rules

The goal of the project is not to provide betting advice. It is an educational and analytical football project that demonstrates how match prediction systems can combine team ratings, statistical features, machine learning, and tactical explanation.

---

## Main Features

### Group-Based Match Prediction

Users first choose a World Cup group, then select two teams from that group.

This keeps the prediction system realistic for the group stage because users cannot randomly select impossible group-stage matchups from all 48 teams.

Current flow:

```text
Choose Group
→ Choose Team A
→ Choose Team B
→ Generate Prediction
```

Later, the system can be extended round by round:

```text
Group Stage
→ Round of 32
→ Round of 16
→ Quarterfinals
→ Semifinals
→ Final
```

---

### Prediction Output

For each match, the system generates:

* Predicted score
* Team A win probability
* Draw probability
* Team B win probability
* Model confidence
* Football-based explanation
* Tactical comparison

Example output:

```text
France 2 - 1 Mexico
France win: 64%
Draw: 20%
Mexico win: 16%
Confidence: 74%
```

---

### Tactical Analysis

The analysis page includes:

* Team comparison stats
* Attack, defense, midfield, and pace comparison
* Radar-style team profile chart
* Tactical notes
* Key battle explanation
* Football pitch analysis
* Heat-map style attacking zones

The pitch analysis shows:

* Left channel influence
* Central zone control
* Right channel influence
* Defensive pressure indicators

---

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Vercel deployment

### Backend

* Node.js
* Express.js
* CommonJS modules
* CORS
* dotenv
* Render deployment

### Machine Learning

* Python
* pandas
* scikit-learn
* joblib
* Logistic Regression classifier
* Random Forest regression model

---

## Project Structure

```text
WorldCup-Analysis/
├── backend/
│   ├── data/
│   │   ├── teams.js
│   │   └── matches2026Fallback.js
│   ├── ml/
│   │   ├── featureBuilder.js
│   │   ├── modelEngine.js
│   │   ├── modelExplanation.js
│   │   ├── pythonModelService.js
│   │   ├── trained_result_model.joblib
│   │   └── trained_score_model.joblib
│   ├── routes/
│   │   ├── analysisRoutes.js
│   │   ├── apiTestRoutes.js
│   │   ├── groupsRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── predictRoutes.js
│   │   └── teamsRoutes.js
│   ├── services/
│   │   ├── footballApiService.js
│   │   └── worldCup2026Service.js
│   ├── utils/
│   │   ├── analysisEngine.js
│   │   └── predictionEngine.js
│   ├── package.json
│   ├── requirements.txt
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── worldcupApi.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── ml-training/
│   ├── collect_real_matches.js
│   ├── combine_training_data.js
│   ├── generate_training_csv.js
│   ├── predict_with_model.py
│   ├── train_model.py
│   ├── train_score_model.py
│   ├── training_matches.csv
│   ├── real_training_matches.csv
│   └── combined_training_matches.csv
│
├── asessts/
│   └── worldcup.png
│
├── .gitignore
└── README.md
```

---

## Backend API

The backend is deployed on Render:

```text
https://salo-worldcup-analysis-backend.onrender.com
```

### Health Check

```http
GET /api/health
```

Returns backend status and checks whether the API key is loaded.

Example:

```json
{
  "status": "ok",
  "message": "Backend API is working",
  "apiKeyLoaded": true
}
```

---

### Get Teams

```http
GET /api/teams
```

Returns the local World Cup team dataset.

Each team includes:

* Name
* Country code
* Group
* Attack rating
* Midfield rating
* Defense rating
* Form
* Style
* Danger player

---

### Get Groups

```http
GET /api/groups
```

Returns teams grouped by World Cup group.

Example structure:

```json
{
  "count": 12,
  "groups": [
    {
      "group": "A",
      "teams": [...]
    }
  ]
}
```

---

### Get One Group

```http
GET /api/groups/:groupName
```

Example:

```http
GET /api/groups/A
```

Returns only the teams in Group A.

---

### Predict Match

```http
POST /api/predict
```

Request body:

```json
{
  "teamA": "Mexico",
  "teamB": "South Africa"
}
```

Response includes:

```json
{
  "source": "ml-calibrated-prediction-engine",
  "cached": false,
  "prediction": {
    "teams": {
      "teamA": "Mexico",
      "teamB": "South Africa"
    },
    "probabilities": {
      "teamAWin": 42,
      "draw": 30,
      "teamBWin": 28
    },
    "predictedScore": {
      "teamA": 1,
      "teamB": 1,
      "display": "Mexico 1 - 1 South Africa"
    },
    "confidence": 58,
    "explanation": "...",
    "model": {
      "activeModel": "python-trained-model"
    }
  }
}
```

The backend validates that both teams belong to the same group for group-stage prediction.

---

### Match Analysis

```http
POST /api/analysis
```

Request body:

```json
{
  "teamA": "Mexico",
  "teamB": "South Africa"
}
```

Returns tactical analysis including team stats, comparison notes, key battles, and heat-map data.

---

## Machine Learning System

The project uses a hybrid prediction system.

### Result Prediction Model

The result model predicts:

```text
Team A win
Draw
Team B win
```

It uses a Python scikit-learn Logistic Regression classifier.

Input features include:

* Team A attack
* Team A midfield
* Team A defense
* Team A form score
* Team A strength
* Team B attack
* Team B midfield
* Team B defense
* Team B form score
* Team B strength

The trained result model is stored at:

```text
backend/ml/trained_result_model.joblib
```

---

### Score Prediction Model

The score model predicts:

```text
Team A goals
Team B goals
```

It uses a Random Forest regression model.

The trained score model is stored at:

```text
backend/ml/trained_score_model.joblib
```

The backend uses the predicted raw goals and normalizes them into a realistic football scoreline.

---

### Score Alignment

The project also aligns the predicted score with the final predicted outcome.

Example:

```text
If the highest probability is draw,
the displayed score should be 1-1 or 2-2.

If Team A has the highest win probability,
Team A's score should be higher.

If Team B has the highest win probability,
Team B's score should be higher.
```

This makes the dashboard output more consistent and professional.

---

### Prediction Cache

The backend includes an in-memory prediction cache.

This means that if the same match is predicted more than once, the backend can return the previous prediction faster.

Example:

```json
{
  "cached": true
}
```

This is useful because the Python model can take time to start, especially on free hosting.

---

## ML Training Data

The project includes training files in:

```text
ml-training/
```

### Generated Training Dataset

```text
training_matches.csv
```

This dataset was generated from the local 48-team ratings.

### Real API Dataset

```text
real_training_matches.csv
```

This dataset was collected from real World Cup match data.

### Combined Dataset

```text
combined_training_matches.csv
```

This combines generated data with real match data.

The result model was trained on combined data, while the score model was trained from real score data.

---

## Running the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/salo-404/WorldCup-Analysis.git
cd WorldCup-Analysis
```

---

## Backend Setup

Go to the backend folder:

```bash
cd backend
```

Install Node dependencies:

```bash
npm install
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
FOOTBALL_API_KEY=your_api_key_here
FOOTBALL_API_HOST=v3.football.api-sports.io
WORLD_CUP_2026_API_URL=https://worldcup26.ir
PYTHON_COMMAND=python
```

Start the backend:

```bash
npm run dev
```

Or:

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open a second terminal.

Go to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a frontend `.env` file if needed:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on the Vite local URL, usually:

```text
http://localhost:5173
```

---

## Deployment

### Backend Deployment

The backend is deployed on Render.

Important Render settings:

```text
Root Directory: backend
Build Command: npm install && pip install -r requirements.txt
Start Command: npm start
```

Render environment variables:

```env
FOOTBALL_API_KEY=your_api_key
FOOTBALL_API_HOST=v3.football.api-sports.io
WORLD_CUP_2026_API_URL=https://worldcup26.ir
PYTHON_COMMAND=python3
```

Deployed backend:

```text
https://salo-worldcup-analysis-backend.onrender.com
```

---

### Frontend Deployment

The frontend is deployed on Vercel.

Important Vercel settings:

```text
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Vercel environment variable:

```env
VITE_API_BASE_URL=https://salo-worldcup-analysis-backend.onrender.com/api
```

Deployed frontend:

```text
https://world-cup-analysis-tau.vercel.app/
```

---

## Important Deployment Notes

The Render backend is on a free instance.

Free Render services can spin down after inactivity. Because of that, the first request after inactivity may take longer than normal.

After the backend wakes up, predictions should become faster.

---

## Current Limitations

This project is a prediction and analysis demo, not an official forecasting system.

Current limitations:

* Team ratings are estimated and project-based
* Some data is generated for model training
* Real score training data is limited
* Free API access may limit live football data
* Render free hosting can cause cold starts
* The score model is not production-grade
* Predictions should not be used for betting

---

## Future Improvements

Planned improvements include:

* Round of 32 prediction mode
* Round of 16 prediction mode
* Quarterfinal, semifinal, and final simulation
* Qualified teams flow after group-stage results
* More real historical match data
* Player injuries and availability
* Recent team form from live APIs
* Real match statistics
* Better score prediction model
* Tournament bracket simulation
* Improved mobile UI
* Admin panel for updating qualified teams

---

## Disclaimer

This project is for educational and analytical purposes only.

It is not affiliated with FIFA, the FIFA World Cup, or any official football organization.

The predictions are model-based estimates and should not be treated as guaranteed outcomes or betting advice.

---

## Author

Built by Salman Budiab.

GitHub:

```text
https://github.com/salo-404/WorldCup-Analysis
```
