import json
from pathlib import Path

import pytest
import pandas as pd
from build_tables import tally

CASES_PATH = Path(__file__).resolve().parent / "tally_cases.json"
CASES = json.loads(CASES_PATH.read_text())["cases"]

@pytest.mark.parametrize("case", CASES, ids=[c["name"] for c in CASES])
def test_valid(case):
    df = pd.DataFrame(case["input"])
    result = tally(df)

    assert result == case["expected"]
    assert sum(v["occurrences"] for v in result.values()) == len(df)
    assert sum(v["home_wins"] for v in result.values()) == df["home_win"].sum()