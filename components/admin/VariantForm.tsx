'use client';
import { SwissDropdown } from '../ui/SwissDropdown';

import { useState, type FormEvent, type FC, useEffect, type ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { addConsoleVariant, updateConsoleVariant, getVariantsByConsole } from '../../app/actions';
import { purgeCache } from '../../app/actions/revalidate';
import { ConsoleVariantSchema, VariantInputProfileSchema, VARIANT_FORM_GROUPS, ConsoleVariant } from '../../lib/types';
import Button from '../ui/Button';
import { AdminInput } from './AdminInput';
import ImageUpload from '../ui/ImageUpload';
import { EmulationForm } from './EmulationForm';

interface VariantFormProps {
    consoleList: { name: string, id: string }[];
    preSelectedConsoleId?: string | null;
    initialData?: ConsoleVariant | null; // For Edit Mode
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

// Columns stored in MHz that the form offers GHz/MHz entry for.
// Fields tagged with `subGroup` render as side-by-side columns rather than one long
// stack; a `{ subHeader, column: true }` entry declares the column and its order.
const buildSubColumns = (fields: any[]): { title: string, fields: any[] }[] => {
    const order: string[] = [];
    for (const f of fields) if (f.subHeader && f.column) order.push(f.subHeader);
    return order
        .map(title => ({ title, fields: fields.filter(f => f.subGroup === title) }))
        .filter(col => col.fields.length > 0);
};

const SECOND_SCREEN_KEYS = [
    'second_screen_size', 'second_screen_resolution_x', 'second_screen_resolution_y',
    'second_screen_refresh_rate', 'second_screen_nits', 'second_screen_touch',
] as const;

// Which submitted keys belong to `variant_input_profile` rather than `console_variants`.
// Derived from the schema, never hand-listed: the two tables are merged into one form and
// one Zod object, so a key missing from this set is silently posted to console_variants and
// the save dies with "Could not find the 'x' column of 'console_variants'". That is exactly
// how `system_button_set` broke the editor.
const INPUT_PROFILE_KEYS = Object.keys(VariantInputProfileSchema.shape);

const CLOCK_FIELD_KEYS = ['cpu_clock_min_mhz', 'cpu_clock_max_mhz', 'gpu_clock_min_mhz', 'gpu_clock_mhz'] as const;

const DATE_PATTERNS = {
    year: /^\d{4}$/,
    month: /^\d{4}-(0[1-9]|1[0-2])$/,
    day: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
} as const;

const DATE_HINTS = {
    year: 'Enter a 4-digit year, e.g. 2026.',
    month: 'Pick a year and a month.',
    day: 'Enter a real calendar date (YYYY-MM-DD).',
} as const;

const MONTH_OPTIONS = [
    { value: '', label: '-- Month --' },
    ...['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
        .map((label, i) => ({ value: String(i + 1).padStart(2, '0'), label })),
];

const ChevronDown = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;

export const VariantForm: FC<VariantFormProps> = ({ consoleList, preSelectedConsoleId, initialData, onSuccess, onError }) => {
    const router = useRouter();
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const isEditMode = !!initialData;
    const [showEmulationForm, setShowEmulationForm] = useState(false);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    const [existingVariants, setExistingVariants] = useState<ConsoleVariant[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [pendingEmulationData, setPendingEmulationData] = useState<any>(null);

    const [ramInput, setRamInput] = useState<{ value: string | number, unit: 'GB' | 'MB' }>({ value: '', unit: 'GB' });
    // Storage is stored in MB like RAM, so 512 MB and 2 TB both fit in one column.
    const [storageInput, setStorageInput] = useState<{ value: string | number, unit: 'MB' | 'GB' | 'TB' }>({ value: '', unit: 'GB' });
    // Keyed by column name so any clock field (CPU min/max, GPU) gets the same
    // GHz/MHz entry without another pair of hardcoded state slots.
    type ClockInput = { value: string | number, unit: 'GHz' | 'MHz' };
    const [clockInputs, setClockInputs] = useState<Record<string, ClockInput>>({});

    // Date Logic
    const [datePrecision, setDatePrecision] = useState<'year' | 'month' | 'day' | ''>('');
    const [dateValue, setDateValue] = useState<string>(''); // YYYY, YYYY-MM, or YYYY-MM-DD
    const [dateError, setDateError] = useState<string>('');
    const [showSecondScreen, setShowSecondScreen] = useState(false);

    const handleInputChange = useCallback((key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setFieldErrors(prev => {
            if (!prev[key]) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
        });
    }, []);

    useEffect(() => {
        if (initialData) {
            // Flatten input profile data if present
            const flattenedData = { ...initialData };

            // Normalize: API fixes should handle array unwrapping, but safety check here
            let profile = initialData.variant_input_profile;
            if (Array.isArray(profile)) profile = profile[0];

            if (profile) {
                Object.assign(flattenedData, profile);
            }

            setFormData(flattenedData);
            setShowSecondScreen(SECOND_SCREEN_KEYS.some(k => {
                const v = (flattenedData as any)[k];
                return v !== null && v !== undefined && v !== '';
            }));
            const mb = Number(initialData.ram_mb);
            if (!isNaN(mb) && mb > 0) {
                if (mb >= 1024 && mb % 1024 === 0) {
                    setRamInput({ value: mb / 1024, unit: 'GB' });
                } else {
                    setRamInput({ value: mb, unit: 'MB' });
                }
            }

            const smb = Number((initialData as any).storage_mb);
            if (!isNaN(smb) && smb > 0) {
                if (smb % (1024 * 1024) === 0) setStorageInput({ value: smb / (1024 * 1024), unit: 'TB' });
                else if (smb % 1024 === 0) setStorageInput({ value: smb / 1024, unit: 'GB' });
                else setStorageInput({ value: smb, unit: 'MB' });
            }

            // Clock init — show GHz when the stored MHz divides cleanly, else MHz.
            const nextClocks: Record<string, ClockInput> = {};
            for (const key of CLOCK_FIELD_KEYS) {
                const mhz = Number((initialData as any)[key]);
                if (!isNaN(mhz) && mhz > 0) {
                    nextClocks[key] = mhz >= 1000
                        ? { value: Number((mhz / 1000).toFixed(3)), unit: 'GHz' }
                        : { value: mhz, unit: 'MHz' };
                }
            }
            setClockInputs(nextClocks);

            // Date Init
            if (initialData.release_date_precision) {
                setDatePrecision(initialData.release_date_precision as any);
                if (initialData.release_date) {
                    const [y, m] = initialData.release_date.split('-');
                    if (initialData.release_date_precision === 'year') setDateValue(y);
                    else if (initialData.release_date_precision === 'month') setDateValue(`${y}-${m}`);
                    else setDateValue(initialData.release_date);
                }
            }

        } else if (preSelectedConsoleId) {
            // Force update formData when preSelectedConsoleId changes
            setFormData(prev => ({ ...prev, console_id: preSelectedConsoleId }));
        }
    }, [initialData, preSelectedConsoleId]); // Dependency array handles prop changes

    const handleRamChange = (newVal: string | number, newUnit: 'GB' | 'MB') => {
        setRamInput({ value: newVal, unit: newUnit });
        const val = Number(newVal);
        if (!isNaN(val)) {
            handleInputChange('ram_mb', newUnit === 'GB' ? val * 1024 : val);
        } else {
            handleInputChange('ram_mb', 0);
        }
    };

    // CPU clusters live in formData as a plain array; the repeater edits it in place.
    const clusters: any[] = Array.isArray(formData.cpu_clusters) ? formData.cpu_clusters : [];

    const setClusters = (next: any[]) => {
        handleInputChange('cpu_clusters', next.length > 0 ? next : null);
    };
    const updateCluster = (i: number, key: string, raw: string) => {
        const next = clusters.map((c, idx) => idx !== i ? c : {
            ...c,
            [key]: key === 'core' ? raw : (raw === '' ? null : Number(raw)),
        });
        setClusters(next);
    };
    const addCluster = () => setClusters([...clusters, { count: null, core: '', clock_mhz: null, uarch_year: null }]);
    const removeCluster = (i: number) => setClusters(clusters.filter((_, idx) => idx !== i));

    // Sum of the cluster counts. Displayed in the widget and written on save.
    const derivedCores = clusters.reduce((sum: number, c: any) => sum + (Number(c?.count) || 0), 0);

    const STORAGE_MULT = { MB: 1, GB: 1024, TB: 1024 * 1024 } as const;

    const handleStorageChange = (newVal: string | number, newUnit: 'MB' | 'GB' | 'TB') => {
        setStorageInput({ value: newVal, unit: newUnit });
        const val = Number(String(newVal).replace(',', '.'));
        handleInputChange('storage_mb', !isNaN(val) && val > 0 ? Math.round(val * STORAGE_MULT[newUnit]) : null);
    };

    const handleClockChange = (key: string, newVal: string | number, newUnit: 'GHz' | 'MHz') => {
        setClockInputs(prev => ({ ...prev, [key]: { value: newVal, unit: newUnit } }));

        // "1,05" is what a comma-decimal keyboard produces. Number() reads that as NaN
        // and would silently blank the field, so normalise before parsing.
        const val = Number(String(newVal).replace(',', '.'));
        if (!isNaN(val) && val > 0) {
            handleInputChange(key, newUnit === 'GHz' ? Math.round(val * 1000) : val);
        } else {
            handleInputChange(key, null);
        }
    };

    // Date Handler.
    //
    // Validate the shape rather than the string length. A length check let
    // "09-2026" (a MM-YYYY typed into a browser that has no <input type="month">
    // and falls back to a text box) through as a valid month, and the resulting
    // "09-2026-01" reached Postgres as a date. Future dates are fine — an
    // unreleased device is expected to have one.
    useEffect(() => {
        if (!datePrecision || !dateValue) {
            setDateError('');
            handleInputChange('release_date', null);
            handleInputChange('release_date_precision', null);
            handleInputChange('release_year', null);
            return;
        }

        const match = dateValue.match(DATE_PATTERNS[datePrecision]);
        if (!match) {
            setDateError(DATE_HINTS[datePrecision]);
            handleInputChange('release_date', null);
            handleInputChange('release_date_precision', null);
            handleInputChange('release_year', null);
            return;
        }

        // A real calendar day, so 2026-02-31 is rejected rather than rolled over.
        if (datePrecision === 'day') {
            const [y, m, d] = dateValue.split('-').map(Number);
            const probe = new Date(Date.UTC(y, m - 1, d));
            if (probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) {
                setDateError(DATE_HINTS.day);
                handleInputChange('release_date', null);
                handleInputChange('release_date_precision', null);
                handleInputChange('release_year', null);
                return;
            }
        }

        setDateError('');
        const year = dateValue.slice(0, 4);
        const fullDate =
            datePrecision === 'year' ? `${year}-01-01`
            : datePrecision === 'month' ? `${dateValue}-01`
            : dateValue;

        handleInputChange('release_date', fullDate);
        handleInputChange('release_date_precision', datePrecision);
        handleInputChange('release_year', parseInt(year, 10));
    }, [datePrecision, dateValue, handleInputChange]);


    useEffect(() => {
        const fetchTemplates = async () => {
            const consoleId = formData.console_id;
            if (consoleId) {
                const variants = await getVariantsByConsole(consoleId);
                setExistingVariants(variants);
                setSelectedTemplate('');
            } else {
                setExistingVariants([]);
            }
        };
        fetchTemplates();
    }, [formData.console_id]);

    useEffect(() => {
        const size = parseFloat(formData.screen_size_inch);
        const w = parseFloat(formData.screen_resolution_x);
        const h = parseFloat(formData.screen_resolution_y);
        if (!isNaN(size) && size > 0 && !isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
            const ppi = Math.round(Math.sqrt(w * w + h * h) / size);
            const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
            const divisor = gcd(w, h);
            let ratioX = w / divisor, ratioY = h / divisor;
            if (ratioX === 8 && ratioY === 5) { ratioX = 16; ratioY = 10; }
            const ratio = `${ratioX}:${ratioY}`;
            setFormData(prev => {
                if (prev.ppi === ppi && prev.aspect_ratio === ratio) return prev;
                return { ...prev, ppi, aspect_ratio: ratio };
            });
        }
    }, [formData.screen_size_inch, formData.screen_resolution_x, formData.screen_resolution_y]);

    useEffect(() => {
        const size = parseFloat(formData.second_screen_size);
        const w = parseFloat(formData.second_screen_resolution_x);
        const h = parseFloat(formData.second_screen_resolution_y);
        if (!isNaN(size) && size > 0 && !isNaN(w) && w > 0 && !isNaN(h) && h > 0) {
            const ppi = Math.round(Math.sqrt(w * w + h * h) / size);
            const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
            const divisor = gcd(w, h);
            const ratio = `${w / divisor}:${h / divisor}`;
            setFormData(prev => {
                if (prev.second_screen_ppi === ppi && prev.second_screen_aspect_ratio === ratio) return prev;
                return { ...prev, second_screen_ppi: ppi, second_screen_aspect_ratio: ratio };
            });
        }
    }, [formData.second_screen_size, formData.second_screen_resolution_x, formData.second_screen_resolution_y]);

    const toggleSection = (title: string) => {
        setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
    };

    const handleTemplateSelect = (variantId: string) => {
        if (isEditMode) return;
        setSelectedTemplate(variantId);
        setFieldErrors({});
        setPendingEmulationData(null);

        if (!variantId) return;
        const template = existingVariants.find(v => v.id === variantId);
        if (template) {
            // Identity is per-variant and must not be copied. Everything else, release
            // date and price included, describes the same hardware family and should
            // carry over — retyping the release date on every configuration was the
            // single most repetitive thing about adding a variant.
            const { id, variant_name, slug, is_default, ...specs } = template;

            // Flatten specs (including Input Profile)
            const flattenedSpecs = { ...specs };

            // Explicitly handle variant_input_profile if it exists
            if (template.variant_input_profile) {
                // We must unwrap it or just spread it if it's already an object
                const profile = Array.isArray(template.variant_input_profile)
                    ? template.variant_input_profile[0]
                    : template.variant_input_profile;

                if (profile) {
                    Object.assign(flattenedSpecs, profile);
                }
            }

            // Handle Emulation Profile Staging
            if (template.emulation_profile) {
                setPendingEmulationData(template.emulation_profile);
            }

            setFormData(prev => ({
                ...flattenedSpecs, console_id: prev.console_id, variant_name: '', slug: '',
                is_default: false, image_url: template.image_url
            }));

            // The date and storage widgets hold their own state, so copying formData
            // alone left them blank while the record underneath was populated.
            if (template.release_date) {
                const prec = (template.release_date_precision as any) || 'day';
                setDatePrecision(prec);
                setDateValue(String(template.release_date).slice(0, prec === 'year' ? 4 : prec === 'month' ? 7 : 10));
                setDateError('');
            }
            const tsmb = Number((template as any).storage_mb);
            if (!isNaN(tsmb) && tsmb > 0) {
                if (tsmb % (1024 * 1024) === 0) setStorageInput({ value: tsmb / (1024 * 1024), unit: 'TB' });
                else if (tsmb % 1024 === 0) setStorageInput({ value: tsmb / 1024, unit: 'GB' });
                else setStorageInput({ value: tsmb, unit: 'MB' });
            } else {
                setStorageInput({ value: '', unit: 'GB' });
            }

            const mb = Number(template.ram_mb);
            if (!isNaN(mb) && mb > 0) {
                if (mb >= 1024 && mb % 1024 === 0) setRamInput({ value: mb / 1024, unit: 'GB' });
                else setRamInput({ value: mb, unit: 'MB' });
            } else {
                setRamInput({ value: '', unit: 'GB' });
            }

            const nextClocks: Record<string, ClockInput> = {};
            for (const key of CLOCK_FIELD_KEYS) {
                const mhz = Number((template as any)[key]);
                if (!isNaN(mhz) && mhz > 0) {
                    nextClocks[key] = mhz >= 1000
                        ? { value: Number((mhz / 1000).toFixed(3)), unit: 'GHz' }
                        : { value: mhz, unit: 'MHz' };
                }
            }
            setClockInputs(nextClocks);
            setShowSecondScreen(SECOND_SCREEN_KEYS.some(k => {
                const v = (template as any)[k];
                return v !== null && v !== undefined && v !== '';
            }));
        }
    };

    const handleSubmit = async (e: FormEvent, mode: 'SAVE' | 'CLONE' = 'SAVE') => {
        e.preventDefault();
        const rawVariant = { ...formData };
        if (rawVariant.variant_name && !rawVariant.slug) {
            rawVariant.slug = rawVariant.variant_name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        const result = ConsoleVariantSchema.safeParse(rawVariant);
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            let errorGroup = "";
            result.error.issues.forEach(issue => {
                if (issue.path.length > 0) {
                    const fieldKey = issue.path[0].toString();
                    newErrors[fieldKey] = issue.message;
                    if (!errorGroup) {
                        const group = VARIANT_FORM_GROUPS.find(g => g.fields.some(f => f.key && f.key === fieldKey));
                        if (group) errorGroup = group.title;
                    }
                }
            });
            setFieldErrors(newErrors);
            if (errorGroup) setOpenSections(prev => ({ ...prev, [errorGroup]: true }));
            onError("VALIDATION FAILED. PLEASE CHECK HIGHLIGHTED FIELDS.");
            return;
        }

        // Structure data for API: Separate Variant vs Input Profile
        const validData = result.data as any;

        /* cpu_cores is the sum of the cluster counts, so it is derived rather than typed.
         * Having both on the form meant three overlapping CPU fields and no rule about
         * which one won. The clusters are the source of truth; this keeps the plain
         * total available for sorting and for the comparison table. */
        if (Array.isArray(validData.cpu_clusters) && validData.cpu_clusters.length > 0) {
            const total = validData.cpu_clusters.reduce(
                (sum: number, c: any) => sum + (Number(c?.count) || 0), 0);
            if (total > 0) validData.cpu_cores = total;
        }

        const variantPayload: any = {};
        const inputProfilePayload: any = {};

        // 1. Process Input Profile Fields (Strict Iteration)
        // We iterate over the whitelist to ensure EVERY field is sent, even if undefined in validData
        INPUT_PROFILE_KEYS.forEach(key => {
            let val = validData[key];

            // Convert undefined, null, or empty string to explicit NULL
            if (val === undefined || val === null || val === '') {
                val = null;
            }

            // Explicitly default 'unknown' for input_confidence if missing (NOT NULL constraint)
            if (key === 'input_confidence' && !val) {
                val = 'unknown';
            }

            inputProfilePayload[key] = val;
        });

        // 2. Process Remaining Variant Fields
        // Iterate over validData keys that are NOT in the input profile list
        Object.keys(validData).forEach(key => {
            if (!INPUT_PROFILE_KEYS.includes(key)) {
                variantPayload[key] = validData[key];
            }
        });

        // Attach input profile as nested object for the API to handle
        if (Object.keys(inputProfilePayload).length > 0) {
            variantPayload.variant_input_profile = inputProfilePayload;
        }

        // Attach Pending Emulation Data if creating a new variant from a template
        if (!isEditMode && pendingEmulationData) {
            variantPayload.emulation_profile = pendingEmulationData;
        }

        setLoading(true);
        try {
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("Database timeout")), 10000));
            let promise;
            if (isEditMode && initialData?.id) {
                promise = updateConsoleVariant(initialData.id, variantPayload);
            } else {
                promise = addConsoleVariant(variantPayload);
            }
            const response: any = await Promise.race([promise, timeout]);
            if (response.success) {
                await purgeCache();
                // Append optional warning message if available (e.g., input profile failure)
                const successMsg = isEditMode ? "VARIANT UPDATED." : "VARIANT SAVED.";
                onSuccess(response.message ? `${successMsg} (${response.message})` : successMsg);

                setFieldErrors({});
                router.refresh();
                if (rawVariant.console_id) {
                    const updated = await getVariantsByConsole(rawVariant.console_id);
                    setExistingVariants(updated);
                }
                if (!isEditMode) {
                    if (mode === 'SAVE') {
                        setFormData({ console_id: rawVariant.console_id });
                        setRamInput({ value: '', unit: 'GB' });
                        setDatePrecision('');
                        setDateValue('');
                        setSelectedTemplate('');
                        setPendingEmulationData(null);
                        setOpenSections({ "IDENTITY & ORIGIN": true });
                    } else {
                        setFormData(prev => ({ ...prev, variant_name: '', slug: '', is_default: false, model_no: '' }));
                        // If cloning, we likely want to keep the pending emulation data?
                        // Actually 'CLONE' here means "Save and add another similar one", not "Clone Database Row".
                        // So we might want to keep the emulation data if the user intends to create another variant based on the same specs.
                        // But typically we clear form. Let's strictly follow the 'SAVE' reset logic for simplicity unless user requested otherwise.
                        // Actually CLONE usually just clears ID-related fields but keeps specs.
                        // So we should NOT clear pendingEmulationData here.
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else {
                onError(`OPERATION FAILED: ${response.message}`);
            }
        } catch (error: any) {
            onError(`SYSTEM ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // One field. `inColumn` fields are stacked inside a sub-column and take no grid span.
    const renderField = (field: any, fieldIdx: number, inColumn: boolean) => {
        let colSpan = 'md:col-span-6';
        if (field.width === 'full') colSpan = 'md:col-span-12';
        if (field.width === 'third') colSpan = 'md:col-span-4';
        if (field.width === 'quarter') colSpan = 'md:col-span-3';
        if (field.width === 'half') colSpan = 'md:col-span-6';
        if (field.width === 'two-thirds') colSpan = 'md:col-span-8';
        if (field.width === 'sixth') colSpan = 'md:col-span-2';
        if (inColumn) colSpan = '';

        const key = field.key || `field-${fieldIdx}`;
        const error = field.key ? fieldErrors[field.key as keyof typeof fieldErrors] : undefined;

        if (field.optionalGroup === 'second_screen' && !showSecondScreen) return null;

        if (field.type === 'custom_second_screen_toggle') {
            return (
                <div key="second-screen-toggle" className="md:col-span-12 mt-2 pt-4 border-t border-white/10">
                    <button
                        type="button"
                        onClick={() => setShowSecondScreen(v => !v)}
                        className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
                    >
                        <span className={`w-4 h-4 border flex items-center justify-center ${showSecondScreen ? 'bg-secondary border-secondary' : 'border-gray-600'}`}>
                            {showSecondScreen && <span className="w-2 h-2 bg-black" />}
                        </span>
                        Has a second screen
                    </button>
                    {!showSecondScreen && (
                        <div className="text-[9px] text-gray-600 mt-1 font-mono">// 9 of 514 devices do — leave this off for the rest</div>
                    )}
                </div>
            );
        }

        if (field.type === 'custom_cpu_clusters') {
            // One row per big/little cluster. Rendered one line each on the console page,
            // instead of the old "Cortex-A76 / Cortex-A55  2x / 6x" interleaving.
            const cellClass = 'border border-gray-700 bg-black text-white font-mono text-xs p-2 outline-none focus:border-secondary w-full';
            return (
                <div key={key} className={colSpan}>
                    <label className="text-[10px] mb-2 block uppercase tracking-wider text-gray-500">{field.label}</label>
                    {clusters.length === 0 && (
                        <div className="text-[9px] text-gray-600 font-mono mb-2">// no clusters yet</div>
                    )}
                    <div className="space-y-1.5">
                        {clusters.map((c: any, i: number) => (
                            <div key={i} className="grid grid-cols-[52px_1fr_84px_70px_30px] gap-1.5 items-center">
                                <input type="number" min="1" className={cellClass} placeholder="2" aria-label={`Cluster ${i + 1} core count`}
                                    value={c.count ?? ''} onChange={(e) => updateCluster(i, 'count', e.target.value)} />
                                <input type="text" className={cellClass} placeholder="Cortex-A78" aria-label={`Cluster ${i + 1} core name`}
                                    value={c.core ?? ''} onChange={(e) => updateCluster(i, 'core', e.target.value)} />
                                <input type="number" className={cellClass} placeholder="MHz" aria-label={`Cluster ${i + 1} clock in MHz`}
                                    value={c.clock_mhz ?? ''} onChange={(e) => updateCluster(i, 'clock_mhz', e.target.value)} />
                                <input type="number" className={cellClass} placeholder="Year" aria-label={`Cluster ${i + 1} architecture year`}
                                    value={c.uarch_year ?? ''} onChange={(e) => updateCluster(i, 'uarch_year', e.target.value)} />
                                <button type="button" onClick={() => removeCluster(i)} aria-label={`Remove cluster ${i + 1}`}
                                    className="border border-gray-700 text-gray-500 hover:border-accent hover:text-accent font-mono text-xs h-[34px]">×</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addCluster}
                        className="mt-2 font-mono text-[9px] uppercase tracking-widest text-secondary hover:text-white transition-colors">
                        + Add cluster
                    </button>
                    <div className="text-[9px] text-gray-500 mt-2 font-mono tracking-tight leading-relaxed">
                        // count · core · MHz · architecture year. Fastest cluster first.<br />
                        // One row per cluster because &quot;8 cores&quot; hides the difference between
                        1&times;X4 + 4&times;A720 + 3&times;A520 and eight A55s.<br />
                        // Architecture year ranks above clock: 2 GHz on a 2023 core beats 3 GHz on a 2016 one.
                        {derivedCores > 0 && (
                            <><br />// Total cores: <span className="text-gray-300">{derivedCores}</span> (saved automatically)</>
                        )}
                    </div>
                </div>
            );
        }

        if (field.type === 'custom_date') {
            // Year and month are explicit controls rather than <input type="month">,
            // which Safari does not implement and silently renders as a text box.
            const dateInputClass = `w-full bg-black border p-3 outline-none text-white font-mono text-sm h-[46px] ${dateError ? 'border-accent' : 'border-gray-700 focus:border-secondary'}`;
            const yearPart = dateValue.slice(0, 4);
            const monthPart = dateValue.slice(5, 7);

            const setYear = (y: string) => {
                const clean = y.replace(/\D/g, '').slice(0, 4);
                setDateValue(datePrecision === 'month' ? (monthPart ? `${clean}-${monthPart}` : clean) : clean);
            };
            const setMonth = (m: string) => setDateValue(m ? `${yearPart}-${m}` : yearPart);

            return (
                <div key="date-input" className={colSpan}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] mb-1 block uppercase text-gray-500">Date Precision</label>
                            <SwissDropdown
                                className="w-full"
                                buttonClassName="bg-black border border-gray-700 p-3 outline-none text-white font-mono text-sm h-[46px] flex justify-between items-center"
                                value={datePrecision}
                                onChange={(val) => { setDatePrecision(val as any); setDateValue(""); }}
                                options={[
                                    { value: "", label: "-- None --" },
                                    { value: "year", label: "Year Only" },
                                    { value: "month", label: "Month + Year" },
                                    { value: "day", label: "Exact Day" }
                                ]}
                                labelPrefix="" inverted={false}
                            />
                        </div>

                        {(datePrecision === 'year' || datePrecision === 'month') && (
                            <div>
                                <label className="text-[10px] mb-1 block uppercase text-gray-500">Year</label>
                                <input type="text" inputMode="numeric" maxLength={4} className={dateInputClass}
                                    value={yearPart} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" />
                            </div>
                        )}

                        {datePrecision === 'month' && (
                            <div>
                                <label className="text-[10px] mb-1 block uppercase text-gray-500">Month</label>
                                <SwissDropdown
                                    className="w-full"
                                    buttonClassName={`bg-black border p-3 outline-none text-white font-mono text-sm h-[46px] flex justify-between items-center ${dateError ? 'border-accent' : 'border-gray-700'}`}
                                    value={monthPart}
                                    onChange={(val) => setMonth(val as string)}
                                    options={MONTH_OPTIONS}
                                    labelPrefix="" inverted={false}
                                />
                            </div>
                        )}

                        {datePrecision === 'day' && (
                            <div className="md:col-span-2">
                                <label className="text-[10px] mb-1 block uppercase text-gray-500">Date</label>
                                <input type="date" className={dateInputClass} value={dateValue}
                                    onChange={(e) => setDateValue(e.target.value)} />
                            </div>
                        )}
                    </div>
                    {dateError && <div className="text-[10px] text-accent mt-1 font-mono uppercase font-bold">! {dateError}</div>}
                </div>
            );
        }

        if (field.type === 'custom_ram') {
            return (
                <div key={key} className={colSpan}>
                    <label className={`text-[10px] mb-1 block uppercase ${error ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                    <div className="flex gap-2">
                        <input type="number" className={`flex-1 border p-3 outline-none font-mono text-sm bg-black text-white ${error ? 'border-accent' : 'border-gray-700 focus:border-secondary'}`}
                            value={ramInput.value} onChange={(e) => handleRamChange(e.target.value, ramInput.unit)} />
                        <SwissDropdown value={ramInput.unit} onChange={(val) => handleRamChange(ramInput.value, val as 'GB' | 'MB')}
                            options={[{ label: 'GB', value: 'GB' }, { label: 'MB', value: 'MB' }]} className="w-24"
                            buttonClassName="bg-black border border-gray-700 p-3 outline-none text-white font-mono text-sm h-[46px] flex justify-between items-center"
                            labelPrefix="" inverted={false} />
                    </div>
                    {error && <div className="text-[10px] text-accent mt-1 font-mono uppercase">! {error}</div>}
                </div>
            );
        }

        if (field.hidden) return null;

        if (field.type === 'tribool') {
            // Three states, because "nobody has checked" is not "no". A checkbox here
            // wrote false onto 288 unknown rumble rows the first time anyone saved.
            const raw = formData[field.key];
            const val = raw === true ? 'true' : raw === false ? 'false' : '';
            return (
                <div key={key} className={colSpan}>
                    <label className={`text-[10px] mb-1 block uppercase ${error ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                    <SwissDropdown
                        value={val}
                        onChange={(v) => handleInputChange(field.key, v === '' ? null : v === 'true')}
                        options={[{ label: 'Unknown', value: '' }, { label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]}
                        buttonClassName="w-full bg-black border border-gray-700 p-3 outline-none text-white font-mono text-sm h-[46px] flex justify-between items-center"
                        labelPrefix="" inverted={false} />
                    {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
                </div>
            );
        }

        if (field.type === 'multiselect') {
            const current: string[] = Array.isArray(formData[field.key]) ? formData[field.key] : [];
            const toggle = (opt: string) => {
                const next = current.includes(opt) ? current.filter(o => o !== opt) : [...current, opt];
                handleInputChange(field.key, next.length ? next : null);
            };
            return (
                <div key={key} className={colSpan}>
                    <label className={`text-[10px] mb-1 block uppercase ${error ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                    <div className="flex flex-wrap gap-px border border-gray-700 bg-black p-px">
                        {(field.options || []).map((opt: string) => {
                            const on = current.includes(opt);
                            return (
                                <button key={opt} type="button" onClick={() => toggle(opt)} aria-pressed={on}
                                    className={`px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${on ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                    {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
                </div>
            );
        }

        if (field.type === 'custom_storage') {
            return (
                <div key={key} className={colSpan}>
                    <label className={`text-[10px] mb-1 block uppercase ${error ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                    <div className="flex gap-2">
                        <input type="number" step="any" className={`flex-1 border p-3 outline-none font-mono text-sm bg-black text-white ${error ? 'border-accent' : 'border-gray-700 focus:border-secondary'}`}
                            value={storageInput.value} onChange={(e) => handleStorageChange(e.target.value, storageInput.unit)} />
                        <SwissDropdown value={storageInput.unit}
                            onChange={(v) => handleStorageChange(storageInput.value, v as 'MB' | 'GB' | 'TB')}
                            options={[{ label: 'MB', value: 'MB' }, { label: 'GB', value: 'GB' }, { label: 'TB', value: 'TB' }]} className="w-24"
                            buttonClassName="bg-black border border-gray-700 p-3 outline-none text-white font-mono text-sm h-[46px] flex justify-between items-center"
                            labelPrefix="" inverted={false} />
                    </div>
                    {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
                </div>
            );
        }

        if (field.type === 'custom_clock') {
            const inputState = clockInputs[field.key] || { value: '', unit: 'GHz' as const };
            return (
                <div key={key} className={colSpan}>
                    <label className={`text-[10px] mb-1 block uppercase ${error ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                    <div className="flex gap-2">
                        <input type="number" step="any" className={`flex-1 border p-3 outline-none font-mono text-sm bg-black text-white ${error ? 'border-accent' : 'border-gray-700 focus:border-secondary'}`}
                            value={inputState.value} onChange={(e) => handleClockChange(field.key, e.target.value, inputState.unit)} />
                        <SwissDropdown value={inputState.unit} onChange={(val) => handleClockChange(field.key, inputState.value, val as 'GHz' | 'MHz')}
                            options={[{ label: 'GHz', value: 'GHz' }, { label: 'MHz', value: 'MHz' }]} className="w-24"
                            buttonClassName="bg-black border border-gray-700 p-3 outline-none text-white font-mono text-sm h-[46px] flex justify-between items-center"
                            labelPrefix="" inverted={false} />
                    </div>
                    {field.note && <div className="text-[9px] text-gray-500 mt-1 font-mono tracking-tight">// {field.note}</div>}
                    {error && <div className="text-[10px] text-accent mt-1 font-mono uppercase">! {error}</div>}
                </div>
            );
        }

        // A subHeader without `column` is a plain full-width divider in the flat layout.
        if (!field.key && field.subHeader) {
            return (
                <div key={`sub-${fieldIdx}`} className="md:col-span-12 mt-2 mb-1 border-b border-gray-800 pb-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{field.subHeader}</span>
                </div>
            );
        }
        if (!field.key) return null;

        if (field.type === 'url' || field.key.includes('image_url')) {
            return (
                <div key={key} className={colSpan}>
                    <label className={`text-[10px] mb-2 block uppercase ${error ? 'text-accent' : 'text-gray-500'}`}>{field.label}</label>
                    <ImageUpload value={formData[field.key]} onChange={(url) => handleInputChange(field.key, url)} />
                </div>
            );
        }

        return (
            <div key={key} className={colSpan}>
                <AdminInput field={field} value={formData[field.key]} onChange={handleInputChange} error={error} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className={`border-l-4 p-5 mb-6 bg-black/40 shadow-md ${isEditMode ? 'border-secondary' : 'border-accent'}`}>
                <h3 className={`font-bold text-sm uppercase font-mono tracking-widest ${isEditMode ? 'text-secondary' : 'border-accent'}`}>{isEditMode ? 'Edit Mode: Variant Specs' : 'Step 2: Technical Specs'}</h3>
                <p className="text-xs text-gray-400 mt-2 font-mono">{isEditMode ? `Modifying Variant ID: ${initialData?.id}` : 'Define hardware capabilities. Create multiple variants (Pro, Slim, etc.) for a console.'}</p>
            </div>

            <form autoComplete="off" data-form-type="other" className="space-y-6">
                <div className="mb-8 space-y-6 bg-black/20 p-6 border border-border-normal">
                    <div>
                        <label className={`text-[10px] mb-2 block uppercase font-bold ${fieldErrors.console_id ? 'text-accent' : 'text-gray-500'}`}>Target Console Folder</label>
                        <select className={`w-full bg-black border p-3 outline-none text-white font-mono text-sm ${fieldErrors.console_id ? 'border-accent' : 'border-gray-700 focus:border-secondary'} ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`} value={formData.console_id || ''} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleInputChange('console_id', e.target.value)} required disabled={isEditMode}>
                            <option value="">-- Select Console Folder --</option>
                            {consoleList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    {!isEditMode && existingVariants.length > 0 && (
                        <div className="p-4 border border-dashed border-primary bg-primary/5">
                            <label className="text-[10px] text-primary mb-2 block uppercase font-bold">Quick Fill: Copy Specs</label>
                            <select className="w-full bg-black border border-primary text-primary p-2 font-mono text-xs" value={selectedTemplate} onChange={(e: ChangeEvent<HTMLSelectElement>) => handleTemplateSelect(e.target.value)}>
                                <option value="">-- Select a Base Model Template --</option>
                                {existingVariants.map(v => <option key={v.id} value={v.id}>{v.variant_name} {v.is_default ? '(Default)' : ''}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    {VARIANT_FORM_GROUPS.map((group, idx) => {
                        const isOpen = openSections[group.title];
                        const hasError = group.fields.some((f: any) => f.key && fieldErrors[f.key as keyof typeof fieldErrors]);
                        const columns = buildSubColumns(group.fields);
                        const flat = (group.fields as any[]).filter(f => !f.subGroup && !(f.subHeader && f.column));

                        return (
                            <div key={idx} className={`bg-black/40 border-l-4 ${hasError ? 'border-accent' : 'border-secondary'} shadow-lg`}>
                                <button type="button" onClick={() => toggleSection(group.title)} className={`w-full flex justify-between items-center p-4 text-left font-mono uppercase tracking-widest text-sm ${isOpen ? 'text-white bg-white/5 font-bold' : 'text-gray-400 hover:text-white'}`}>
                                    <span>{group.title}</span><div className={`${isOpen ? 'rotate-180 text-secondary' : 'text-gray-600'}`}><ChevronDown /></div>
                                </button>
                                {isOpen && (
                                    <div className="border-t border-white/5">
                                        {columns.length > 0 && (
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-8">
                                                {columns.map(col => (
                                                    <div key={col.title}>
                                                        <div className="font-mono text-[9.5px] tracking-[0.18em] uppercase text-secondary pb-2 mb-4 border-b border-white/10">
                                                            {col.title}
                                                        </div>
                                                        <div className="space-y-4">
                                                            {col.fields.map((f, i) => renderField(f, i, true))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {flat.length > 0 && (
                                            <div className={`px-6 pb-6 grid grid-cols-1 md:grid-cols-12 gap-6 ${columns.length > 0 ? 'pt-6 border-t border-white/5' : 'pt-6'}`}>
                                                {flat.map((f, i) => renderField(f, i, false))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isEditMode && initialData?.id && (
                    <div className="mt-8 border-t-2 border-dashed border-border-normal pt-8">
                        {!showEmulationForm ? (
                            <button type="button" onClick={() => setShowEmulationForm(true)} className="w-full py-4 border-2 border-primary bg-primary/10 text-primary font-pixel text-sm hover:bg-primary hover:text-black">
                                [ EDIT EMULATION PERFORMANCE ]
                            </button>
                        ) : (
                            <div className="border-2 border-primary">
                                <div className="bg-primary/20 p-2 flex justify-between items-center border-b border-primary/50">
                                    <span className="text-[10px] font-mono text-primary px-2">PERFORMANCE MATRIX</span>
                                    <button type="button" onClick={() => setShowEmulationForm(false)} className="text-[10px] font-mono text-primary hover:text-white px-2 py-1">[ CLOSE ]</button>
                                </div>
                                <EmulationForm variantId={initialData.id} onSave={() => onSuccess("EMULATION DATA SYNCED.")} />
                            </div>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-4 pt-6 border-t border-border-normal">
                    {!isEditMode && <Button type="button" variant="secondary" onClick={(e) => handleSubmit(e, 'CLONE')} isLoading={loading}>[ SAVE & CLONE ]</Button>}
                    <Button type="submit" onClick={(e) => handleSubmit(e, 'SAVE')} isLoading={loading}>{isEditMode ? 'UPDATE UNIT' : 'REGISTER UNIT'}</Button>
                </div>
            </form>
        </div>
    );
}
