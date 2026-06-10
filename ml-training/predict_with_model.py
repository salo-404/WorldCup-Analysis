import json
import sys
import joblib
import pandas as pd


RESULT_MODEL_PATH = "backend/ml/trained_result_model.joblib"
SCORE_MODEL_PATH = "backend/ml/trained_score_model.joblib"

FEATURE_COLUMNS = [
    "teamAAttack",
    "teamAMidfield",
    "teamADefense",
    "teamAFormScore",
    "teamAStrength",
    "teamBAttack",
    "teamBMidfield",
    "teamBDefense",
    "teamBFormScore",
    "teamBStrength",
]


def normalize_score(value):
    value = round(float(value))
    return max(0, min(5, value))


def main():
    try:
        raw_input = sys.stdin.read()
        features = json.loads(raw_input)

        input_data = pd.DataFrame(
            [
                {
                    column: features[column]
                    for column in FEATURE_COLUMNS
                }
            ]
        )

        result_model = joblib.load(RESULT_MODEL_PATH)

        predicted_class = result_model.predict(input_data)[0]
        probabilities = result_model.predict_proba(input_data)[0]
        classes = result_model.classes_

        probability_map = {
            class_name: round(float(probability) * 100)
            for class_name, probability in zip(classes, probabilities)
        }

        score_model = joblib.load(SCORE_MODEL_PATH)
        result = {
            "predictedClass": predicted_class,
            "probabilities": {
                "teamAWin": probability_map.get("teamAWin", 0),
                "draw": probability_map.get("draw", 0),
                "teamBWin": probability_map.get("teamBWin", 0),
            },
            "model": {
                "type": "Python scikit-learn hybrid model",
                "resultModel": "Logistic Regression classifier",
                "scoreModel": "Random Forest regression model",
                "source": [
                    "trained_result_model.joblib",
                    "trained_score_model.joblib",
                ],
            },
        }

        print(json.dumps(result))

    except Exception as error:
        print(json.dumps({"error": str(error)}))
        sys.exit(1)


if __name__ == "__main__":
    main()