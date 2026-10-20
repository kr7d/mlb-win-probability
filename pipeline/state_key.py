def build_state_key(inning, half, outs, bases, score_diff) -> str:
    if inning < 1:
        raise ValueError(f"inning cannot be less than 1. Got: {inning}")
    if half != "T" and half != "B":
        raise ValueError(f"half must be T or B. Got: {half}")
    if outs < 0 or outs > 2:
        raise ValueError(f"outs must be between 0 and 2 inclusive. Got: {outs}")
    if len(bases) != 3:
        raise ValueError(f"bases must be a string of length 3. Got: {bases}")
    for char in bases:
        if char != "0" and char != "1":
            raise ValueError(f"bases must contain only 0 and 1 as characters. Got: {bases}")
    if inning == 1 and half == "T" and score_diff > 0:
        raise ValueError("Home team cannot lead in the Top of the 1st")
    if inning == 9 and half == "B" and score_diff > 0:
        raise ValueError("Home team cannot lead in the Bottom of the 9th")
    if inning > 9 and score_diff > 0:
        raise ValueError("Home team cannot lead in extra innings")

    score_diff = 10 if score_diff > 10 else score_diff
    score_diff = -10 if score_diff < -10 else score_diff
    
    return f"{inning}|{half}|{outs}|{bases}|{score_diff}"