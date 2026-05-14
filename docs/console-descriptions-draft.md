# Console Description Drafts

Status of `consoles.description` field as of 2026-05-14:

- **66 published consoles** total
- **60 already have descriptions written** (no action needed)
- **6 missing descriptions** — drafts below, written to match the existing house voice

To apply: copy each block into the **Description** textarea on the matching console's admin page, then set status to published. Or run the SQL block at the bottom to bulk-apply all six at once (after review).

---

## 1. analogue-pocket — Analogue Pocket

Engineered around an FPGA core rather than software emulation, the Analogue Pocket is intended to recreate the original cartridge experience of Game Boy, Game Boy Color, and Game Boy Advance hardware at the circuit level. It is known for its sharp 1600×1440 display, premium build quality, and openFPGA support that enables community-developed cores for additional systems. Released in late 2021, this device positions itself as a preservation-grade tool rather than a general-purpose emulation machine. The primary trade-off is a higher entry price and a deliberate scope, since FPGA accuracy comes at the cost of broad post-GBA library coverage.

---

## 2. anbernic-rg-40xxv — Anbernic RG 40XXV

Designed as an entry-level vertical handheld in Anbernic's 2024 lineup, the RG40XXV is intended for players seeking 8/16-bit and 32-bit-era libraries in a pocketable form factor. It is known for a budget price point under $70, a comfortable D-pad layout, and a 4-inch display that suits taller aspect-ratio titles such as Game Gear and arcade verticals. Built around the Allwinner H700, this system positions itself as an accessible daily-carry option for casual retro sessions. The primary trade-off is limited headroom — PSP and Dreamcast titles are inconsistent — and a Linux software stack that rewards tinkering over plug-and-play simplicity.

---

## 3. anbernic-rg-477v — Anbernic RG 477V

Positioned at the upper end of Anbernic's vertical lineup, the RG477V is intended as a high-tier Android handheld for sixth-generation emulation in a one-handed form factor. Powered by the MediaTek Dimensity 8300, it is known for delivering GameCube and PlayStation 2 performance in a compact chassis, with a sharp display and Hall-effect inputs that distinguish it from earlier vertical Anbernic devices. Released in late 2025, this system positions itself as a portrait-orientation counterpart to horizontal flagships at a similar $250 price point. The primary trade-off is ergonomic compromise — extended sessions on demanding titles favor wider, controller-shaped devices over the vertical layout.

---

## 4. kinhank-k59 — KinHank K59

Built around the MediaTek Helio G99, the KinHank K59 is intended as a mid-tier Android handheld targeting PSP, Dreamcast, and consistent PlayStation 2 emulation in a horizontal form factor. It is known for pairing the proven Helio G99 platform with KinHank's broader retro hardware catalog, positioning this system as a value-oriented alternative to higher-priced Snapdragon and Dimensity competitors in the same tier. With a $163 launch price and an early 2026 release window, the device targets buyers who prioritize tier coverage per dollar over flagship performance. The primary trade-off is software polish, since lower-volume manufacturers typically offer less mature firmware and longer community-driven setup paths.

---

## 5. retroid-pocket-classic — Retroid Pocket Classic

Designed around a vertical, Game Boy-inspired chassis, the Retroid Pocket Classic is intended for players seeking a deliberately compact form factor without sacrificing the Android software stack and active update cadence that defines the Retroid lineup. Powered by the Snapdragon G1 Gen 2, it is known for handling 8/16-bit and 32-bit-era libraries cleanly while reaching into PSP and lighter Dreamcast titles. Released in early 2025 at $114, this system positions itself as a pocketable, daily-carry alternative to Retroid's horizontal flagships. The primary trade-off is reduced headroom for sixth-generation emulation and limited ergonomic space for extended multi-hour sessions compared to wider designs.

---

## 6. retroid-pocket-g2 — Retroid Pocket G2

Built around the Snapdragon G2 Gen 2, the Retroid Pocket G2 is intended as a horizontal flagship targeting consistent GameCube and PlayStation 2 emulation alongside the broader Android handheld library. It is known for combining Retroid's mature firmware support with a controller-shaped chassis tuned for longer sessions, positioning this system as a direct competitor to the Odin and AYANEO Pocket lines at a more accessible $219 price point. Released in late 2025, the device emphasizes sustained performance and software stability over peak benchmark figures. The primary trade-off is the configuration overhead common to Android-based handhelds, which favors enthusiasts willing to invest setup time over players seeking immediate, console-style simplicity.

