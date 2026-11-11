---
description: Run a k6 stress scenario safely (never against production) and log the result
argument-hint: "<exam-start|autosave-soak|checkout-spike|smoke> [--target <preview-url>]"
---
Scenario/args: $ARGUMENTS
Guardrails (docs/22 section 5): never target production or any URL not matching the preview pattern in `tooling/k6/targets.json`; refuse if the target host is on a non-allowlisted domain. Run heavy scenarios from GitHub Actions or a Codespace, NOT the fanless Mac: locally only `smoke` (<=20 VUs, <=60 s).
1. Confirm k6 is installed (`k6 version`); scripts live in `tooling/k6/*.js` (backlog P0-49 skeleton, P1-51 full).
2. Run `k6 run --summary-export=/tmp/k6-<scenario>.json tooling/k6/<scenario>.js -e BASE_URL=<target>`; use `tail -n 40` on output.
3. Compare to thresholds in the script (exam-start storm 2,000 VUs: p95 start < 800 ms, errors < 1%; autosave: p95 < 300 ms, deadline drift <= 1 s; checkout spike: no duplicate entitlements). Pass/fail per threshold.
4. Write `docs/logs/reviews/stress-<scenario>-<date>.md` from REVIEW-TEMPLATE (inputs, thresholds, numbers, verdict, bottleneck hypothesis labelled as hypothesis). If failed: log ERR entry via /log-error and add a backlog task; do not "tune" thresholds to pass.
5. Reply <=8 lines with the numbers.
