# WorldCup Analysis

A full-stack World Cup 2026 prediction and tactical analysis platform built with a React frontend, Express backend, and Python machine learning models.

The project allows users to select a World Cup group, choose two teams from that group, and generate a model-based match prediction including predicted score, win/draw/loss probabilities, confidence level, and tactical analysis.

Live website demo: https://world-cup-analysis-tau.vercel.app/


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

GitHub:

```text
https://github.com/salo-404/WorldCup-Analysis
```
