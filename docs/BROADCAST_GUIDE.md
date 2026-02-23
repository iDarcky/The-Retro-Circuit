# BROADCAST SYSTEM PROTOCOL

The "Broadcast" system at `/admin/broadcast` is your central communication hub. It allows you to publish different types of content depending on the speed, depth, and formality required.

This document outlines the purpose of each channel and best practices for their use.

---

## 01. SIGNALS (`/admin/signals`)
**Frequency:** High
**Tone:** Informal, Direct, Raw
**Format:** Short text (Micro-blogging)

### Purpose
Signals are your "pulse" or "status update". Use them for:
*   **Quick thoughts** on a device you just unboxed.
*   **Site updates** (e.g., "Database maintenance tonight").
*   **Industry whispers** or rumors you aren't ready to write a full article about.
*   **Live reactions** to events.

### Best Practices
*   **Keep it brief.** Think of it like a tweet or a terminal log entry.
*   **Use the `TYPE` selector correctly:**
    *   `STATUS`: General updates.
    *   `ALERT`: Important warnings (e.g., "Don't buy X yet").
    *   `THOUGHT`: Opinion or musings.
    *   `UPDATE`: System/Site changes.
*   **Don't overthink it.** This is the place to be human and responsive.

---

## 02. REVIEWS (`/admin/reviews`)
**Frequency:** Medium
**Tone:** Analytical, Objective, Professional
**Format:** Structured Data (Score, Summary, Pros/Cons)

### Purpose
Reviews are the core value proposition for hardware analysis. Use them for:
*   **Final verdicts** on handhelds after testing.
*   **Scored analysis** that feeds into the database.

### Best Practices
*   **Link to a Console:** Always ensure the review is linked to the correct console ID in the dropdown. This connects the review to the specs page.
*   **The Summary is Key:** Users will scan the summary first. Make the first sentence count.
*   **Pros/Cons:** Keep these short and punchy (e.g., "Great Screen", not "The screen has excellent color reproduction...").
*   **Scoring:** Be consistent. A `7.0` should mean the same thing across devices.

---

## 03. NEWS (`/admin/news`)
**Frequency:** Low/Medium
**Tone:** Informative, Journalistic
**Format:** Long-form Text (Markdown supported)

### Purpose
News is for longer content that doesn't fit into a structured review or a short signal. Use it for:
*   **Announcements** of new devices.
*   **Deep dives** into rumors or leaks.
*   **Guides** (e.g., "How to setup EmulationStation").
*   **Op-Eds** or longer editorial pieces.

### Best Practices
*   **Use Markdown:** The content field supports basic markdown (headers, lists, bold/italic) for better readability.
*   **Categorize:**
    *   `ANNOUNCEMENT`: Official news.
    *   `RUMOR`: Unconfirmed leaks.
    *   `RELEASE`: Game or Software drops.
    *   `GUIDE`: Educational content.
*   **Excerpts:** The excerpt is what appears on the card. It should be a "hook" to get them to click.

---

## SUMMARY TABLE

| Channel | Best For... | Lifespan | Engagement |
| :--- | :--- | :--- | :--- |
| **SIGNALS** | Status updates, quick thoughts, alerts | Hours / Days | High Frequency |
| **REVIEWS** | Final hardware verdicts, scoring | Years | High Value |
| **NEWS** | Announcements, guides, long-form | Months | Deep Reading |

---
*End of Protocol.*
