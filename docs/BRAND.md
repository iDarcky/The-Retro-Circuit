# Brand Guidelines v2.0.0 — extracted tokens

Source of truth: <https://claude.ai/code/artifact/fd31d3d2-055b-4a7b-a5bc-39552bef7398>
("The Retro Circuit — Brand Guidelines", issued 05.2026).

This file is the machine-readable extract, so implementation does not depend on reading a
4 MB artifact. The artifact remains authoritative for anything not captured here — logo
files, the Bit mascot, voice, and the icon set.

> **This document is not yet adopted.** It conflicts with the hard rules in `CLAUDE.md`
> in three specific ways (listed at the bottom). Until that is resolved, `CLAUDE.md` and
> `docs/DESIGN.md` remain in force.

---

## Colour

Stated principle: *"Black is the room. Color is the signal."* Six accents, one neutral;
every accent has exactly one job, and colour is never decorative.

| Token | Hex | Job |
|---|---|---|
| `--c-purple` | `#8B5CF6` | Primary brand accent. CTAs, hover, `VAULT_` section, active nav |
| `--c-orange` | `#FF6A00` | PRE-ALPHA stamp, `NEWS_` section, "SIMILAR MATCH" tag, warnings |
| `--c-green` | `#34D399` | System online, `ARCHIVES_` section, success states |
| `--c-cyan` | `#06B6D4` | Player 1, Start Quiz CTA, link hover, in-app cursor |
| `--c-red` | `#EF4444` | Player 2, `SIGNALS_` newsletter, errors, destructive |
| `--c-blue` | `#3B82F6` | Arena P1 anchor, secondary accent (rare) |
| `--c-pink` | `#EC4899` | Rainbow hairline only |

Each accent has a `-dim` companion at 18% alpha, e.g. `--c-purple-dim: rgba(139,92,246,.18)`.

### Surfaces and text

| Token | Hex | Job |
|---|---|---|
| `--bg` | `#000000` | Page background. Always pure black |
| `--bg-1` / `--bg-2` / `--bg-3` | `#0A0A0A` / `#111114` / `#161619` | Elevation steps |
| `--paper` | `#FFFFFF` | Primary text — pure white for pixel-font contrast |
| `--paper-dim` | `#D1D5DB` | Secondary text |
| `--paper-mute-2` | `#9CA3AF` | Tertiary |
| `--paper-mute` | `#6B7280` | Metadata, labels, timestamps |
| `--line` / `--line-2` / `--line-strong` | `rgba(255,255,255,.08 / .14 / .28)` | Borders |

### Gradient

```
--rainbow: linear-gradient(90deg, #06B6D4 0%, #8B5CF6 32%, #EC4899 58%, #FF6A00 82%, #34D399 100%);
```

Used as a hairline in the footer and topbar only.

---

## Typography

Unchanged from the current system — the same three families:

- **Press Start 2P** — pixel chrome, wordmark, major headings
- **JetBrains Mono** — data, specs, labels, buttons, nav
- **Inter** — body and long-form

---

## Section → colour mapping

This is the most directly actionable part, because it assigns a colour identity per route:

| Section | Colour |
|---|---|
| `VAULT_` | purple |
| `ARCHIVES_` | green |
| `NEWS_` | orange |
| `SIGNALS_` | red |
| Quiz / Player 1 | cyan |
| Arena P1 | blue |

---

## Conflicts with `CLAUDE.md` — needs a decision

The brand book's stated aesthetic is *"Glow in the dark"*. The current hard rules forbid
exactly that. These are not stylistic quibbles; they are direct contradictions:

| `CLAUDE.md` hard rule | Brand v2.0.0 |
|---|---|
| "No `box-shadow` or `text-shadow`" · "No neon glows" | 8 distinct glow shadows, e.g. `0 0 24px rgba(139,92,246,.4)`, `0 0 6px currentColor` |
| "No rounded corners — `rounded-none` or `rounded-sm` only" | `border-radius` of `4px`, `24px`, `32px`, `999px`, `50%` |
| "No gradient text — solid only" | 18 gradients including the `--rainbow` hairline |

Two further palette changes worth noting even if the rules are relaxed:

- **Orange moves** from Tailwind `orange-500` `#F97316` to `#FF6A00` — more saturated.
- **Error colour moves** from `rose-500` `#F43F5E` to `#EF4444` (Tailwind `red-500`).
- **Green, blue and pink are new** — the current system has four signal colours, this has six.

The brand book says it was *"built to match the live product, not replace it"*, which
suggests it is meant to be adopted wholesale rather than layered on. That is the founder's
call to make, not an inference to act on.
