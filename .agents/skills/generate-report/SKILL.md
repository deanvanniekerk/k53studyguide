---
name: generate-report
description: Generate private HTML reports for K53 Study Guide sales, engagement, release performance, purchase errors, and weekly business summaries using live analytics and store data. Use for generate-report requests with a topic or date window, not unrelated generic reports.
---

# Generate K53 report

Produce a fresh, evidence-backed HTML report and a short answer with the most useful findings. This skill preserves retrieval methods, not historical results. Reporting authorizes read-only investigation and local output; account changes, campaigns, code changes and publication are separate tasks.

Example requests:

- `/generate-report about the sales after the latest 48 hours`
- `/generate-report global summary over last week`
- `$generate-report Android purchase errors since Monday`
- `$generate-report latest Android release versus the previous weekend`

## Resolve the brief

Use the current time and Africa/Johannesburg for the user's requested window. State the interpretation before retrieval; ask only if ambiguity materially changes the result.

| Request | Default scope |
| --- | --- |
| Sales in the latest/last 48 hours | Rolling interval ending now; both stores, worldwide production purchases and refunds |
| Global summary over last week | Previous completed Monday–Sunday in SAST; worldwide Android and iOS, South Africa separately, plus available website acquisition context |
| Last seven days | Seven completed local calendar days through yesterday, unless explicitly rolling |
| Latest release | Verify publication/version per platform, then measure available post-publication days; separate the partial launch day |
| Purchase errors | Initialization reason/code/stage, affected users and device/OS/geography; checkout failures and restores separately |

Preserve exact start/end timestamps for rolling intervals, using [start, end). GA4 daily ranges are inclusive. If a source cannot supply exact hours, label its coverage and show completed-day context separately; never substitute two calendar days for 48 hours silently. Compare matching weekdays and record each source's timezone.

## Retrieve

1. Use the repository containing this skill as the K53 checkout; resolve repo paths from its root. Read `docs/analytics/README.md`, `access.md` and `events.md`, the maintained metric contract. Read `docs/growth/premium-sales.md` for conversion interpretation. Recheck cached account details against the current checkout.
2. Read [retrieval.md](references/retrieval.md) for accounts, concrete query examples, financial verification and retrieval traps. Select sources for the brief: sales reports prioritize transactions, not merely GA engagement.
3. Prefer available read-only connectors/APIs and discover their schemas. Use Safari for authenticated consoles; use the internal browser for public pages and local HTML review.
4. Verify account, timezone/currency, release status when relevant, custom dimensions and usable data. Save requests, responses/exports, fetch times, pagination and coverage privately. A source is complete when the requested window is covered or its limitation is recorded.

## Interpret

- Keep installations, measured users, offer views, checkout attempts, entitlement access and payments distinct. Follow the repo definitions for funnels and finance.
- Request unique-user totals over the entire window; daily, event, version and country rows can overlap.
- Eligible offer → checkout requires a sequential funnel. Buyer conversion requires a verified private identity join to production purchases; otherwise show sales beside the funnel.
- Split platform/version and South Africa where useful. Unknown values stay visible. Production build context does not prove QA or sandbox exclusion.
- Inspect thresholding, sampling, incomplete dates and missing rows. Zero and unavailable differ. Registered dimensions still need populated values.
- Show counts beside percentages, denominators beside rates and windows beside comparisons. Sparse observations do not establish causal effects of releases, ads or pricing.

## Deliver

Save under `~/.codex/reports/k53/<date>-<topic>/`, outside the public repository. Use private directory/file permissions for raw evidence. Keep customer/order/device identifiers and credentials out of the report and conversation. Produce standalone HTML with inline CSS, system fonts, no tracking and no remote assets.

Adapt the report to the request:

- Scope, exact dates, retrieval time and coverage caveat.
- A few metric cards with units and definitions.
- Findings that connect evidence to its practical implication.
- Comparable-period tables, platform/version bars or a sequential funnel when supported.
- Sales reconciliation status and currency treatment for financial reports.
- Concrete next actions, then expandable definitions, source links and limitations.

Use the previous report's visual style: dark teal header, light neutral page, white cards, teal positive signals, amber issues, responsive tables, mobile stacking and print styling. Build each report from fresh evidence; historical report builders may contain hard-coded dates and findings.

Open the generated HTML in the internal browser and inspect the rendered report, including lower sections. Check totals and units against saved evidence, readability and absence of private identifiers. Open the file in Codex when its preview tool is available, and return an absolute file link plus the most important findings and material limitations.

Completion means a verified HTML deliverable with fresh evidence and explicit source coverage. If a required source is inaccessible, deliver the supported portion, label it incomplete and identify the missing access/data. Do not turn unavailable sales data into zero sales, or convert a reporting task into an engineering/release task.
