const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'app/sitemap.ts');
let code = fs.readFileSync(filepath, 'utf8');

code = code.replace(
  /const mfg = item\.manufacturer as any;\s*const mfgSlug = mfg\?\.slug \|\| \(mfg\?\.name \? mfg\.name\.toLowerCase\(\)\.replace\(\/\\s\+\/g, '-'\) : 'unknown'\);\s*return \{\s*url: `\$\{baseUrl\}\/consoles\/\$\{mfgSlug\}-\$\{item\.slug\}`,\s*lastModified: new Date\(item\.updated_at \|\| new Date\(\)\),\s*changeFrequency: 'weekly',\s*priority: 0\.8\s*\};/g,
  "return {\n          url: `${baseUrl}/consoles/${item.slug}`,\n          lastModified: new Date(item.updated_at || new Date()),\n          changeFrequency: 'weekly',\n          priority: 0.8\n        };"
);

fs.writeFileSync(filepath, code);
