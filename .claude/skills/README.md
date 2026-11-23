# Design skills

Third-party Claude Code skills vendored into the repo so every session (local or cloud) has them.
Each keeps its upstream licence beside it. To update, re-copy from the upstream source.

| Skill folder | Upstream | Commit | Use it for |
| --- | --- | --- | --- |
| `frontend-design` | anthropics/claude-code `plugins/frontend-design` | 9b4f0d6 | Distinctive visual direction, type, copy |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill | 7246805 | Accessibility, touch, layout, forms, nav rules + searchable data (`python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain ux`) |
| `web-design-guidelines` | vercel-labs/agent-skills | 063bee9 | Code review against Vercel's Web Interface Guidelines (fetches the latest rules; `guidelines-snapshot.md` is an offline copy) |
| `react-best-practices` | vercel-labs/agent-skills | 063bee9 | React re-render, bundle and data-loading performance |
| `accessibility` | addyosmani/web-quality-skills | afa8da9 | WCAG 2.2 audit |
| `performance` | addyosmani/web-quality-skills | afa8da9 | Load and runtime performance |
| `best-practices` | addyosmani/web-quality-skills | afa8da9 | Security, compatibility, code quality |
| `core-web-vitals` | addyosmani/web-quality-skills | afa8da9 | LCP, INP, CLS |
| `seo` | addyosmani/web-quality-skills | afa8da9 | Referenced by web-quality-audit; for the public site |
| `web-quality-audit` | addyosmani/web-quality-skills | afa8da9 | Combined Lighthouse-style audit in a real browser |
| `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help` | DietrichGebert/ponytail `skills/` | 96608e0 | Reuse before writing; `/ponytail-review` on a diff, `/ponytail-audit` on the repo (skill files only; the plugin's hooks and band are not vendored) |
| `condom` | murphyaidanbusiness-ux/condom | e98a9f8 | Pre-launch hacked/sued check: `/condom` (`security`, `legal`, `quick`, `fix`); writes `CONDOM-REPORT.md`, not legal advice |
| `ask-matt`, `grill-me`, `grill-with-docs`, `grilling`, `tdd`, `diagnosing-bugs`, `to-spec`, `to-tickets`, `implement`, `implement-spec`, `improve-codebase-architecture`, `code-review`, `pr`, `prototype`, `research`, `domain-modeling`, `codebase-design`, `triage`, `wayfinder`, `retro`, `wizard`, `handoff`, `teach`, `to-questionnaire`, `wait-what`, `writing-for-agents`, `setup-matt-pocock-skills` | mattpocock/skills (installed with `npx skills add`, tracked in `/skills-lock.json`; MIT licence in `grill-me/`) | 5863806 | Engineering habits: grill before building, TDD, bug diagnosis, specs and tickets. Run `/setup-matt-pocock-skills` once. Its `code-review` replaces the built-in `/code-review` in this repo |
| `karpathy-guidelines` | multica-ai/andrej-karpathy-skills (formerly forrestchang) `skills/` | 2c60614 | Think before coding, simplicity first, surgical changes, goal-driven checks (MIT) |

Trimmed on import: upstream test suites and evals. taste-skill (Leonxlnx/taste-skill) was tried and
removed: it targets marketing pages, not app screens. Re-add it for the church website if wanted.
`.claude/` is in ESLint's ignore list so the skills' scripts never affect `npm run lint`.
