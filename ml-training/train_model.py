import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

DATA_PATH = "ml-training/combined_training_matches.csv"
MODEL_PATH = "backend/ml/trained_result_model.joblib"


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


def main():
    data = pd.read_csv(DATA_PATH)

    X = data[FEATURE_COLUMNS]
    y = data["result"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
        stratify=y
       )

    model = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "classifier",
                LogisticRegression(
                    max_iter=1000,
                    
                ),
            ),
        ]
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print("Model training complete")
    print(f"Accuracy: {accuracy:.2f}")
    print()
    print("Classification report:")
    print(classification_report(y_test, predictions))

    joblib.dump(model, MODEL_PATH)

    print()
    print(f"Model saved to: {MODEL_PATH}")


if __name__ == "__main__":
    main()