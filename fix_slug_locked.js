const fs = require('fs');

const path = 'components/admin/ConsoleForm.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /const \[isSlugLocked, setIsSlugLocked\] = useState\(!!initialData\);/g,
  "const [isSlugLocked, setIsSlugLocked] = useState(false);"
);

// We need to also remove `setIsSlugLocked(true);` from the useEffect that sets initial data.
code = code.replace(
  /setIsSlugLocked\(true\);/g,
  "// setIsSlugLocked(true);"
);

fs.writeFileSync(path, code);
