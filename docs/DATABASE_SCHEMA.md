# Database Schema

This document provides a comprehensive overview of the database schema, including all tables, columns, constraints, and their relationships.

## Entity Relationships

- **profiles** (`id`) references **users** (`id`) - Constraint: `profiles_id_fkey`
- **consoles** (`manufacturer_id`) references **manufacturer** (`id`) - Constraint: `consoles_manufacturer_id_fkey`
- **reviews** (`console_id`) references **consoles** (`id`) - Constraint: `reviews_console_id_fkey`
- **console_variants** (`console_id`) references **consoles** (`id`) - Constraint: `console_variants_console_id_fkey`
- **variant_input_profile** (`variant_id`) references **console_variants** (`id`) - Constraint: `variant_input_profile_variant_id_fkey`
- **emulation_profiles** (`variant_id`) references **console_variants** (`id`) - Constraint: `emulation_profiles_variant_id_fkey`
- **roadmap_features** (`release_id`) references **releases** (`id`) - Constraint: `roadmap_features_release_id_fkey`

---

## Table: `console_variants`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| action_button_mechanism | `text` | `text` | Yes | - | - | - |
| amazon_asin | `text` | `text` | Yes | - | - | - |
| aspect_ratio | `text` | `text` | Yes | - | - | - |
| audio_speakers | `text` | `text` | Yes | - | - | - |
| audio_tech | `text` | `text` | Yes | - | - | - |
| available_colors | `text` | `text` | Yes | - | - | - |
| battery_capacity_mah | `integer` | `int4` | Yes | - | - | - |
| battery_capacity_wh | `numeric` | `numeric` | Yes | - | - | - |
| battery_type | `text` | `text` | Yes | - | - | - |
| biometrics | `text` | `text` | Yes | - | - | - |
| bluetooth_specs | `text` | `text` | Yes | - | - | - |
| body_material | `text` | `text` | Yes | - | - | - |
| brightness_nits | `integer` | `int4` | Yes | - | - | - |
| bumper_mechanism | `text` | `text` | Yes | - | - | - |
| camera_specs | `text` | `text` | Yes | - | - | - |
| cellular_connectivity | `text` | `text` | Yes | - | - | - |
| charging_speed_w | `integer` | `int4` | Yes | - | - | - |
| charging_tech | `text` | `text` | Yes | - | - | - |
| console_id 🔗 | `uuid` | `uuid` | No | - | FK -> consoles.id | - |
| cooling_solution | `text` | `text` | Yes | - | - | - |
| cpu_architecture | `text` | `text` | Yes | - | - | - |
| cpu_clock_max_mhz | `integer` | `int4` | Yes | - | - | - |
| cpu_clock_min_mhz | `integer` | `int4` | Yes | - | - | - |
| cpu_cores | `integer` | `int4` | Yes | - | - | - |
| cpu_model | `text` | `text` | Yes | - | - | - |
| cpu_process_node | `text` | `text` | Yes | - | - | - |
| cpu_threads | `integer` | `int4` | Yes | - | - | - |
| created_at | `timestamp with time zone` | `timestamptz` | No | `timezone('utc'::text, now())` | - | - |
| depth_mm | `numeric` | `numeric` | Yes | - | - | - |
| display_tech | `text` | `text` | Yes | - | - | - |
| display_type | `text` | `text` | Yes | - | - | - |
| dpad_mechanism | `text` | `text` | Yes | - | - | - |
| dpad_shape | `text` | `text` | Yes | - | - | - |
| gpu_architecture | `text` | `text` | Yes | - | - | - |
| gpu_clock_mhz | `integer` | `int4` | Yes | - | - | - |
| gpu_compute_units | `text` | `text` | Yes | - | - | - |
| gpu_cores | `integer` | `int4` | Yes | - | - | - |
| gpu_model | `text` | `text` | Yes | - | - | - |
| gpu_teraflops | `numeric` | `numeric` | Yes | - | - | - |
| gyro | `boolean` | `bool` | Yes | `false` | - | - |
| haptics | `text` | `text` | Yes | - | - | - |
| has_back_buttons | `boolean` | `bool` | Yes | `false` | - | - |
| has_headphone_jack | `boolean` | `bool` | Yes | `true` | - | - |
| has_keyboard | `boolean` | `bool` | Yes | `false` | - | - |
| has_microphone | `boolean` | `bool` | Yes | `false` | - | - |
| has_stick_clicks | `boolean` | `bool` | Yes | `true` | - | - |
| height_mm | `numeric` | `numeric` | Yes | - | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `extensions.uuid_generate_v4()` | - | - |
| image_url | `text` | `text` | Yes | - | - | - |
| input_layout | `text` | `text` | Yes | - | - | - |
| is_default | `boolean` | `bool` | Yes | `false` | - | - |
| model_no | `text` | `text` | Yes | - | - | - |
| os | `text` | `text` | Yes | - | - | - |
| other_buttons | `text` | `text` | Yes | - | - | - |
| other_connectivity | `text` | `text` | Yes | - | - | - |
| ports | `text` | `text` | Yes | - | - | - |
| ppi | `integer` | `int4` | Yes | - | - | - |
| price_launch_usd | `integer` | `int4` | Yes | - | - | - |
| ram_mb | `integer` | `int4` | Yes | - | - | - |
| ram_speed_mhz | `integer` | `int4` | Yes | - | - | - |
| ram_type | `text` | `text` | Yes | - | - | - |
| refresh_rate_hz | `integer` | `int4` | Yes | `60` | - | - |
| release_date | `date` | `date` | Yes | - | - | - |
| release_date_precision | `USER-DEFINED` | `rc_date_precision` | Yes | `'year'::rc_date_precision` | - | `year`, `month`, `day` |
| screen_resolution_x | `integer` | `int4` | Yes | - | - | - |
| screen_resolution_y | `integer` | `int4` | Yes | - | - | - |
| screen_size_inch | `numeric` | `numeric` | Yes | - | - | - |
| second_screen_aspect_ratio | `text` | `text` | Yes | - | - | - |
| second_screen_nits | `integer` | `int4` | Yes | - | - | - |
| second_screen_ppi | `integer` | `int4` | Yes | - | - | - |
| second_screen_refresh_rate | `integer` | `int4` | Yes | - | - | - |
| second_screen_resolution_x | `integer` | `int4` | Yes | - | - | - |
| second_screen_resolution_y | `integer` | `int4` | Yes | - | - | - |
| second_screen_size | `numeric` | `numeric` | Yes | - | - | - |
| second_screen_touch | `boolean` | `bool` | Yes | `false` | - | - |
| shoulder_layout | `text` | `text` | Yes | - | - | - |
| slug | `text` | `text` | Yes | - | - | - |
| storage_expandable | `boolean` | `bool` | Yes | `true` | - | - |
| storage_gb | `integer` | `int4` | Yes | - | - | - |
| storage_type | `text` | `text` | Yes | - | - | - |
| tdp_wattage | `integer` | `int4` | Yes | - | - | - |
| thumbstick_cap | `text` | `text` | Yes | - | - | - |
| thumbstick_layout | `text` | `text` | Yes | - | - | - |
| thumbstick_mechanism | `text` | `text` | Yes | - | - | - |
| touchscreen | `boolean` | `bool` | Yes | `false` | - | - |
| trigger_mechanism | `text` | `text` | Yes | - | - | - |
| ui_skin | `text` | `text` | Yes | - | - | - |
| variant_name | `text` | `text` | Yes | `'Standard Model'::text` | - | - |
| video_out | `text` | `text` | Yes | - | - | - |
| weight_g | `integer` | `int4` | Yes | - | - | - |
| width_mm | `numeric` | `numeric` | Yes | - | - | - |
| wifi_specs | `text` | `text` | Yes | - | - | - |

