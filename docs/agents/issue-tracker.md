# Issue tracker: GitHub

Issues and specs live in GitHub Issues for `deanvanniekerk/k53studyguide`. Use `gh` from this clone, or pass `--repo deanvanniekerk/k53studyguide`.

## Operations

- Search before creating: `gh issue list --state all --search "<topic>"`.
- Read the ticket and comments: `gh issue view <number> --comments`.
- Create with `gh issue create --title "..." --body-file <path>`; use UTF-8 files for multiline bodies.
- Update with `gh issue edit <number> --body-file <path>`; comment with `gh issue comment <number> --body-file <path>`.
- Apply/remove labels with `gh issue edit <number> --add-label "..." --remove-label "..."`.
- Close with `gh issue close <number>` after its acceptance criteria are verified.

Publishing to the issue tracker means creating a GitHub issue. Fetching a relevant ticket means reading its body, labels and comments.

## Issue relationships

Use parent/sub-issues for a workstream and its independently deliverable tasks. Represent blockers with GitHub issue dependencies; if unavailable, use a `Blocked by: #<number>` line and a task list in the parent.

## Pull requests as a triage surface

**PRs as a request surface: no.**

GitHub shares issue and pull-request numbers. Resolve an ambiguous reference before acting on it.

## Public repository

Keep tickets actionable without private customer identifiers, credentials, transaction records or internal financial exports. Keep sensitive supporting evidence outside the repository and link only material intended for public access.
