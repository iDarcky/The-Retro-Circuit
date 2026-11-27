# Writing an article

Every article is one `.md` file in this folder. The file name (without `.md`) is the web
address: `holiday-2026-best-first-handheld-for-kids.md` → `/news/holiday-2026-best-first-handheld-for-kids`.
Files starting with `_` are ignored, so `_template.md` can be copied.

## The header

```
---
title: Best first retro handheld for kids (2026)   # Google title and card title
headline: First handheld | for kids                # big pixel title; text after | is orange
description: One or two sentences for Google and the card.
category: guide                                    # guide, news, hands-on or site
series: holiday-2026                               # optional, groups the holiday guides
date: 2026-12-01                                   # first published
updated: 2026-12-10                                # optional, shown as "Updated ..."
color: "#7fb800"                                   # card colour
featured: true                                     # the big card at the top of the series
image: https://...                                 # optional cover; otherwise the first console's photo
draft: true                                        # true = preview links only, not the live site
---
```

## The body

Normal Markdown: `## Heading` (each one goes in the Contents list), paragraphs, lists,
`**bold**`, links (`[Retroid Pocket 5](/consoles/retroid-pocket-5)`), tables.

### Console box

```
:::console retroid-pocket-5
label: Best overall
good: Big bright screen; Runs PS2 well
bad: Gets warm under load
:::
```

The slug is the end of the console's page address. Photo, specs, price, buy link and
"Full specs" / "Compare" buttons come from the database. `good` and `bad` are optional,
separated by `;`. Unpublished consoles are skipped. With two or more labelled boxes, a
"Quick picks" table appears automatically after the intro.

### Questions

```
:::faq
Q: Do these come with games?
A: Most ship with an empty card.
:::
```

These also go into Google's FAQ data.

## Publishing

Set `draft: false` (or delete the line) and merge. The article then appears on
`/news` and in the sitemap on the next deploy.