---

## Table: `consoles`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| chassis_features | `text` | `text` | Yes | - | - | - |
| community_score | `smallint` | `int2` | Yes | - | CHECK: `community_score >= 1 AND community_score <= 5` | - |
| created_at | `timestamp with time zone` | `timestamptz` | No | `timezone('utc'::text, now())` | - | - |
| description | `text` | `text` | Yes | - | - | - |
| device_category | `text` | `text` | Yes | `'emulation'::text` | - | - |
| form_factor | `text` | `text` | Yes | - | - | - |
| has_cartridge_slot | `boolean` | `bool` | Yes | `false` | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `extensions.uuid_generate_v4()` | - | - |
| image_url | `text` | `text` | Yes | - | - | - |
| manufacturer_id 🔗 | `uuid` | `uuid` | No | - | FK -> manufacturer.id | - |
| name | `text` | `text` | No | - | - | - |
| og_icon_url | `text` | `text` | Yes | - | - | - |
| setup_ease_score | `smallint` | `int2` | Yes | - | CHECK: `setup_ease_score >= 1 AND setup_ease_score <= 5` | - |
| slug | `text` | `text` | No | - | UNIQUE | - |
| status | `USER-DEFINED` | `content_status` | No | `'draft'::content_status` | - | `draft`, `published`, `archived`, `review` |
| supported_cartridge_types | `text` | `text` | Yes | - | - | - |
| updated_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |

---

