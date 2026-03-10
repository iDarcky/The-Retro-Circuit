const fs = require('fs');

const file = 'app/actions/subscribers.ts';
let code = fs.readFileSync(file, 'utf8');

const oldStr = `update({
                            unsubscribed_at: null,
                            subscribed_at: new Date().toISOString()
                        })`;
const newStr = `update({
                            unsubscribed_at: null,
                            subscribed_at: new Date().toISOString()
                        })`;

if (code.includes(oldStr)) {
    // Already correct! Wait, let's verify if subscribed_at is actually updated.
    console.log('Update payload uses `subscribed_at: new Date().toISOString()` which matches schema `subscribed_at`');
}
