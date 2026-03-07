const fs = require('fs');

const sitemapPath = 'app/sitemap.ts';
let codeSitemap = fs.readFileSync(sitemapPath, 'utf8');

codeSitemap = codeSitemap.replace(
  /const mfg = item\.manufacturer;\s*const mfgSlug = mfg\?\.slug \|\| \(mfg\?\.name \? mfg\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\s*routes\.push\(\{\s*url: `\$\{baseUrl\}\/consoles\/\$\{mfgSlug\}-\$\{item\.slug\}`,\s*lastModified: new Date\(item\.updated_at \|\| new Date\(\)\),\s*changeFrequency: 'weekly',\s*priority: 0\.8,\s*\}\);/g,
  "routes.push({\n          url: `${baseUrl}/consoles/${item.slug}`,\n          lastModified: new Date(item.updated_at || new Date()),\n          changeFrequency: 'weekly',\n          priority: 0.8,\n        });"
);
fs.writeFileSync(sitemapPath, codeSitemap);

const arenaPath = 'app/arena/[[...versus]]/page.tsx';
let codeArena = fs.readFileSync(arenaPath, 'utf8');

codeArena = codeArena.replace(
  /const mfgSlug = \(c\.manufacturer as any\)\?\.slug \|\| \(mfgName \? mfgName\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\s*const baseStr = `\$\{mfgSlug\}-\$\{c\.slug\}`;/g,
  "const baseStr = c.slug;"
);
fs.writeFileSync(arenaPath, codeArena);
