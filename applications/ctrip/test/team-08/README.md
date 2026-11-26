# Ctrip testing findings for Team 08

Members: Isak Bjelland Vormeland and Yizhen Han

## Draft test cases

- [Black-box test 01](black-box-01.md)
- [White-box test 01](white-box-01.md)

## Submission rules

**Submit the test script that exposes each bug. Leave application and baseline code untouched. Skip debugging or fixing the bug.** Document how to run the script and what it exposes. Keep scripts and supporting evidence in this team directory.

Use the [Ctrip requirements](../../requirements/requirements.yaml) to identify the behavior under test and the [prerequisites](../../requirements/prerequisites.md) to document setup.

## Check for overlap

Use the [baseline coverage guide](baseline-coverage.md) to find similar tests. Compare their setup, inputs, and assertions with your proposed case. Record the closest matches and what your test adds.

## Pull request format

Use `[Ctrip][Team 08] Add fault-revealing tests` as the PR title. In the body, link each case document and summarize each finding under `REQ-<ID> Test: <behavior>`, using the four sections in the case drafts.