## Table: `emulation_profiles`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| dreamcast_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| gamecube_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| gb_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| gba_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| gbc_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| genesis_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `gen_random_uuid()` | - | - |
| last_verified | `date` | `date` | Yes | `CURRENT_DATE` | - | - |
| master_system | `text` | `text` | Yes | `'N/A'::text` | - | - |
| n64_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| nds_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| nes_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| ps1_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| ps2_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| ps3_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| psp_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| saturn_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| snes_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| source | `text` | `text` | Yes | - | - | - |
| summary_text | `text` | `text` | Yes | - | - | - |
| switch_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| updated_at | `timestamp with time zone` | `timestamptz` | Yes | `timezone('utc'::text, now())` | - | - |
| variant_id 🔗 | `uuid` | `uuid` | No | - | UNIQUE<br>FK -> console_variants.id | - |
| vita_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| wii_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| wii_u | `text` | `text` | Yes | `'N/A'::text` | - | - |
| x3ds_state | `text` | `text` | Yes | `'N/A'::text` | - | - |
| xbox | `text` | `text` | Yes | `'N/A'::text` | - | - |
| xbox_360 | `text` | `text` | Yes | `'N/A'::text` | - | - |

---

## Table: `manufacturer`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| brand_color | `text` | `text` | Yes | - | - | - |
| country | `text` | `text` | Yes | - | - | - |
| created_at | `timestamp with time zone` | `timestamptz` | No | `timezone('utc'::text, now())` | - | - |
| description | `text` | `text` | Yes | - | - | - |
| founded_year | `integer` | `int4` | Yes | - | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `extensions.uuid_generate_v4()` | - | - |
| image_url | `text` | `text` | Yes | - | - | - |
| key_franchises | `text` | `text` | Yes | - | - | - |
| name | `text` | `text` | No | - | - | - |
| slug | `text` | `text` | No | - | UNIQUE | - |
| website | `text` | `text` | Yes | - | - | - |

---

## Table: `news`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| author | `text` | `text` | No | `'Editorial'::text` | - | - |
| category | `text` | `text` | No | `'announcement'::text` | CHECK: `category = ANY (ARRAY['announcement'::text, 'rumor'::text, 'release'::text, 'guide'::text])` | - |
| content | `text` | `text` | Yes | - | - | - |
| created_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |
| excerpt | `text` | `text` | No | - | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `gen_random_uuid()` | - | - |
| image_url | `text` | `text` | Yes | - | - | - |
| published_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |
| slug | `text` | `text` | No | - | UNIQUE | - |
| title | `text` | `text` | No | - | - | - |
| updated_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |

---

## Table: `profiles`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| avatar_id | `text` | `text` | Yes | `'pilot'::text` | - | - |
| created_at | `timestamp with time zone` | `timestamptz` | No | `timezone('utc'::text, now())` | - | - |
| **id** 🔑 🔗 | `uuid` | `uuid` | No | - | FK -> users.id | - |
| role | `text` | `text` | Yes | `'user'::text` | - | - |
| updated_at | `timestamp with time zone` | `timestamptz` | Yes | - | - | - |
| username | `text` | `text` | Yes | - | - | - |

---

## Table: `releases`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| created_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |
| description | `text` | `text` | Yes | - | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `gen_random_uuid()` | - | - |
| is_published | `boolean` | `bool` | Yes | `false` | - | - |
| release_date | `date` | `date` | Yes | `CURRENT_DATE` | - | - |
| title | `text` | `text` | Yes | - | - | - |
| updated_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |
| version | `text` | `text` | No | - | UNIQUE | - |

---

## Table: `reviews`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| author | `text` | `text` | No | `'Jules'::text` | - | - |
| cons | `ARRAY` | `_text` | Yes | `'{}'::text[]` | - | - |
| console_id 🔗 | `uuid` | `uuid` | No | - | FK -> consoles.id | - |
| console_name | `text` | `text` | No | - | - | - |
| console_slug | `text` | `text` | No | - | - | - |
| created_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `gen_random_uuid()` | - | - |
| image_url | `text` | `text` | Yes | - | - | - |
| pros | `ARRAY` | `_text` | Yes | `'{}'::text[]` | - | - |
| published_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |
| score | `numeric` | `numeric` | No | - | CHECK: `score >= 0::numeric AND score <= 10::numeric` | - |
| summary | `text` | `text` | No | - | - | - |
| title | `text` | `text` | No | - | - | - |
| updated_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |

---

## Table: `roadmap_features`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| category | `text` | `text` | No | - | - | - |
| created_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |
| description | `text` | `text` | Yes | - | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `gen_random_uuid()` | - | - |
| priority | `text` | `text` | Yes | - | CHECK: `priority = ANY (ARRAY['critical'::text, 'must-have'::text, 'nice-to-have'::text])` | - |
| release_id 🔗 | `uuid` | `uuid` | Yes | - | FK -> releases.id | - |
| status | `text` | `text` | No | - | CHECK: `status = ANY (ARRAY['planned'::text, 'in-progress'::text, 'completed'::text])` | - |
| target_date | `date` | `date` | Yes | - | - | - |
| title | `text` | `text` | No | - | - | - |
| updated_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |

