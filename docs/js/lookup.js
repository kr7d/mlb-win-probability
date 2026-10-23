export function buildStateKey({ inning, half, outs, bases, score_diff }) {
    if (inning < 1) {
        throw new RangeError(`inning cannot be less than 1. Got: ${inning}`);
    }
    if (half != "T" && half != "B") {
        throw new Error(`half must be T or B. Got: ${half}`);
    }
    if (outs < 0 || outs > 2) {
        throw new RangeError(`outs must be between 0 and 2 inclusive. Got ${outs}`);
    }
    if (bases.length != 3) {
        throw new Error(`bases must be a string of length 3. Got ${bases}`);
    }
    for (const char of bases) {
        if (char != "0" && char != "1") {
            throw new Error(`bases must contain only 0 and 1 as characters. Got: ${bases}`);
        }
    }
    if (inning == 1 && half == "T" && score_diff > 0) {
        throw new Error(`Home team cannot lead in the Top of the 1st`);
    }
    if (inning == 9 && half == "B" && score_diff > 0) {
        throw new Error(`Home team cannot lead in the Bottom of the 9th`);
    }
    if (inning > 9 && score_diff > 0) {
        throw new Error(`Home team cannot lead in extra innings`);
    }

    score_diff = score_diff > 10 ? 10 : score_diff;
    score_diff = score_diff < -10 ? -10 : score_diff;

    return `${inning}|${half}|${outs}|${bases}|${score_diff}`;
}

// Fetch the win-prob of a scenario given a stateKey
export function lookup(table, stateKey) {
    if (!table[stateKey]) {
        throw new Error(`stateKey not found. Got: ${stateKey}`);
    }
    return table[stateKey]["home_wins"] / table[stateKey]["occurrences"];
}