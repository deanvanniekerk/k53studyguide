# Repository skills

Codex discovers `.agents/skills/` directly. Claude Code uses the relative symlinks in
`.claude/skills/`. Keep each skill and all of its supporting files together.
The existing `generate-report` skill remains specific to K53.

## Imported collection

Imported on 19 October 2026 from the installed snapshots in
`jedidiah-equipment/jedidiah-platform` at commit
`45144f8243c5fa4913492e4a0dea47f1c822ab0c`. These preserve Jedidiah's installed
versions and local customisations; they are not a fresh upgrade from upstream.
`skills-lock.json` retains the selected local snapshot entries.

- [Matt Pocock](https://github.com/mattpocock/skills): `code-review`, `codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grill-me`, `grill-with-docs`, `grilling`, `handoff`, `implement`, `implement-spec`, `improve-codebase-architecture`, `pr`, `prototype`, `research`, `retro`, `setup-ts-deep-modules`, `tdd`, `teach`, `to-questionnaire`, `to-spec`, `to-tickets`, `triage`, `wait-what`, `wayfinder`, `wizard`, `writing-for-agents`.
- [Dean van Niekerk](https://github.com/deanvanniekerk/skills): `blast-it`, `claude-code-pr-review`, `prune-tests`, `tackle-issue`, `test-plan`.
- `babysit`: Jedidiah's local PR monitoring skill.

Matt Pocock's notice is retained in `LICENSE-MATT-POCOCK.txt`; Dean's notices and
credits are retained in their skill directories. These notices apply to the
imported skills, not the application as a whole.

Project-specific issue tracker, triage and domain conventions are already defined
in `docs/agents/` and referenced by the root `AGENTS.md`. Installing a skill does
not run its workflow or change tooling, GitHub settings or deployment settings.
