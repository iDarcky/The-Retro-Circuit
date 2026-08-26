import { createSign } from 'node:crypto';
import { writeFileSync } from 'node:fs';

/**
 * Pulls Search Analytics data out of Google Search Console.
 *
 * Setup (one time):
 *   1. Google Cloud Console -> enable the "Google Search Console API".
 *   2. Create a service account, then create a JSON key for it.
 *   3. Search Console -> Settings -> Users and permissions -> Add user ->
 *      paste the service account's email, role "Full" (or "Restricted").
 *   4. Put the key's two fields in .env.local:
 *        GSC_CLIENT_EMAIL="...iam.gserviceaccount.com"
 *        GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *        GSC_SITE_URL="sc-domain:theretrocircuit.com"   # or the https:// prefix form
 *
 * Usage:
 *   pnpm gsc:report                      # last 28 days, all dimensions
 *   pnpm gsc:report -- --days 90
 *   pnpm gsc:report -- --dimensions query,page
 *   pnpm gsc:report -- --out data/gsc.json
 */

// Node's built-in .env reader, so this script needs no extra dependency.
// Ignored when the file is absent — CI and Vercel supply real env vars instead.
try {
  process.loadEnvFile('.env.local');
} catch {
  /* no .env.local; fall back to the ambient environment */
}

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

const clientEmail = process.env.GSC_CLIENT_EMAIL;
const privateKey = process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, '\n');
const siteUrl = process.env.GSC_SITE_URL;

if (!clientEmail || !privateKey || !siteUrl) {
  console.error(
    'Missing GSC credentials. Set GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY and GSC_SITE_URL in .env.local.\n' +
      'See the setup block at the top of this file.'
  );
  process.exit(1);
}

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const days = Number(arg('days', '28'));
const dimensions = arg('dimensions', '').split(',').filter(Boolean);
const outFile = arg('out', '');

const base64url = (input: Buffer | string) =>
  Buffer.from(input).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** Signs a service-account JWT and trades it for an access token. */
async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64url(
    JSON.stringify({ iss: clientEmail, scope: SCOPE, aud: TOKEN_URL, exp: now + 3600, iat: now })
  );

  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  const signature = base64url(signer.sign(privateKey as string));

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claim}.${signature}`,
    }),
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status} ${await res.text()}`);
  return (await res.json()).access_token;
}

async function query(token: string, dims: string[]) {
  const end = new Date();
  const start = new Date(end.getTime() - days * 86_400_000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const res = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl as string)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate: iso(start),
        endDate: iso(end),
        dimensions: dims,
        rowLimit: 500,
      }),
    }
  );

  if (!res.ok) throw new Error(`Query failed (${dims.join('+') || 'totals'}): ${res.status} ${await res.text()}`);
  return (await res.json()).rows ?? [];
}

function table(rows: any[], label: string, limit = 25) {
  if (!rows.length) return console.log(`\n${label}: no data\n`);
  console.log(`\n=== ${label} ===`);
  console.table(
    rows.slice(0, limit).map((r) => ({
      key: (r.keys ?? []).join(' | '),
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: `${(r.ctr * 100).toFixed(2)}%`,
      position: r.position?.toFixed(1),
    }))
  );
}

async function main() {
  const token = await getAccessToken();
  const groups = dimensions.length
    ? [dimensions]
    : [['query'], ['page'], ['country'], ['device'], ['date']];

  const report: Record<string, any[]> = {};
  const totals = await query(token, []);
  table(totals, `Totals — last ${days} days`);
  report.totals = totals;

  for (const dims of groups) {
    const rows = await query(token, dims);
    report[dims.join('+')] = rows;
    table(rows, `By ${dims.join(' + ')} — last ${days} days`);
  }

  if (outFile) {
    writeFileSync(outFile, JSON.stringify(report, null, 2));
    console.log(`\nWrote ${outFile}`);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
