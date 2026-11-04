# Repository skills

Only K53-specific skills live here. Codex discovers `.agents/skills/` directly; Claude Code uses the
relative symlinks in `.claude/skills/`. Keep each skill and all of its supporting files together.

- `generate-report`: the shared K53 reporting skill.

Shared engineering skills (Matt Pocock's workflows, the owner's personal skills from
[deanvanniekerk/skills](https://github.com/deanvanniekerk/skills), `babysit`, and the thermonuclear
review) are installed globally with the Skills CLI in `~/.agents/skills/`, linked into
`~/.claude/skills/`. Update them with `npx skills update -g`.

Project-specific issue tracker, triage and domain conventions are defined in `docs/agents/` and
referenced by the root `AGENTS.md`.
