"""
gen_import_chunks.py — emit the import as SQL chunks small enough to send one at a time.

Used when the import has to go through a database connection rather than
scripts/import-consoles.ts. Payloads are positional arrays (not key/value objects) and
emulation grades are squashed to one character per system, which cuts the wire size
roughly in half.

    python3 scripts/gen_import_chunks.py <outdir>
"""
import json, os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rows = json.load(open(os.path.join(ROOT, 'v3_import.json'))) + \
       json.load(open(os.path.join(ROOT, 'v4_import.json')))

VCOLS = ['variant_name', 'is_default', 'price_avg_usd', 'cpu_model', 'cpu_cores', 'cpu_threads',
 'cpu_clock_max_mhz', 'gpu_model', 'gpu_cores', 'gpu_clock_mhz', 'os', 'os_family', 'os_version',
 'soc', 'cpu_architecture', 'cpu_arch', 'ram_mb', 'storage_gb', 'storage_type', 'storage_expandable',
 'microsd_type', 'screen_size_inch', 'screen_resolution_x', 'screen_resolution_y', 'display_type',
 'refresh_rate_hz', 'ppi', 'aspect_ratio', 'screen_lens', 'battery_capacity_mah', 'cooling_solution',
 'ports', 'wifi_specs', 'bluetooth_specs', 'other_connectivity', 'video_out', 'audio_tech',
 'audio_speakers', 'has_headphone_jack', 'haptics', 'sensors', 'has_microphone', 'gyro',
 'performance_grade', 'weight_g', 'body_material', 'available_colors', 'width_mm', 'height_mm',
 'depth_mm', 'release_date', 'release_date_precision', 'touchscreen']
VTYPES = ['text', 'boolean', 'numeric', 'text', 'integer', 'integer', 'integer', 'text', 'integer',
 'integer', 'text', 'os_family', 'text', 'text', 'text', 'cpu_arch', 'integer', 'numeric', 'text',
 'boolean', 'text', 'numeric', 'integer', 'integer', 'text', 'integer', 'integer', 'text', 'text',
 'integer', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'text', 'boolean', 'boolean',
 'text', 'boolean', 'boolean', 'text', 'integer', 'text', 'text', 'numeric', 'numeric', 'numeric',
 'date', 'rc_date_precision', 'boolean']
assert len(VCOLS) == len(VTYPES)

# The sheet's control vocabulary is not the database's. Each entry is
# (json key from the converter, target column, target type, value map) — the map is None
# when the value passes through unchanged. Two sheet columns land somewhere other than
# where their name suggests:
#   * "stick_layout" holds Upper/Lower, i.e. where the sticks sit, which is
#     stick_placement. rc_stick_layout means symmetric/asymmetric and is left alone.
#   * "bumper_tech"/"trigger_tech" hold Digital/Analog, which is a *type*, not a
#     technology, so they go to bumper_type/trigger_type. The _tech columns stay for
#     membrane/microswitch/etc.
PLACEMENT = {'Upper': 'top', 'Lower': 'bottom', 'Middle': 'center'}
IPMAP = [
    ('dpad_shape', 'dpad_shape', 'rc_dpad_shape', {'Cross': 'cross', 'Disc': 'disc'}),
    ('dpad_placement', 'dpad_placement', 'rc_placement', PLACEMENT),
    ('face_button_count', 'face_button_count', 'smallint', None),
    ('stick_count', 'stick_count', 'smallint', None),
    # ALPS is a manufacturer, but its sticks in these handhelds are potentiometer-based.
    ('stick_tech', 'stick_tech', 'rc_button_tech',
     {'Hall': 'hall', 'TMR': 'tmr', 'ALPS': 'potentiometer'}),
    ('stick_clicks', 'stick_clicks', 'boolean', None),
    ('stick_layout', 'stick_placement', 'rc_placement', PLACEMENT),
    ('bumper_tech', 'bumper_type', 'rc_trigger_type', {'Digital': 'digital', 'Analog': 'analog'}),
    ('trigger_tech', 'trigger_type', 'rc_trigger_type', {'Digital': 'digital', 'Analog': 'analog'}),
    ('trigger_layout', 'trigger_layout', 'rc_trigger_layout',
     {'Horizontal': 'inline', 'Vertical': 'stacked', 'Shelf': 'shelf'}),
    ('system_buttons_text', 'system_buttons_text', 'text', None),
    ('has_gyro', 'has_gyro', 'boolean', None),
    ('input_notes', 'input_notes', 'text', None),
]
IPCOLS = [c for _, c, _, _ in IPMAP]
IPTYPES = [t for _, _, t, _ in IPMAP]

