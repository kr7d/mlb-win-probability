from pathlib import Path

import numpy as np
import pandas as pd

IN_PATH = Path(__file__).resolve().parents[1] / "data" / "raw" / "2025plays.csv"
OUT_PATH = Path(__file__).resolve().parents[1] / "data" / "processed" / "states.parquet"
COLS = ["gid", "event", "inning", "top_bot", "score_v", "score_h", "outs_pre", "br1_pre", "br2_pre", "br3_pre", "runs"]

def load_plays(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path, usecols=COLS, engine="pyarrow")
    return df

def drop_no_plays(df: pd.DataFrame) -> pd.DataFrame:
    df = df[df["event"] != "NP"]
    return df

# label whether each state resulted in the home team winning
def label_results(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    last_event = df.groupby("gid").tail(1).copy()

    last_event["home_final"] = last_event["score_h"]
    last_event.loc[last_event["top_bot"] == 1, "home_final"] = last_event["home_final"] + last_event["runs"]
    last_event["away_final"] = last_event["score_v"]
    last_event.loc[last_event["top_bot"] == 0, "away_final"] = last_event["away_final"] + last_event["runs"]

    last_event["home_win"] = "lost"
    last_event.loc[last_event["home_final"] > last_event["away_final"], "home_win"] = "won"
    last_event.loc[last_event["home_final"] == last_event["away_final"], "home_win"] = "tied" # Flag games that are tied for removal

    # Map df home_win column to last_event home_win column via gid
    df["home_win"] = df["gid"].map(last_event.set_index("gid")["home_win"])
    df = df[df["home_win"] != "tied"]
    df["home_win"] = df["home_win"] == "won"
    
    return df

# reshape df to match the structure expected by functions that will use this df
def to_states(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df.rename(columns={"outs_pre": "outs"})

    df.loc[df["top_bot"] == 0, "half"] = "T"
    df.loc[df["top_bot"] == 1, "half"] = "B"
    df["score_diff"] = df["score_h"] - df["score_v"]

    df["bases"] = np.where(df["br1_pre"].notna(), "1", "0")
    df["bases"] = df["bases"] + np.where(df["br2_pre"].notna(), "1", "0")
    df["bases"] = df["bases"] + np.where(df["br3_pre"].notna(), "1", "0")

    return df[["gid", "inning", "half", "outs", "bases", "score_diff", "home_win"]]

def main() -> None:
    df = load_plays(IN_PATH)
    df = drop_no_plays(df)
    df = label_results(df)
    df = to_states(df)
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True) # Create folder if it doesn't exist
    df.to_parquet(OUT_PATH, index=False)

if __name__ == "__main__":
    main()