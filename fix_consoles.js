const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'app/actions/consoles.ts');
let code = fs.readFileSync(filepath, 'utf8');

// We need to replace references to mSlug/mfgSlug where they are dynamically concatenating for URLs.

code = code.replace(
  /const mSlug = \(newConsole\.manufacturer as any\)\?\.slug;\s*if\s*\(mSlug\)\s*\{\s*const url = `https:\/\/theretrocircuit\.com\/consoles\/\$\{mSlug\}-\$\{newConsole\.slug\}`;\s*submitToIndexNow\(\[url\]\);\s*\}/g,
  "if (newConsole.slug) {\n                 const url = `https://theretrocircuit.com/consoles/${newConsole.slug}`;\n                 submitToIndexNow([url]);\n            }"
);

code = code.replace(
  /const mfg = \(updatedVariant\?\.consoles as any\)\?\.manufacturer;\s*const mfgSlug = mfg\?\.slug \|\| \(mfg\?\.name \? mfg\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\s*revalidatePath\(`\/consoles\/\$\{mfgSlug\}-\$\{\(updatedVariant\?\.consoles as any\)\.slug\}`\);/g,
  "revalidatePath(`/consoles/${(updatedVariant?.consoles as any).slug}`);"
);

code = code.replace(
  /const mSlug = \(consoleSlugInfo\.manufacturer as any\)\?\.slug;\s*const cSlug = consoleSlugInfo\.slug \|\| cleanData\.slug;\s*if\s*\(mSlug && cSlug\)\s*\{\s*const url = `https:\/\/theretrocircuit\.com\/consoles\/\$\{mSlug\}-\$\{cSlug\}`;\s*submitToIndexNow\(\[url\]\);\s*\}/g,
  "const cSlug = consoleSlugInfo.slug || cleanData.slug;\n            if (cSlug) {\n                const url = `https://theretrocircuit.com/consoles/${cSlug}`;\n                submitToIndexNow([url]);\n            }"
);

code = code.replace(
  /const mfg = \(parentConsole as any\)\.manufacturer;\s*const mfgSlug = mfg\?\.slug \|\| \(mfg\?\.name \? mfg\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\s*revalidatePath\(`\/consoles\/\$\{mfgSlug\}-\$\{parentConsole\.slug\}`\);/g,
  "revalidatePath(`/consoles/${parentConsole.slug}`);"
);

fs.writeFileSync(filepath, code);
