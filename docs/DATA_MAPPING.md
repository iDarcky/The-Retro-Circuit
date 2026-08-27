# Spreadsheet → Database mapping

Written 2026-08-26 after an import that dropped roughly half the source columns.
This is the reference for where each spreadsheet column belongs. Update it whenever a
column is added on either side.

The catalogue spans **four tables**. Knowing which is which is most of the confusion:

| Table | Holds | One row per |
|---|---|---|
| `consoles` | identity — name, slug, brand, form factor, category, status, description, cover image | device |
| `console_variants` | every hardware spec | configuration (Base / Pro / 8GB…) |
| `variant_input_profile` | **all button and control detail** | variant (auto-created by trigger) |
| `emulation_profiles` | per-system performance grades | variant (auto-created by trigger) |

`variant_input_profile` is the one that catches people out: D-Pad, analogs, face buttons,
shoulders and extra buttons do **not** live on `console_variants`.

---

## Column-by-column

Columns are 1-indexed as they appear in `handhelds_v3.xlsx` / `v4`.

### Imported correctly

| Col | Sheet header | Goes to |
|---|---|---|
| 1 | Handheld | `consoles.name` |
| 2 | Brand | `consoles.manufacturer_id` (via `manufacturer.slug`) |
| 3 | Released | `console_variants.release_date` + `release_date_precision` |
| 4 | Form Factor | `consoles.form_factor` |
| 5 | OS | `console_variants.os` (free text) + `os_family` (enum) + `os_version` |
| 7–24 | Emulation grades | `emulation_profiles.*_state` |
| 25 | SoC | `console_variants.soc` |
| 26–29 | CPU / cores / threads / clock | `cpu_model`, `cpu_cores`, `cpu_threads`, `cpu_clock_max_mhz` |
| 30 | Architecture | `cpu_architecture` (free text). **`cpu_arch` enum is separate** |
| 31–33 | GPU / cores / clock | `gpu_model`, `gpu_cores`, `gpu_clock_mhz` |
| 34 | RAM | `ram_mb` |
| 35–40 | Screen size / type / refresh / resolution / PPI / aspect | `screen_size_inch`, `display_type`, `refresh_rate_hz`, `screen_resolution_x/y`, `ppi`, `aspect_ratio` |
| 42 | Battery | `battery_capacity_mah` (ARM devices) **or** `battery_capacity_wh` (x86 devices — see Known problems) |
| 43 | Cooling | `cooling_solution` |
| 50 | Storage | `storage_gb` + `storage_type` + `storage_expandable` + `microsd_type` (split by the v5 converter) |
| 51 | Connectivity | split across `wifi_specs` + `bluetooth_specs` + `other_connectivity` |
| 52 | Video Output | `video_out` |
| 60 | Dimensions | `width_mm`, `height_mm`, `depth_mm` |
| 61 | Weight | `weight_g` |
| 62 | Shell Material | `body_material` |
| 63 | Colors | `available_colors` |
| 70 | Price (average) | `price_avg_usd` (**not** `price_launch_usd` — see Known problems) |

### Controls — where each sheet value actually lands

Now imported. The sheet's vocabulary is **not** the database's, and two columns do not go
where their sheet name suggests. `scripts/gen_import_chunks.py` holds the translation table
(`IPMAP`); this is the same mapping in prose.

| Sheet value | Column | Stored as |
|---|---|---|
| D-Pad shape `Cross` / `Disc` | `dpad_shape` | `cross` / `disc` |
| D-Pad placement `Upper` / `Lower` / `Middle` | `dpad_placement` | `top` / `bottom` / `center` |
| Analog `Hall` / `TMR` / `ALPS` | `stick_tech` | `hall` / `tmr` / `potentiometer` |
| Analog placement `Upper` / `Lower` | **`stick_placement`** | `top` / `bottom` |
| Shoulder `Digital` / `Analog` | **`bumper_type`** / **`trigger_type`** | `digital` / `analog` |
| Trigger layout `Horizontal` / `Vertical` / `Shelf` | `trigger_layout` | `inline` / `stacked` / `shelf` |

Two traps worth stating outright:

- The sheet's **"stick layout"** column holds `Upper`/`Lower` — that is *where the sticks
  sit*, so it goes to `stick_placement`. The database's `stick_layout` means
  symmetric/asymmetric (the DualShock-vs-Xbox distinction) and is a different fact.
- The sheet's **"bumper tech" / "trigger tech"** columns hold `Digital`/`Analog` — that is a
  *type*, not a technology, so they go to `bumper_type` / `trigger_type`. The `_tech`
  columns are for membrane/microswitch/hall and stay empty until someone fills them in.

