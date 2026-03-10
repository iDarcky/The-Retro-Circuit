const fs = require('fs');

const file = 'app/actions/subscribers.ts';
let code = fs.readFileSync(file, 'utf8');

// Add the import if not present
if (!code.includes("import { createAdminClient }")) {
    code = code.replace(
        "import { createClient } from '../../lib/supabase/server';",
        "import { createClient } from '../../lib/supabase/server';\nimport { createAdminClient } from '../../lib/supabase/admin';"
    );
}

// Replace the supabase instance used for fetch and update
const targetFetch = `const { data: existingUser, error: fetchError } = await supabase
                    .from('subscribers')`;
const replacementFetch = `const adminClient = createAdminClient();
                const { data: existingUser, error: fetchError } = await adminClient
                    .from('subscribers')`;

code = code.replace(targetFetch, replacementFetch);

const targetUpdate = `const { error: updateError } = await supabase
                        .from('subscribers')`;
const replacementUpdate = `const { error: updateError } = await adminClient
                        .from('subscribers')`;

code = code.replace(targetUpdate, replacementUpdate);

fs.writeFileSync(file, code);
console.log('Successfully patched admin client usage in subscribers.ts');
