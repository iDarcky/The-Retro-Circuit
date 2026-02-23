# Finder Results Logic

The Handheld Finder uses a weighted scoring system and a multi-pass selection algorithm to recommend devices. This document explains how user inputs translate into the final results: "WINNER", "HONORABLE MENTION", and "PREMIUM PICK".

## 1. Input Parameters

The quiz collects the following preferences:

*   **Profile (Q1):** Sets the baseline weighting for scoring categories (e.g., 'Performance Chaser' weights power higher).
*   **Form Factor (Q2):** Preferred shape (Horizontal, Vertical, Clamshell).
*   **Target Tier (Q3):** The highest generation of games the user wants to play (e.g., 8-bit, PS1, PS2, Modern).
*   **Budget Band (Q4):** The price range the user is willing to pay.
*   **Portability (Q5):** Preference for size (Pocketable vs. Home usage).
*   **Setup (Q6):** Willingness to tinker (influences OS/Firmware scoring).
*   **Features (Q7):** Hard requirements (HDMI, Bluetooth, Wi-Fi, Dual Sticks).
*   **Aesthetic (Q8):** Bonus points for matching specific looks (Retro, Transparent, etc.).

## 2. Filtering Logic

Before scoring, the system filters the entire console database based on **Hard Requirements (Q7)**.

*   **Strict Filtering:** If a user selects "Must have HDMI", devices without video output are removed.
*   **Relaxation:** If no devices match all requirements, the system progressively "relaxes" the least critical constraints (e.g., dropping Bluetooth requirement) until matches are found.

## 3. Scoring Methodology

Each remaining console is assigned a `Total Score` based on how well it fits the user's profile.

### Score Components
1.  **Power Score:** Does the device meet the `Target Tier` (Q3)?
    *   *Penalty:* If the device is too weak for the target tier, it receives a massive penalty.
    *   *Bonus:* Devices that perfectly match or slightly exceed the tier get higher scores.
2.  **Budget Fit:** Does it fall within the `Budget Band` (Q4)?
    *   Devices inside the band get full points.
    *   Devices slightly above receive a small penalty.
    *   Devices significantly above receive a harsh penalty.
3.  **Form Factor Bonus:** Matches Q2 preference.
4.  **Portability Score:** Matches Q5 preference.
5.  **Ecosystem/Setup:** Matches Q6 (e.g., Linux/Android complexity vs. User skill).

## 4. Selection Algorithm (The 3 Passes)

Once scored, the system runs three passes to select the displayed results.

### Pass 1: THE WINNER (Best Match)
*   **Criteria:** Highest `Total Score`.
*   **Logic:** This device represents the best balance of all user inputs. It respects the budget, hits the performance target, and matches the form factor preference.

### Pass 2: HONORABLE MENTION (Best Performance for Budget)
*   **Criteria:** Highest Performance-to-Price ratio within the budget.
*   **Logic:** This algorithm re-sorts the list prioritizing **Power** and **Budget Fit** above all else (ignoring form factor or features).
*   **Goal:** To show the user the "smartest buy" if they care primarily about raw gaming performance for their money.

### Pass 3: PREMIUM PICK (Upgrade Option)
*   **Criteria:** A device that is slightly **over budget** (up to +$50) but offers a significant "Tier Jump".
*   **Logic:** The system looks for devices that are just outside the user's price range but offer a major leap in capability (e.g., moving from PS1-capable to PS2-capable).
*   **Fallback:** If no valid upgrade pick is found (or if the user has no budget limit), this slot is filled by the next highest scoring device as a second "Honorable Mention".

## 5. Result Display

*   **Winner:** Displayed prominently with a large image and "View Full Specs" + "Buy Now".
*   **Alternatives:** Displayed in a grid below. Users can "Compare vs Winner" to see a head-to-head spec breakdown in the Arena.
