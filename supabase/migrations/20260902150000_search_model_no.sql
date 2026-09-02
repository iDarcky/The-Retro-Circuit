-- Make model numbers searchable.
--
-- `search_consoles_global` matches only `consoles.name`, `manufacturer.name` and the two
-- concatenated. It never looks at `console_variants.model_no`, so the 163 variants that
-- carry one have a model number nobody can find them by.
--
-- That matters for naming: "PSP-1000" is findable today only because the string sits in
-- the console name. Rename it to "PlayStation Portable 1000" and move "PSP-1000" into
-- Model No., and searching "PSP" returns nothing — verified: the term currently returns
-- 1 result, and "PlayStation Portable" returns 0.
--
-- EXISTS rather than a JOIN: a console with four configurations would otherwise appear
-- four times in a twenty-row result.
--
-- Additive only. No column, row or existing match is removed; a query that matched
-- before still matches.

CREATE OR REPLACE FUNCTION public.search_consoles_global(term text)
 RETURNS TABLE(id uuid, name text, slug text, image_url text, manufacturer_name text, manufacturer_slug text)
 LANGUAGE plpgsql
 SET search_path TO 'public', 'pg_temp'
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.image_url,
    m.name as manufacturer_name,
    m.slug as manufacturer_slug
  FROM consoles c
  JOIN manufacturer m ON c.manufacturer_id = m.id
  WHERE
    c.status = 'published' AND (
      c.name ILIKE '%' || term || '%' OR
      m.name ILIKE '%' || term || '%' OR
      (m.name || ' ' || c.name) ILIKE '%' || term || '%' OR
      EXISTS (
        SELECT 1 FROM console_variants v
        WHERE v.console_id = c.id
          AND v.model_no IS NOT NULL
          AND v.model_no ILIKE '%' || term || '%'
      )
    )
  LIMIT 20;
END;
$function$;
