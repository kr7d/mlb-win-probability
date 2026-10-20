import json
from pathlib import Path

import pytest
from state_key import build_state_key

CASES_PATH = Path(__file__).resolve().parents[2] / "shared" / "state_key_cases.json"
CASES = json.loads(CASES_PATH.read_text())

@pytest.mark.parametrize("case", CASES["valid"], ids=[c["name"] for c in CASES["valid"]])
def test_valid(case):
    assert build_state_key(**case["input"]) == case["expected"]

@pytest.mark.parametrize("case", CASES["invalid"], ids=[c["name"] for c in CASES["invalid"]])
def test_invalid(case):
    with pytest.raises(ValueError):
        build_state_key(**case["input"])