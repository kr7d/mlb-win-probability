import { state, toStateKeyInput } from "./gameState.js";
import { buildStateKey, lookup } from "./lookup.js";

const DATA = await fetch("data/win_expectancy.json").then(r => r.json());

const inn = {
    innMinusBtn: document.getElementById("inn_minus_btn"),
    innLabel: document.getElementById("inn_label"),
    innPlusBtn: document.getElementById("inn_plus_btn")
}

const scores = {
    hMinusBtn: document.getElementById("score_h_minus_btn"),
    hLabel: document.getElementById("score_h_label"),
    hPlusBtn: document.getElementById("score_h_plus_btn"),
    vMinusBtn: document.getElementById("score_v_minus_btn"),
    vLabel: document.getElementById("score_v_label"),
    vPlusBtn: document.getElementById("score_v_plus_btn")
}

const outs = {
    outsMinusBtn: document.getElementById("outs_minus_btn"),
    outsLabel: document.getElementById("outs_label"),
    outsPlusBtn: document.getElementById("outs_plus_btn")
}

const halfBtns = document.querySelectorAll('input[name="half"]');
const runnersBtns = document.querySelectorAll('input[name="runners"]');
const homeWinProb = document.getElementById("home-win-prob")

function displayProb() {
    const stateKeyInput = toStateKeyInput(state);
    let stateKey;
    try {
        stateKey = buildStateKey(stateKeyInput);
    } catch (error) {
        console.warn("Failed to build state key:", error.message);
        homeWinProb.textContent = `Home win: N/A`;
        return;
    }
    let prob;
    try {
        prob = lookup(DATA, stateKey);
    } catch (error) {
        console.warn("Failed to lookup state key:", error.message);
        homeWinProb.textContent = `Home win: N/A`;
        return;
    }
    prob = Math.round(prob*10000)/100;
    homeWinProb.textContent = `Home win: ${prob}%`;
}

displayProb(); // Initialize probability on page load

inn.innMinusBtn.addEventListener("click", () => {
    state.inning = state.inning > 1 ? state.inning - 1 : state.inning;
    inn.innLabel.textContent = state.inning;
    displayProb()
});

inn.innPlusBtn.addEventListener("click", () => {
    state.inning = state.inning < 99 ? state.inning + 1 : state.inning;
    inn.innLabel.textContent = state.inning;
    displayProb()
});

scores.hMinusBtn.addEventListener("click", () => {
    state.homeScore = state.homeScore > 0 ? state.homeScore - 1 : state.homeScore;
    scores.hLabel.textContent = state.homeScore;
    displayProb()
});

scores.hPlusBtn.addEventListener("click", () => {
    state.homeScore = state.homeScore < 99 ? state.homeScore + 1 : state.homeScore;
    scores.hLabel.textContent = state.homeScore;
    displayProb()
});

scores.vMinusBtn.addEventListener("click", () => {
    state.awayScore = state.awayScore > 0 ? state.awayScore - 1 : state.awayScore;
    scores.vLabel.textContent = state.awayScore;
    displayProb()
});

scores.vPlusBtn.addEventListener("click", () => {
    state.awayScore = state.awayScore < 99 ? state.awayScore + 1 : state.awayScore;
    scores.vLabel.textContent = state.awayScore;
    displayProb()
});

outs.outsMinusBtn.addEventListener("click", () => {
    state.outs = state.outs > 0 ? state.outs - 1 : state.outs;
    outs.outsLabel.textContent = state.outs;
    displayProb()
});

outs.outsPlusBtn.addEventListener("click", () => {
    state.outs = state.outs < 2 ? state.outs + 1 : state.outs;
    outs.outsLabel.textContent = state.outs;
    displayProb()
});

halfBtns.forEach(radio => {
    radio.addEventListener("change", (event) => {
        if (event.target.checked) {
            state.half = event.target.value;
            displayProb()
        }
    });
});

runnersBtns.forEach(checkbox => {
    checkbox.addEventListener("change", (event) => {
        state.runners[event.target.value - 1] = event.target.checked;
        displayProb()
    });
});