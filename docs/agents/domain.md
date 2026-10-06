# Domain docs

## Layout and reading

Single context: `GLOSSARY.md` at the repository root, with architectural decisions under `docs/adr/`.

Before exploring a domain area, read the glossary and any ADRs relevant to that area. If an ADR directory or file does not exist, continue without creating placeholders.

## Vocabulary and decisions

Use glossary terms in issue titles, acceptance criteria, tests and proposals. Keep the glossary limited to domain definitions; put implementation plans in tickets.

When a term is missing or conflicts with usage, resolve it through domain modeling and update the glossary. Surface conflicts with an existing ADR explicitly before proposing a change.

Create ADRs only for resolved decisions with meaningful alternatives and lasting consequences. Create the ADR directory when the first such decision is recorded.
