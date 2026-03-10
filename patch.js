const fs = require('fs');

const file = 'app/actions/subscribers.ts';
let code = fs.readFileSync(file, 'utf8');

// The email sending logic
const sendEmailRegex = /try \{\s+const htmlContent = `[\s\S]*?`\.trim\(\);\s+await resend\.emails\.send\(\{[\s\S]*?\}\);\s+\} catch \(emailError\) \{\s+console\.error\('Failed to send welcome email:', emailError\);\s+\/\/ We don't fail the subscription if the email fails, just log it\.\s+\}/m;

const sendEmailMatch = code.match(sendEmailRegex);

if (sendEmailMatch) {
    const emailLogic = sendEmailMatch[0];

    // Add the helper function
    const helperCode = `
async function sendWelcomeEmail(normalizedEmail: string) {
    ${emailLogic.replace(/try \{/g, 'try {').replace(/\}\s+catch/g, '} catch')}
}
`;

    // Replace the existing logic with the function call
    code = code.replace(sendEmailRegex, 'await sendWelcomeEmail(normalizedEmail);');

    // Insert the helper function at the end of the file
    code += helperCode;

    fs.writeFileSync(file, code);
    console.log('Successfully patched subscribers.ts');
} else {
    console.error('Could not find email sending logic to patch');
}
