"use server";

/**
 * Variant CRUD.
 *
 * Specs live on the variant rather than the console, so this is where most catalogue
 * edits actually land — and why these writes refresh the parent's listing card and the
 * ranked collections, not just its detail page.
 */

import { createClient } from "../../lib/supabase/server";
import { ConsoleVariant, VariantInputProfile } from "../../lib/types";
import { normalizeVariant } from "../../lib/normalize";
import {
    revalidateConsoleContent,
    revalidateCatalogueCollections,
} from "../../lib/revalidate-console";

/**
 * Admin-only: every variant of a console, used to offer an existing variant as the starting
 * template for a new one.
 *
 * Must use the cookie-aware client. RLS only lets `anon` see variants whose console is
 * PUBLISHED, so on a draft console the anon client returns an empty list — which looked
 * exactly like "this console has no variants" and silently removed the template picker.
 */
export const getVariantsByConsole = async (consoleId: string): Promise<ConsoleVariant[]> => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('console_variants')
            .select('*, variant_input_profile(*), emulation_profiles(*)')
            .eq('console_id', consoleId)
            .order('is_default', { ascending: false });
        if (error) throw error;
        return (data || []).map(normalizeVariant) as ConsoleVariant[];
    } catch (err) {
        // Swallowing this is what hid the RLS denial in the first place.
        console.error(`getVariantsByConsole(${consoleId}) failed:`, err);
        return [];
    }
};

export const addConsoleVariant = async (variantData: Omit<ConsoleVariant, 'id'>): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();
        const { variant_input_profile, emulation_profile, ...mainVariantData } = variantData;

        const { data: newVariant, error: variantError } = await supabase
            .from('console_variants')
            .insert([mainVariantData])
            .select('id')
            .single();

        if (variantError) return { success: false, message: "Variant Insert Failed: " + variantError.message };
        if (!newVariant) return { success: false, message: "Variant Insert Failed: No Data" };

        if (variant_input_profile) {
            const profileData: VariantInputProfile = {
                ...variant_input_profile,
                variant_id: newVariant.id
            };
            // Use UPSERT because the trigger automatically creates a row on insert
            const { error: profileError } = await supabase.from('variant_input_profile').upsert([profileData], { onConflict: 'variant_id' });

            if (profileError) {
                console.error("Input Profile Update Failed:", profileError);
                return { success: true, message: "Variant saved, but Input Profile update failed: " + profileError.message };
            }
        }

        if (emulation_profile) {
            // Emulation profiles might be auto-created by DB triggers, so we use upsert
            const { id, ...emuDataWithoutId } = emulation_profile as any;
            const emuPayload = {
                ...emuDataWithoutId,
                variant_id: newVariant.id
            };

            const { error: emuError } = await supabase
                .from('emulation_profiles')
                .upsert(emuPayload, { onConflict: 'variant_id' });

            if (emuError) {
                console.error("Emulation Profile Copy Failed:", emuError);
                // Non-fatal error, we still return success for the variant
            }
        }

        if (mainVariantData.console_id) {
            const { data: parentConsole } = await supabase.from('consoles').select('slug, manufacturer:manufacturer(slug, name)').eq('id', mainVariantData.console_id).single();
            if (parentConsole?.slug) {
                // Specs live on the variant, so a new configuration changes the console's
                // listing card and its ranking in every derived collection, not just its
                // detail page.
                revalidateConsoleContent(parentConsole.slug, (parentConsole.manufacturer as any)?.slug);
                revalidateCatalogueCollections();
            }
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

export const updateConsoleVariant = async (id: string, variantData: Partial<ConsoleVariant>): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();
        const { variant_input_profile, ...mainVariantData } = variantData;

        const { error: variantError } = await supabase.from('console_variants').update(mainVariantData).eq('id', id);
        if (variantError) return { success: false, message: variantError.message };

        if (variant_input_profile) {
            const profileData = {
                ...variant_input_profile,
                variant_id: id
            };
            const { error: profileError } = await supabase.from('variant_input_profile').upsert([profileData]);

            if (profileError) {
                console.error("Input Profile Update Failed:", profileError);
                return { success: true, message: "Variant updated, but Input Profile failed: " + profileError.message };
            }
        }

        const { data: updatedVariant } = await supabase.from('console_variants').select('console_id, consoles(slug, manufacturer:manufacturer(slug, name))').eq('id', id).single();
        const parentConsole = updatedVariant?.consoles as any;
        if (parentConsole?.slug) {
            // This is the path most edits take — screen, chip, price and emulation grades
            // are all variant columns, and they feed the listing card, the OG image and
            // the ranked collections as well as the detail page.
            revalidateConsoleContent(parentConsole.slug, parentConsole.manufacturer?.slug);
            revalidateCatalogueCollections();
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};

/**
 * Delete one variant.
 *
 * Refuses to remove the last variant of a console: a console with no variant has no
 * specs at all and renders as an empty page, which is worse than a stale one. Delete
 * the console instead. `variant_input_profile` and `emulation_profiles` both cascade
 * on the foreign key, so there is nothing else to clean up.
 */
export const deleteConsoleVariant = async (id: string): Promise<{ success: boolean, message?: string }> => {
    try {
        const supabase = await createClient();

        const { data: variant, error: fetchError } = await supabase
            .from('console_variants')
            .select('console_id, variant_name, is_default')
            .eq('id', id)
            .single();
        if (fetchError) return { success: false, message: fetchError.message };

        const { count, error: countError } = await supabase
            .from('console_variants')
            .select('id', { count: 'exact', head: true })
            .eq('console_id', variant.console_id);
        if (countError) return { success: false, message: countError.message };
        if ((count ?? 0) <= 1) {
            return { success: false, message: 'This is the only variant. Delete the console instead.' };
        }

        const { error } = await supabase.from('console_variants').delete().eq('id', id);
        if (error) return { success: false, message: error.message };

        // Promote another variant so the console still has a default to render.
        if (variant.is_default) {
            const { data: next } = await supabase
                .from('console_variants')
                .select('id')
                .eq('console_id', variant.console_id)
                .order('created_at', { ascending: true })
                .limit(1)
                .maybeSingle();
            if (next?.id) {
                await supabase.from('console_variants').update({ is_default: true }).eq('id', next.id);
            }
        }

        const { data: parent } = await supabase
            .from('consoles').select('slug, manufacturer:manufacturer(slug)').eq('id', variant.console_id).maybeSingle();
        if (parent?.slug) {
            revalidateConsoleContent(parent.slug, (parent.manufacturer as any)?.slug);
            revalidateCatalogueCollections();
        }

        return { success: true, message: `Deleted "${variant.variant_name}".` };
    } catch (e: any) {
        return { success: false, message: e.message };
    }
};
