export const state = {
    inning: 1,
    half: "T",
    outs: 0,
    runners: [false, false, false],
    homeScore: 0,
    awayScore: 0
};

export function toStateKeyInput(state) {
    let bases = "";
    for (let i = 0; i < state.runners.length; i++) {
        bases = state.runners[i] ? bases + "1" : bases + "0";
    }
    const scoreDiff = state.homeScore - state.awayScore;
    return {
        inning: state.inning,
        half: state.half,
        outs: state.outs,
        bases: bases,
        score_diff: scoreDiff
    };
}