---

## Table: `signals`

- **RLS Enabled:** true
- **Primary Keys:** `id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| content | `text` | `text` | No | - | - | - |
| created_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |
| **id** 🔑 | `uuid` | `uuid` | No | `gen_random_uuid()` | - | - |
| is_active | `boolean` | `bool` | Yes | `true` | - | - |
| type | `text` | `text` | No | `'status'::text` | CHECK: `type = ANY (ARRAY['status'::text, 'alert'::text, 'update'::text, 'thought'::text])` | - |
| updated_at | `timestamp with time zone` | `timestamptz` | Yes | `now()` | - | - |

---

## Table: `variant_input_profile`

- **RLS Enabled:** true
- **Primary Keys:** `variant_id`

| Column | Data Type | Format | Nullable | Default | Constraints / Checks | Enums |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| back_button_count | `smallint` | `int2` | Yes | - | CHECK: `back_button_count = ANY (ARRAY[0, 2, 4])` | - |
| bumper_tech | `USER-DEFINED` | `rc_button_tech` | Yes | - | - | `membrane`, `microswitch`, `mechanical`, `hall`, `potentiometer`, `spring`, `optical`, `unknown` |
| created_at | `timestamp with time zone` | `timestamptz` | No | `timezone('utc'::text, now())` | - | - |
| dpad_placement | `USER-DEFINED` | `rc_placement` | Yes | - | - | `left`, `right`, `center`, `unknown`, `top`, `bottom` |
| dpad_shape | `USER-DEFINED` | `rc_dpad_shape` | Yes | - | - | `cross`, `disc`, `segmented`, `unknown` |
| dpad_tech | `USER-DEFINED` | `rc_button_tech` | Yes | - | - | `membrane`, `microswitch`, `mechanical`, `hall`, `potentiometer`, `spring`, `optical`, `unknown` |
| face_button_count | `smallint` | `int2` | Yes | - | CHECK: `face_button_count = ANY (ARRAY[2, 4, 6])` | - |
| face_button_tech | `USER-DEFINED` | `rc_button_tech` | Yes | - | - | `membrane`, `microswitch`, `mechanical`, `hall`, `potentiometer`, `spring`, `optical`, `unknown` |
| face_label_scheme | `USER-DEFINED` | `rc_label_scheme` | Yes | - | - | `nintendo`, `xbox`, `playstation`, `generic`, `unknown` |
| has_gyro | `boolean` | `bool` | Yes | - | - | - |
| has_keyboard | `boolean` | `bool` | Yes | - | - | - |
| input_confidence | `USER-DEFINED` | `rc_confidence` | No | `'unknown'::rc_confidence` | - | `confirmed`, `inferred`, `unknown` |
| input_notes | `text` | `text` | Yes | - | - | - |
| stick_cap | `USER-DEFINED` | `rc_stick_cap` | Yes | - | - | `concave`, `convex`, `flat`, `domed`, `textured`, `unknown` |
| stick_clicks | `boolean` | `bool` | Yes | - | - | - |
| stick_count | `smallint` | `int2` | Yes | - | CHECK: `stick_count = ANY (ARRAY[0, 1, 2])` | - |
| stick_layout | `USER-DEFINED` | `rc_stick_layout` | Yes | - | - | `symmetric`, `asymmetric`, `centered`, `unknown` |
| stick_tech | `USER-DEFINED` | `rc_button_tech` | Yes | - | - | `membrane`, `microswitch`, `mechanical`, `hall`, `potentiometer`, `spring`, `optical`, `unknown` |
| system_button_set | `USER-DEFINED` | `rc_system_button_set` | Yes | - | - | `minimal`, `standard`, `extended`, `unknown` |
| system_buttons_text | `text` | `text` | Yes | - | - | - |
| touchpad_clickable | `boolean` | `bool` | Yes | - | - | - |
| touchpad_count | `smallint` | `int2` | Yes | - | CHECK: `touchpad_count = ANY (ARRAY[0, 1, 2])` | - |
| trigger_layout | `USER-DEFINED` | `rc_trigger_layout` | Yes | - | - | `inline`, `stacked`, `unknown` |
| trigger_tech | `USER-DEFINED` | `rc_button_tech` | Yes | - | - | `membrane`, `microswitch`, `mechanical`, `hall`, `potentiometer`, `spring`, `optical`, `unknown` |
| trigger_type | `USER-DEFINED` | `rc_trigger_type` | Yes | - | - | `digital`, `analog`, `unknown` |
| updated_at | `timestamp with time zone` | `timestamptz` | No | `timezone('utc'::text, now())` | - | - |
| **variant_id** 🔑 🔗 | `uuid` | `uuid` | No | - | FK -> console_variants.id | - |

---
