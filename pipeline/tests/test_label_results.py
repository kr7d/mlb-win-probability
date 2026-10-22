import json
from pathlib import Path

import pytest
import pandas as pd
from parse_events import label_results

CASES_PATH = Path(__file__).resolve().parent / "label_results_cases.json"
CASES = json.loads(CASES_PATH.read_text())["cases"]

@pytest.mark.parametrize("case", CASES, ids=[c["name"] for c in CASES])
def test_valid(case):
    df = pd.DataFrame(case["plays"])
    result = label_results(df)

    assert result.groupby("gid")["home_win"].first().to_dict() == case["expected"]