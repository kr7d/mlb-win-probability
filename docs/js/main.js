import { state, toStateKeyInput } from "./gameState.js";
import { buildStateKey, lookup } from "./lookup.js";

const DATA = await fetch("data/win_expectancy.json").then(r => r.json());

const home_score = {
    score_label: document.getElementById("home-score-label"),
    score: document.getElementById("home-score")
}

home_score.score.addEventListener("input", () => {
    state.homeScore = home_score.score.value;
});

export function calculateProb() {
    const stateKeyInput = toStateKeyInput(state);
    const stateKey = buildStateKey(stateKeyInput);
    return lookup(DATA, stateKey);
}