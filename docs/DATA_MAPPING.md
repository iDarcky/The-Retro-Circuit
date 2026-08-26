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
| 42 | Battery | `battery_capacity_mah` |
| 43 | Cooling | `cooling_solution` |
| 50 | Storage | `storage_type` — **see Known problems** |
| 51 | Connectivity | `other_connectivity` — **see Known problems** |
| 52 | Video Output | `video_out` |
| 60 | Dimensions | `width_mm`, `height_mm`, `depth_mm` |
| 61 | Weight | `weight_g` |
| 62 | Shell Material | `body_material` |
| 63 | Colors | `available_colors` |
| 70 | Price (average) | `price_launch_usd` — **misnamed, see Known problems** |

### Dropped by the import — target column exists

These were simply never mapped. The database is ready for them.

| Col | Sheet header | Should go to |
|---|---|---|
| 44 | D-Pad | `variant_input_profile.dpad_tech` + `dpad_shape` |
| 45 | Analogs | `variant_input_profile.stick_count` + `stick_tech` + `stick_layout` |
| 46 | Face Buttons | `variant_input_profile.face_button_count` + `face_button_tech` |
| 47 | Shoulder Buttons | `variant_input_profile.bumper_tech` + `trigger_tech` + `trigger_layout` |
| 48 | Extra Buttons | `variant_input_profile.back_button_count` + `system_buttons_text` |
| 49 | Charge Port | `console_variants.ports` |
| 53 | Audio Output | `console_variants.audio_tech` |
| 54 | Speaker | `console_variants.audio_speakers` |
| 55 | Rumble | `console_variants.haptics` |
| 56 | Sensors | `console_variants.gyro` (+ new field, see below) |

### Dropped — no target column yet

| Col | Sheet header | Suggested home |
|---|---|---|
| 6 | Performance Rating | new `console_variants.performance_grade` |
| 41 | Screen Lens | new `console_variants.screen_lens` |
| 57–59 | Volume / Brightness / Power Control | `variant_input_profile.system_buttons_text` |
| 64–68 | Video Review ×5 | new `console_links` table (`kind='video_review'`) |
| 69 | Written Review | same table, `kind='written_review'` |
| 71 | Pricing Category | new `consoles.price_tier` |
| 72–76 | Vendor Link ×5 | same table, `kind='vendor'` |
| 77 / 78 | Pros / Cons | new `consoles.pros` / `cons` (text[]) |
| 79 | Emulation Limit | `emulation_profiles.summary_text` |
| 80 | Notes | `consoles.description` if empty, else a `notes` column |

A single `console_links(console_id, kind, url, label, sort_order)` table covers columns
64–68, 69 and 72–76 — eleven sheet columns, one table.

---

## Known problems in the current data

**Storage is one free-text blob.** Column 50 ("Internal 8 GB eMMC, Dual External MicroSD")
went entirely into `storage_type`, even though `storage_gb` and `storage_expandable`
exist. It needs parsing into: base capacity, storage type, expandable yes/no, and a new
`microsd_type` field for UHS-I / UHS-II.

**WiFi and Bluetooth are lumped together.** Column 51 went into `other_connectivity`,
but `wifi_specs` and `bluetooth_specs` are separate columns. "WiFi 5, Bluetooth 4.2"
should split across both.

**`price_launch_usd` holds an average price.** The sheet column is "Price (average)".
Either rename the column to `price_avg_usd`, or add it alongside and keep launch price
for what it says. Affiliate copy currently implies launch price.

**`cpu_architecture` vs `cpu_arch`.** The first is free text from the sheet ("ARM",
"x86-64"). The second is a strict enum (`arm64`, `arm32`, `x86_64`, `other`) used for
filtering, and is not populated by the import. Rough mapping: ARM 64-bit → `arm64`,
older ARM → `arm32`, anything x86 → `x86_64`, MIPS/Xtensa/RISC-V → `other`.

**Dual-screen fields are unused.** `second_screen_size`, `second_screen_resolution_x/y`,
`second_screen_touch`, `second_screen_ppi`, `second_screen_refresh_rate` all exist and
are empty — including on the Anbernic RG DS, where the second screen is the point.

**`soc` was 0 of 273 filled** until a partial backfill on 2026-08-26 (226 filled from
`cpu_model` where the value was clearly a chipset). 47 rows still need it by hand —
those are the ones where `cpu_model` holds a CPU core ("Cortex-A53") rather than an SoC.
