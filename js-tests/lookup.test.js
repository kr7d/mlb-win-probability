import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lookup } from "../docs/js/lookup.js"

const MOCK_DATA = {"1|B|0|000|-10": {"occurrences": 2, "home_wins": 0}, "1|B|0|000|-3": {"occurrences": 75, "home_wins": 19}, "1|B|0|000|0": {"occurrences": 1794, "home_wins": 1076}}

const CASES = JSON.parse(
    readFileSync(new URL("lookup_cases.json", import.meta.url))
)

for (const c of CASES.valid) {
    test(c.name, () => {
        assert.equal(Math.round(lookup(MOCK_DATA, c.input)*100)/100, c.expected);
    });
}

for (const c of CASES.invalid) {
    test(c.name, () => {
        assert.throws(() => lookup(MOCK_DATA, c.input));
    });
}