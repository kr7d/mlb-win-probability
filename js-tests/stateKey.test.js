import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildStateKey } from "../docs/js/lookup.js"

const CASES = JSON.parse(
    readFileSync(new URL("../shared/state_key_cases.json", import.meta.url))
);

for (const c of CASES.valid) {
    test(c.name, () => {
        assert.equal(buildStateKey(c.input), c.expected);
    });
}

for (const c of CASES.invalid) {
    test(c.name, () => {
        assert.throws(() => buildStateKey(c.input));
    });
}