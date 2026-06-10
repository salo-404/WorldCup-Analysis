import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error


DATA_PATH = "ml-training/real_training_matches.csv"
MODEL_PATH = "backend/ml/trained_score_model.joblib"

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

TARGET_COLUMNS = [
    "teamAScore",
    "teamBScore",
]


def main():
    data = pd.read_csv(DATA_PATH)

    data = data.dropna(subset=FEATURE_COLUMNS + TARGET_COLUMNS)

    X = data[FEATURE_COLUMNS]
    y = data[TARGET_COLUMNS]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.25,
        random_state=42,
    )

    model = Pipeline(
        steps=[
            ("scaler", StandardScaler()),
            (
                "regressor",
                MultiOutputRegressor(
                    RandomForestRegressor(
                        n_estimators=300,
                        random_state=42,
                        max_depth=5,
                        min_samples_leaf=2,
                    )
                ),
            ),
        ]
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)

    print("Score model training complete")
    print("-----------------------------")
    print(f"Mean Absolute Error: {mae:.2f} goals")
    print()
    print("Sample predictions:")

    for index in range(min(5, len(predictions))):
        actual_a = y_test.iloc[index]["teamAScore"]
        actual_b = y_test.iloc[index]["teamBScore"]
        pred_a = predictions[index][0]
        pred_b = predictions[index][1]

        print(
            f"Actual: {actual_a}-{actual_b} | "
            f"Predicted raw: {pred_a:.2f}-{pred_b:.2f}"
        )

    joblib.dump(model, MODEL_PATH)

    print()
    print(f"Score model saved to: {MODEL_PATH}")


if __name__ == "__main__":
    main()