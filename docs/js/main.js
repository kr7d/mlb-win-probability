import { state, toStateKeyInput } from "./gameState.js";
import { buildStateKey, lookup } from "./lookup.js";

const DATA = await fetch("data/win_expectancy.json").then(r => r.json());

const scores = {
    hMinusBtn: document.getElementById("score_h_minus_btn"),
    hLabel: document.getElementById("score_h_label"),
    hPlusBtn: document.getElementById("score_h_plus_btn")
}

scores.hMinusBtn.addEventListener("click", () => {
    state.homeScore = state.homeScore > 0 ? state.homeScore - 1 : state.homeScore;
    scores.hLabel.textContent = state.homeScore;
});

scores.hPlusBtn.addEventListener("click", () => {
    state.homeScore = state.homeScore < 99 ? state.homeScore + 1 : state.homeScore;
    scores.hLabel.textContent = state.homeScore;
});

export function calculateProb() {
    const stateKeyInput = toStateKeyInput(state);
    const stateKey = buildStateKey(stateKeyInput);
    return lookup(DATA, stateKey);
}