EMUCOLS = ['gb_state', 'gbc_state', 'nes_state', 'genesis_state', 'gba_state', 'snes_state',
 'ps1_state', 'nds_state', 'n64_state', 'dreamcast_state', 'psp_state', 'saturn_state',
 'gamecube_state', 'x3ds_state', 'wii_state', 'ps2_state', 'switch_state', 'wii_u', 'ps3_state']
G2C = {'Perfect': 'P', 'Great': 'G', 'Playable': 'Y', 'Struggles': 'S', 'Unplayable': 'U'}


def split(data, budget):
    out, cur, size = [], [], 0
    for row in data:
        s = len(json.dumps(row, ensure_ascii=False, separators=(',', ':')))
        if size + s > budget and cur:
            out.append(cur); cur = []; size = 0
        cur.append(row); size += s
    if cur:
        out.append(cur)
    return out


def emit(prefix, data, build, budget=19000):
    n = 0
    for ch in split(data, budget):
        j = json.dumps(ch, ensure_ascii=False, separators=(',', ':')).replace("'", "''")
        open(os.path.join(OUT, f'{prefix}{n}.sql'), 'w').write(build(j))
        n += 1
    return n


vdata = [[r['slug']] + [r['variants'][0].get(c) for c in VCOLS] for r in rows]
vsel = ', '.join(f'(e->>{i+1})::{t}' for i, t in enumerate(VTYPES))
nv = emit('PV', vdata, lambda j: (
    f"insert into console_variants (console_id, {', '.join(VCOLS)}) select c.id, {vsel} "
    f"from jsonb_array_elements('{j}'::jsonb) e join consoles c on c.slug=(e->>0) "
    "where not exists (select 1 from console_variants x where x.console_id=c.id);"))

def ipvalue(profile, key, vmap):
    """Sheet value → database label. An unmapped value is dropped rather than guessed."""
    raw = profile.get(key)
    if raw is None or vmap is None:
        return raw
    return vmap.get(raw)


ipdata = [[r['slug']] + [ipvalue(r['variants'][0]['input_profile'], k, m) for k, _, _, m in IPMAP]
          for r in rows if r['variants'][0].get('input_profile')]
ipset = ', '.join(f'{c}=(e->>{i+1})::{t}' for i, (c, t) in enumerate(zip(IPCOLS, IPTYPES)))
nip = emit('PI', ipdata, lambda j: (
    f"update variant_input_profile p set {ipset} from jsonb_array_elements('{j}'::jsonb) e "
    "join consoles c on c.slug=(e->>0) join console_variants v on v.console_id=c.id "
    "where p.variant_id=v.id;"))

emdata = []
for r in rows:
    emu = r['variants'][0].get('emulation') or {}
    code = ''.join(G2C.get(emu.get(c), '-') for c in EMUCOLS)
    if code.strip('-'):
        emdata.append([r['slug'], code])
cases = []
for i, c in enumerate(EMUCOLS):
    cases.append(
        f"{c}=(case substr(e->>1,{i+1},1) when 'P' then 'Perfect' when 'G' then 'Great' "
        f"when 'Y' then 'Playable' when 'S' then 'Struggles' when 'U' then 'Unplayable' "
        "else null end)")
emset = ', '.join(cases)
nem = emit('PE', emdata, lambda j: (
    f"update emulation_profiles p set {emset} from jsonb_array_elements('{j}'::jsonb) e "
    "join consoles c on c.slug=(e->>0) join console_variants v on v.console_id=c.id "
    "where p.variant_id=v.id;"), budget=5000)

ldata = [[r['slug'], l.get('kind'), l.get('url'), l.get('label'), l.get('sort_order', 0)]
         for r in rows for l in r.get('links', [])]
nl = emit('PL', ldata, lambda j: (
    "insert into console_links (console_id, kind, url, label, sort_order) "
    "select c.id,(e->>1)::console_link_kind,(e->>2),(e->>3),(e->>4)::integer "
    f"from jsonb_array_elements('{j}'::jsonb) e join consoles c on c.slug=(e->>0);"))

biggest = lambda p, n: max(os.path.getsize(os.path.join(OUT, f'{p}{i}.sql')) for i in range(n)) // 1024
print(f'variants  : {nv:2} chunks, max {biggest("PV", nv)}KB')
print(f'inputs    : {nip:2} chunks, max {biggest("PI", nip)}KB  ({len(ipdata)} rows)')
print(f'emulation : {nem:2} chunks, max {biggest("PE", nem)}KB  ({len(emdata)} rows)')
print(f'links     : {nl:2} chunks, max {biggest("PL", nl)}KB  ({len(ldata)} rows)')
print('TOTAL CHUNKS:', nv + nip + nem + nl)
