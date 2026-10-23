import { state, toStateKeyInput } from "./gameState.js";
import { buildStateKey, lookup } from "./lookup.js";

const DATA = await fetch("data/win_expectancy.json").then(r => r.json());

export function calculateProb() {
    const stateKeyInput = toStateKeyInput(state);
    const stateKey = buildStateKey(stateKeyInput);
    return lookup(DATA, stateKey);
}