---

## Bulk SQL (review before running)

```sql
UPDATE consoles SET description = $$Engineered around an FPGA core rather than software emulation, the Analogue Pocket is intended to recreate the original cartridge experience of Game Boy, Game Boy Color, and Game Boy Advance hardware at the circuit level. It is known for its sharp 1600×1440 display, premium build quality, and openFPGA support that enables community-developed cores for additional systems. Released in late 2021, this device positions itself as a preservation-grade tool rather than a general-purpose emulation machine. The primary trade-off is a higher entry price and a deliberate scope, since FPGA accuracy comes at the cost of broad post-GBA library coverage.$$ WHERE slug = 'analogue-pocket';

UPDATE consoles SET description = $$Designed as an entry-level vertical handheld in Anbernic's 2024 lineup, the RG40XXV is intended for players seeking 8/16-bit and 32-bit-era libraries in a pocketable form factor. It is known for a budget price point under $70, a comfortable D-pad layout, and a 4-inch display that suits taller aspect-ratio titles such as Game Gear and arcade verticals. Built around the Allwinner H700, this system positions itself as an accessible daily-carry option for casual retro sessions. The primary trade-off is limited headroom — PSP and Dreamcast titles are inconsistent — and a Linux software stack that rewards tinkering over plug-and-play simplicity.$$ WHERE slug = 'anbernic-rg-40xxv';

UPDATE consoles SET description = $$Positioned at the upper end of Anbernic's vertical lineup, the RG477V is intended as a high-tier Android handheld for sixth-generation emulation in a one-handed form factor. Powered by the MediaTek Dimensity 8300, it is known for delivering GameCube and PlayStation 2 performance in a compact chassis, with a sharp display and Hall-effect inputs that distinguish it from earlier vertical Anbernic devices. Released in late 2025, this system positions itself as a portrait-orientation counterpart to horizontal flagships at a similar $250 price point. The primary trade-off is ergonomic compromise — extended sessions on demanding titles favor wider, controller-shaped devices over the vertical layout.$$ WHERE slug = 'anbernic-rg-477v';

UPDATE consoles SET description = $$Built around the MediaTek Helio G99, the KinHank K59 is intended as a mid-tier Android handheld targeting PSP, Dreamcast, and consistent PlayStation 2 emulation in a horizontal form factor. It is known for pairing the proven Helio G99 platform with KinHank's broader retro hardware catalog, positioning this system as a value-oriented alternative to higher-priced Snapdragon and Dimensity competitors in the same tier. With a $163 launch price and an early 2026 release window, the device targets buyers who prioritize tier coverage per dollar over flagship performance. The primary trade-off is software polish, since lower-volume manufacturers typically offer less mature firmware and longer community-driven setup paths.$$ WHERE slug = 'kinhank-k59';

UPDATE consoles SET description = $$Designed around a vertical, Game Boy-inspired chassis, the Retroid Pocket Classic is intended for players seeking a deliberately compact form factor without sacrificing the Android software stack and active update cadence that defines the Retroid lineup. Powered by the Snapdragon G1 Gen 2, it is known for handling 8/16-bit and 32-bit-era libraries cleanly while reaching into PSP and lighter Dreamcast titles. Released in early 2025 at $114, this system positions itself as a pocketable, daily-carry alternative to Retroid's horizontal flagships. The primary trade-off is reduced headroom for sixth-generation emulation and limited ergonomic space for extended multi-hour sessions compared to wider designs.$$ WHERE slug = 'retroid-pocket-classic';

UPDATE consoles SET description = $$Built around the Snapdragon G2 Gen 2, the Retroid Pocket G2 is intended as a horizontal flagship targeting consistent GameCube and PlayStation 2 emulation alongside the broader Android handheld library. It is known for combining Retroid's mature firmware support with a controller-shaped chassis tuned for longer sessions, positioning this system as a direct competitor to the Odin and AYANEO Pocket lines at a more accessible $219 price point. Released in late 2025, the device emphasizes sustained performance and software stability over peak benchmark figures. The primary trade-off is the configuration overhead common to Android-based handhelds, which favors enthusiasts willing to invest setup time over players seeking immediate, console-style simplicity.$$ WHERE slug = 'retroid-pocket-g2';
```
