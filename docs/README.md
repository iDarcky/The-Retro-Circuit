# Docs

Twelve files, each with one job. If you are adding a doc, check whether it belongs inside
one of these first — the set was 20 files on 2026-08-27 and most of the duplication came
from regenerating the same report under a new name.

## Current — read these

| File | What it is | When to read it |
|---|---|---|
| [`SEPTEMBER_PLAYBOOK.md`](SEPTEMBER_PLAYBOOK.md) | The live plan: search data, weekly tasks, revenue blockers, verified data gaps | Start here. This is the working doc. |
| [`PENDING_FEATURES.md`](PENDING_FEATURES.md) | The backlog, by category and priority | Picking the next feature |
| [`ROADMAP.md`](ROADMAP.md) | Changelog + release checklist (generated 2026-03-05) | Checking what shipped when |
| [`DATA_MAPPING.md`](DATA_MAPPING.md) | Spreadsheet → database column mapping, and the traps | Importing catalogue data |
| [`ROUTES.md`](ROUTES.md) | Every public route, its metadata and SEO notes | Adding or changing a page |

## Reference

| File | What it is |
|---|---|
| [`DESIGN.md`](DESIGN.md) | The "Vibrant Swiss" design system — currently in force |
| [`BRAND.md`](BRAND.md) | Brand Guidelines v2.0.0 tokens. **Not yet adopted** — it conflicts with the hard rules in `CLAUDE.md`; the conflicts are listed at the bottom of the file |
| [`FINDER_RESULTS.md`](FINDER_RESULTS.md) | How the Finder quiz scores and ranks |
| [`BROADCAST_GUIDE.md`](BROADCAST_GUIDE.md) | What each `/admin/broadcast` channel is for |
| [`OPTIMIZATION_LOG.md`](OPTIMIZATION_LOG.md) | The Vercel Fluid compute overhaul, March 2026 |
| [`linked.md`](linked.md) | LinkedIn soft-launch post drafts |

## Historical

| File | What it is |
|---|---|
| [`CLAUDEAUDIT.md`](CLAUDEAUDIT.md) | Full product audit, March 2026, scored per role. A snapshot, not a plan — the still-open items live in `PENDING_FEATURES.md` |

Also at the repo root: [`CLAUDE.md`](../CLAUDE.md) (agent instructions and hard rules),
[`DESIGNAUDIT.md`](../DESIGNAUDIT.md) (UI inconsistencies vs the design system),
[`README.md`](../README.md).

---

## What was removed on 2026-08-27, and why

Nothing was lost — git has all of it, and anything still actionable was folded into the
file named below.

| Removed | Why | Where it went |
|---|---|---|
| `ROADMAP.md` (2/27), `NEW_ROADMAP.md` (3/1) | Successive snapshots of the same generated file | `ROADMAP.md` (3/5) supersedes both; the items they list that it drops had shipped |
| `AUDIT_REPORT.md`, `GEMINIAUDIT.md` | Two more March audits covering the same roles as `CLAUDEAUDIT.md` | Their unique roles — accessibility, legal, mobile, community, ops — are now `PENDING_FEATURES.md` §10–11 |
| `suggestions_report.md` | The why/how/where companion to `AUDIT_REPORT.md` | Same as above |
| `RENDER_AUDIT.md`, `CURRENTCACHE.md` | **Actively wrong.** Both described ISR at 60s/3600s while every public page is `revalidate = false`. An agent following them would have undone the compute work | The true rule is in `CLAUDE.md` under Rendering |
| `SEO_AUDIT.md` | An unfilled template — `Last updated: [date]`, every checkbox empty | `SEPTEMBER_PLAYBOOK.md` |
| `FINDERIDEAS.md` (root) | Finder backlog living outside the backlog | `PENDING_FEATURES.md` §9 |
