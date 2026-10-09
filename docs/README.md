# Working documentation

Our next priority is to understand how learners use the app and increase confirmed Premium sales while keeping free study useful.

| Start here | Purpose |
| --- | --- |
| [Premium sales plan](growth/premium-sales.md) | Priorities, weekly scorecard and experiment decisions |
| [Analytics reporting](analytics/README.md) | Sources, denominators, exclusions and cohort rules |
| [Event reference](analytics/events.md) | What the app and website actually measure |
| [Analytics access](analytics/access.md) | Account identities and repeatable read-only reporting |
| [Release and validation](maintenance/release.md) | Repeatable checks and unresolved technical limitations |
| [Content and artwork](maintenance/content.md) | Translation maintenance and approved creative sources |

Use [Readme.md](../Readme.md) for development/build commands and [GLOSSARY.md](../GLOSSARY.md) for product vocabulary. GitHub Issues hold actionable work; these docs explain how to operate and measure the product. Completed setup walkthroughs, old proposals and per-build QA diaries belong in Git history, rather than a second archive folder.

## Current starting point

Last release observation: **8 October 2026**. Version **1.40 (41)**, including the result-navigation fix and approved storefront refresh, was built from `main` in [Azure run 1808](https://deanvniekerk.visualstudio.com/K53%20Study%20Guide/_build/results?buildId=1808&view=results).

- Apple: submitted, Waiting for Review; manual release after approval.
- Google Play: eight release/listing changes submitted; automated checks were running. Managed publishing was off, with 100% rollout to the existing targeted country after approval.
- Submission is not evidence that learners have received the release. Confirm availability and record each platform's actual rollout date before starting a post-release baseline.

Documentation consolidated **9 October 2026** against the repository, release evidence and issue tracker. Analytics configuration was not re-audited during this cleanup. A closed ticket does not turn an unverified reporting assumption into evidence.

## Keep this small

Update the relevant page when behavior or an operating decision changes. Keep one event definition, one reporting contract and one growth plan. Record experiment results and dated QA evidence in their issues; keep credentials, raw analytics, customer identifiers and financial exports outside this public repository.

Agent workflow references: [issue tracker](agents/issue-tracker.md), [triage labels](agents/triage-labels.md), and [domain conventions](agents/domain.md).
