import { state, toStateKeyInput } from "./gameState.js";
import { buildStateKey, lookup } from "./lookup.js";

const DATA = await fetch("data/win_expectancy.json").then(r => r.json());

const result = {
    winProb: document.getElementById("home-win-prob"),
    homeWins: document.getElementById("home-wins"),
    occurrences: document.getElementById("occurrences")
}

const inn = {
    minusBtn: document.getElementById("inn_minus_btn"),
    label: document.getElementById("inn_label"),
    plusBtn: document.getElementById("inn_plus_btn")
}

const diff = {
    minusBtn: document.getElementById("diff_minus_btn"),
    label: document.getElementById("diff_label"),
    plusBtn: document.getElementById("diff_plus_btn"),
}

const outs = {
    minusBtn: document.getElementById("outs_minus_btn"),
    label: document.getElementById("outs_label"),
    plusBtn: document.getElementById("outs_plus_btn")
}

const halfBtns = document.querySelectorAll('input[name="half"]');
const runnersBtns = document.querySelectorAll('input[name="runners"]');

function displayProb() {
    const stateKeyInput = toStateKeyInput(state);
    let stateKey;
    try {
        stateKey = buildStateKey(stateKeyInput);
    } catch (error) {
        console.warn("Failed to build state key:", error.message);
        result.winProb.textContent = `Home win probability: N/A%`;
        result.homeWins.textContent = `Home wins: N/A`;
        result.occurrences.textContent = `Occurrences: N/A`;
        return;
    }
    let homeWins;
    let occurrences;
    try {
        [homeWins, occurrences] = lookup(DATA, stateKey);
    } catch (error) {
        console.warn("Failed to lookup state key:", error.message);
        result.winProb.textContent = `Home win probability: N/A%`;
        result.homeWins.textContent = `Home wins: N/A`;
        result.occurrences.textContent = `Occurrences: N/A`;
        return;
    }
    const prob = Math.round(homeWins/occurrences*10000)/100;
    result.winProb.textContent = `Home win probability: ${prob}%`;
    result.homeWins.textContent = `Home wins: ${homeWins}`;
    result.occurrences.textContent = `Occurrences: ${occurrences}`;
}

function decrementInning() {
    state.inning = state.inning > 1 ? state.inning - 1 : state.inning;
    inn.label.textContent = state.inning;
    displayProb()
}

function incrementInning() {
    state.inning = state.inning < 99 ? state.inning + 1 : state.inning;
    inn.label.textContent = state.inning;
    displayProb()
}

function decrementDiff() {
    state.awayScore = state.homeScore - state.awayScore > -10 ? state.awayScore + 1 : state.awayScore;
    diff.label.textContent = state.homeScore - state.awayScore;
    diff.label.textContent = state.homeScore - state.awayScore <= -10 ? `${diff.label.textContent}+` : diff.label.textContent;
    displayProb()
}

function incrementDiff() {
    state.homeScore = state.homeScore - state.awayScore < 10 ? state.homeScore + 1 : state.homeScore;
    diff.label.textContent = state.homeScore - state.awayScore;
    diff.label.textContent = state.homeScore - state.awayScore >= 10 ? `${diff.label.textContent}+` : diff.label.textContent;
    displayProb()
}

function decrementOuts() {
    state.outs = state.outs > 0 ? state.outs - 1 : state.outs;
    outs.label.textContent = state.outs;
    displayProb()
}

function incrementOuts() {
    state.outs = state.outs < 2 ? state.outs + 1 : state.outs;
    outs.label.textContent = state.outs;
    displayProb()
}

function setHalf(event) {
    if (event.target.checked) {
        state.half = event.target.value;
        displayProb()
    }
}

function setRunners(event) {
    state.runners[event.target.value - 1] = event.target.checked;
    displayProb()
}

displayProb(); // Initialize probability on page load

inn.minusBtn.addEventListener("click", decrementInning);
inn.plusBtn.addEventListener("click", incrementInning);

diff.minusBtn.addEventListener("click", decrementDiff);
diff.plusBtn.addEventListener("click", incrementDiff);

outs.minusBtn.addEventListener("click", decrementOuts);
outs.plusBtn.addEventListener("click", incrementOuts);

halfBtns.forEach(radio => {
    radio.addEventListener("change", setHalf);
});

runnersBtns.forEach(checkbox => {
    checkbox.addEventListener("change", setRunners);
});