from pathlib import Path
import json

import numpy as np
import pandas as pd
from state_key import build_state_key

PATH = Path(__file__).resolve().parents[1] / "data" / "processed" / "states.parquet"
OUT_PATH = Path(__file__).resolve().parents[1] / "docs" / "data" / "win_expectancy.json"

def load_states(path) -> pd.DataFrame:
    df = pd.read_parquet(path)
    return df

def tally(df) -> dict[str, dict[str, int]]:
    """Count how often each game state occurs and how often the home team won from it.

    Args:
        df: One row per play, with columns inning, half, outs, bases,
            score_diff and home_win (bool).

    Returns:
        A dict keyed by state key (e.g. "6|B|2|010|-2"), each mapping to
        {"occurrences": int, "home_wins": int}. score_diff is capped at
        ±10 first, so all blowouts share one key.
    """
    FIELDS = ["inning", "half", "outs", "bases", "score_diff"]

    df = df.copy()

    df["score_diff"] = np.where(df["score_diff"] > 10, 10, df["score_diff"])
    df["score_diff"] = np.where(df["score_diff"] < -10, -10, df["score_diff"])

    # Group equivalent FIELDS, attaching their corresponding occurrences and home_wins
    groups = df.groupby(FIELDS, as_index=False).agg(
        occurrences=("home_win", "size"),
        home_wins=("home_win", "sum")
    )

    groups["state_key"] = [build_state_key(**row) for row in groups[FIELDS].to_dict("records")] # "records" makes list of row dictionaries

    return groups.set_index("state_key")[["occurrences", "home_wins"]].to_dict(orient="index")

def write_table(table, path) -> None:
    with open(path, "w") as file:
        json.dump(table, file)
    return

def main() -> None:
    df = load_states(PATH)
    tallied = tally(df)
    write_table(tallied, OUT_PATH)
    return

if __name__ == "__main__":
    main()