| Col | Sheet header | Goes to |
|---|---|---|
| 44 | D-Pad | `variant_input_profile.dpad_shape` + `dpad_placement` |
| 45 | Analogs | `variant_input_profile.stick_count` + `stick_tech` + `stick_placement` |
| 46 | Face Buttons | `variant_input_profile.face_button_count` |
| 47 | Shoulder Buttons | `variant_input_profile.bumper_type` + `trigger_type` + `trigger_layout` |
| 48 | Extra Buttons | `variant_input_profile.system_buttons_text` + `input_notes` |
| 49 | Charge Port | `console_variants.ports` |
| 53 | Audio Output | `console_variants.audio_tech` |
| 54 | Speaker | `console_variants.audio_speakers` |
| 55 | Rumble | `console_variants.haptics` |
| 56 | Sensors | `console_variants.gyro` (+ new field, see below) |

### Previously dropped — now imported

| Col | Sheet header | Goes to |
|---|---|---|
| 6 | Performance Rating | `console_variants.performance_grade` — **see Known problems** |
| 41 | Screen Lens | `console_variants.screen_lens` |
| 57–59 | Volume / Brightness / Power Control | `variant_input_profile.system_buttons_text` + `input_notes` |
| 64–68 | Video Review ×5 | `console_links` (`kind='video_review'`) |
| 69 | Written Review | `console_links` (`kind='written_review'`) |
| 72–76 | Vendor Link ×5 | `console_links` (`kind='vendor'`) |

A single `console_links(console_id, kind, url, label, sort_order)` table covers columns
64–68, 69 and 72–76 — eleven sheet columns, one table. 1,332 rows across 238 consoles.
The links live behind cell *hyperlinks*, not cell text, so the converter reads
`cell.hyperlink.target` rather than the visible label.

### Still dropped — no target column yet

| Col | Sheet header | Suggested home |
|---|---|---|
| 71 | Pricing Category | new `consoles.price_tier` |
| 77 / 78 | Pros / Cons | new `consoles.pros` / `cons` (text[]) |
| 79 | Emulation Limit | `emulation_profiles.summary_text` |
| 80 | Notes | `consoles.description` if empty, else a `notes` column |

---

## Known problems in the current data

**`performance_grade` may be on the wrong scale.** The converter's `stars()` assumes the
sheet's rating is out of 5 and emits `"N/5"`. 25 devices came out above their own
denominator (`5.25/5`, `5.5/5`), so either the sheet's scale runs past 5 or `stars()`
over-counts a glyph. They were clamped to `5/5` so no page shows an impossible score —
**check the source sheet and rescale properly.** The v4 (Windows) sheet uses 🔥 instead of
⭐; those were converted to the same `N/5` string so one column carries one scale.

**Battery: two different units in one column.** ARM handhelds are spec'd in mAh, x86 ones
in watt-hours, and both landed in `battery_capacity_mah` — an 80Wh ROG Ally X rendered as
"80 mAh". Wh values now live in `battery_capacity_wh`. Values of `2`/`3` (cell *counts*)
and `18650` (a cell *format*) were cleared, as none is a capacity.

**Third-party affiliate links were stripped on import.** The source sheet's vendor URLs
carried other people's publisher IDs — an Amazon `tag=retrodeadfred-20`, `s.click.aliexpress`
shortlinks, Impact Radius `irclickid` on Best Buy, Banggood `custlinkid`, and shop `aff=`
codes. Publishing those hands our outbound clicks to someone else's account, so the tracking
was removed and the bare product URLs kept. **Re-check this on any future import.**

**Amazon vendor links in `console_links` are stored raw and carry no tag.** This is
deliberate — the tag belongs to the rendering layer, not the data. `ConsoleLinks.tsx`
rebuilds them through `getBuyUrl`. Anything else that renders these rows must do the
same, or the click earns nothing.

**`price_avg_usd` is the average, not launch.** The sheet column is "Price (average)" and
now imports to `price_avg_usd`. `price_launch_usd` still exists and means what it says —
don't mix them in affiliate copy. Sheet values of `1` were "TBA" placeholders and were
cleared.

**`soc` was 0 of 273 filled** until a partial backfill on 2026-08-26 (226 filled from
`cpu_model` where the value was clearly a chipset). 47 rows still need it by hand —
those are the ones where `cpu_model` holds a CPU core ("Cortex-A53") rather than an SoC.

**Dual-boot devices flatten to one `os_family`.** 54 variants list two systems in the
free-text `os` ("Linux (Steam OS) / Windows 11", "Android 10 / Linux"). `os_family` is a
single enum and holds the *primary* shipping OS, which is the right call — but it means
no filter can answer "which devices dual-boot". If that becomes a Finder facet it needs
its own boolean; do not split one device into two variants for it.

**The `_tech` input columns are empty.** `dpad_tech`, `face_button_tech`, `bumper_tech`,
`trigger_tech` are for membrane/microswitch/hall. The sheet has no such column, so they
stay blank; only `stick_tech` is populated (from the Hall/TMR/ALPS column).

**22 consoles still have no variant.** They pre-date these spreadsheets and appear in
neither (18 draft, 4 archived) — mostly Anbernic RG-351/RG-405, 1UP, 8BCraft, Acer Nitro
Blaze and the Ayn Loki line.
