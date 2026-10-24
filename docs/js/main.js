import { state, toStateKeyInput } from "./gameState.js";
import { buildStateKey, lookup } from "./lookup.js";

const DATA = await fetch("data/win_expectancy.json").then(r => r.json());

const scores = {
    hMinusBtn: document.getElementById("score_h_minus_btn"),
    hInput: document.getElementById("score_h_input"),
    hPlusBtn: document.getElementById("score_h_plus_btn")
}

scores.hMinusBtn.addEventListener("click", () => {
    state.homeScore = state.homeScore > 0 ? state.homeScore - 1 : state.homeScore;
    scores.hInput.value = state.homeScore;
});

scores.hPlusBtn.addEventListener("click", () => {
    state.homeScore = state.homeScore < 99 ? state.homeScore + 1 : state.homeScore;
    scores.hInput.value = state.homeScore;
});

export function calculateProb() {
    const stateKeyInput = toStateKeyInput(state);
    const stateKey = buildStateKey(stateKeyInput);
    return lookup(DATA, stateKey);
}