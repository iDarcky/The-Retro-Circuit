# Splitting the Finder — concept notes

Not scheduled. Captured 2026-09-10 from a working session, so the thinking survives.

The idea: the Finder does two unrelated jobs badly at once. Split it into a **buying tool**
that only ever recommends something you can actually order, and a **charming quiz** that
tells you which handheld you are, drawing on the whole catalogue including the dead ones.
Both live behind one door so more quizzes can join later.

---

## Correction first: `legacy` does not mean "no longer sold"

The session started from "more than half the catalogue will eventually be legacy". The
instinct is right about reality and wrong about the column.

- `device_category` = **what kind of device it is**. `legacy` means an OEM classic — a PSP,
  a Vita, a 2DS. An Anbernic RG35XX is `emulation` forever, no matter how long it has been
  out of production.
- `release_status` = **whether you can buy it**. This is the field the split turns on.

So the sentence to hold onto is "more than half will eventually be **discontinued**", and
that is a `release_status` fact. Good news: it makes the split a one-column filter rather
than a taxonomy problem.

## The blocker, and it is not UI

`release_status` is almost entirely unmaintained.

| | discontinued | released | total |
|---|---|---|---|
| emulation | 10 | 351 | 362 |
| pc_gaming | 0 | 75 | 75 |
| legacy | 8 | 15 | 23 |
| fpga | 0 | 1 | 1 |

**18 of 462 rows are marked discontinued.** Every Retroid Pocket 2/3, every superseded
Anbernic, every Miyoo that vanished — the database believes they are all on sale. CLAUDE.md
already warns the field is flipped by hand from the `/admin` "Release date passed" panel and
never automatically.

Two consequences:

1. A "only what you can buy" mode built today would confidently recommend a Retroid Pocket 3
   that stopped shipping two years ago. The mode is only as honest as the column.
2. **`app/finder/actions.ts` does not filter on `release_status` at all today.** The current
   quiz can already hand someone a discontinued 2021 Ayn Odin as their buy recommendation.
   The split fixes a live bug as a side effect.

Also suspect: 15 `legacy` rows marked `released`. A PSP-1000 is not currently released.

**Critical path is a data pass, not a design pass.** Roughly: sweep the catalogue, mark what
is actually dead, and give `/admin` a way to keep it true. Until that exists the buying mode
cannot make its central promise.

---

## Mode A — the buying tool

Keeps the name Finder and the `/finder` URL. That URL carries what little search intent the
feature has, and its metadata already targets "Find the Best Retro Handheld for You".

Scope, as decided:

- `release_status = 'released'` only.
- Upcoming devices excluded until they ship.
- Discontinued devices never recommended, however good the used deal.
- PC handhelds in scope, but only where the answer calls for power.
- Launch price is good enough for budget matching; current price is a later problem.
- Buy paths come later — do not gate on the 41 published consoles that lack one.

The eight-question engine stays as it is.

## Mode B — the charming one

Not defensible, and not trying to be. It is a reason to come back and a thing to send a
friend.

**Archetypes, each holding devices.** The result is "You are The Tinkerer" — someone who
enjoys the device as much as the games — and the archetype carries a hero device plus two or
three others across eras. This is better than picking one device directly:

- The charm lives in the archetype, so a thin catalogue still reads as rich.
- New devices join an archetype without rewriting the quiz.
- It degrades gracefully. Today's seven classics do not embarrass it; a hundred later do not
  break it.

**Map archetypes to rules, not to lists.** A hand-written list of device ids rots the moment
the catalogue grows, and it will grow all year. Give each archetype a predicate over columns
that already exist — The Tinkerer as `os_family = linux` plus expandable storage, say — and
hand-pick only the hero. New rows fall into the right archetype by themselves.

Questions are its own set, written later, mixing "what did you play" with "what are you
like". Both, per the brief.

**The loop closes.** Every fun result ends with a route into Mode A, pre-seeded with what the
archetype implies. Someone who came to find out they are The Tinkerer leaves with three
devices they can buy today. That is what stops it being a toy.

## The door

`/finder` stays the buying tool. The portal is a separate page listing every quiz, so adding
the fourth one costs a tile rather than an information architecture.

Homepage button: point it at the buying tool **now**, and switch it to the portal the day a
second door exists. A portal with one working room and one empty one is a click for nothing.

### Names to react to

Register asked for: playful, keeps the idea in sight. Nothing here is a recommendation, they
are here to find the boundary faster than an abstract discussion would.

| Slot | Candidates | Note |
|---|---|---|
| Buying tool | **Finder** | Keep. It is in the nav, it is honest, and it holds the URL. |
| Charming one | **Spirit Device**, Diagnostics, Boot Sequence, The Shelf | "My spirit handheld is the PSP-2000" is a sentence someone types unprompted. Diagnostics fits the electronics vocabulary better and shares worse. |
| The portal | **Test Bench**, The Lab, The Workshop | Avoid Arcade — one letter from Arena and the two would be confused in a nav. |

## The share card

An image is the deliverable, not a page. One asset, sized for where these communities
actually are: Reddit, Discord, YouTube comments. `lib/og/console-card.tsx` already renders
cards through Satori as a pure function, so a result card is a second drawing in a rig that
exists — remembering Satori cannot decode WebP, which is what the uploader writes.

**On forum banners specifically:** signature banners are close to dead outside a few
holdout boards, and retro emulation is admittedly one of the more forum-persistent scenes.
But it is a cheap second export of the same card, not a reason to build anything separate.
The bigger prize is not forums as a format, it is r/SBCGaming as a place — and what gets
posted there is comparison screenshots. Which points at giving **Arena** a share card first,
since Arena already out-ranks and out-converts everything else on the site.

---

## Sequencing

1. **Fix `release_status`.** Data pass plus an admin affordance. Nothing else in this
   document is honest until this is done.
2. **Filter the current Finder on it.** Small change to `app/finder/actions.ts`, fixes the
   live bug, ships without any of the rest.
3. **Add the classics.** Image and name first, specs later, as agreed. Fifteen to twenty-five
   rows makes the archetype pool real.
4. **Archetypes and the charming quiz.** Only worth starting once 1 and 3 are done.
5. **The portal**, when there is a second door to put in it.
6. **Share cards**, Arena first.

Steps 1 and 2 are worth doing on their own merits whether or not the split ever happens.

## What the numbers say about priority

The playbook's standing decision still holds: the Finder drew 12 impressions in August and
is not the traffic constraint. The argument for building this anyway is not SEO, and should
not be dressed as SEO. It is that Arena and the Finder are the two things on the site
somebody can *play with*, and play is what brings people back to a spec database. Judge the
charming mode on shares and returns, not on impressions — and if it cannot be judged at all,
that is a reason to instrument it before building it.

Meanwhile the catalogue bottleneck is unchanged: 370 drafts without images, being cleared
one at a time through the end of the year.
