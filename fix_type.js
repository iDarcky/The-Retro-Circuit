const fs = require('fs');

const path = 'app/consoles/[slug]/page.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /import \{ notFound, redirect \} from 'next\/navigation';/g,
  "import { notFound } from 'next/navigation';"
);

fs.writeFileSync(path, code);
