'use server';

import { createClient } from '../../lib/supabase/server';

export type TerminalResponse = {
  type: 'success' | 'error';
  output: string;
};

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

export async function executeTerminalCommand(commandStr: string): Promise<TerminalResponse> {
  // 1. Security Check
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return {
      type: 'error',
      output: 'ACCESS DENIED: ADMIN CLEARANCE REQUIRED.',
    };
  }

  // 2. Parse Command
  const parts = commandStr.trim().split(/\s+/);
  const command = parts[0]?.toLowerCase();
  const args = parts.slice(1);

  if (!command) {
    return { type: 'success', output: '' };
  }

  const supabase = await createClient();

  try {
    switch (command) {
      case 'status': {
        const start = Date.now();
        const { error } = await supabase.from('manufacturers').select('id', { count: 'exact', head: true });
        const latency = Date.now() - start;

        if (error) throw new Error(error.message);

        return {
          type: 'success',
          output: `DATABASE CONNECTION: ONLINE\nLATENCY: ${latency}ms\nREGION: AWS-US-EAST-1 (ASSUMED)\nSTATUS: OPTIMAL`,
        };
      }

      case 'stats': {
        const [users, consoles, games, manufacturers, variants] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('consoles').select('id', { count: 'exact', head: true }),
          supabase.from('games').select('id', { count: 'exact', head: true }),
          supabase.from('manufacturers').select('id', { count: 'exact', head: true }),
          supabase.from('console_variants').select('id', { count: 'exact', head: true }),
        ]);

        return {
          type: 'success',
          output: `SYSTEM METRICS:\n----------------\nUSERS:         ${users.count ?? 'ERR'}\nCONSOLES:      ${consoles.count ?? 'ERR'}\nVARIANTS:      ${variants.count ?? 'ERR'}\nGAMES:         ${games.count ?? 'ERR'}\nMANUFACTURERS: ${manufacturers.count ?? 'ERR'}`,
        };
      }

      case 'env': {
        const safeKeys = [
          'NODE_ENV',
          'NEXT_PUBLIC_SUPABASE_URL',
          'VERCEL_ENV',
          'VERCEL_REGION'
        ];

        const envOutput = safeKeys
          .map(key => `${key}: ${process.env[key] || 'NOT SET'}`)
          .join('\n');

        return {
          type: 'success',
          output: `ENVIRONMENT VARIABLES (SAFE LIST):\n----------------\n${envOutput}`,
        };
      }

      case 'users': {
        const limit = args[0] ? parseInt(args[0], 10) : 5;
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('username, created_at, role')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw new Error(error.message);
        if (!profiles || profiles.length === 0) return { type: 'success', output: 'NO USERS FOUND.' };

        const header = 'USERNAME             ROLE       CREATED_AT\n------------------------------------------------';
        const rows = profiles.map(p => {
            const username = (p.username || 'UNKNOWN').padEnd(20);
            const role = (p.role || 'user').padEnd(10);
            const date = new Date(p.created_at).toISOString().split('T')[0];
            return `${username} ${role} ${date}`;
        }).join('\n');

        return {
          type: 'success',
          output: `${header}\n${rows}`,
        };
      }

      case 'inspect': {
        const table = args[0];
        const id = args[1];

        if (!table || !id) {
             return { type: 'error', output: 'USAGE: inspect <table_name> <id_or_slug>' };
        }

        const validTables = ['consoles', 'manufacturers', 'games', 'console_variants', 'profiles'];
        if (!validTables.includes(table)) {
             return { type: 'error', output: `INVALID TABLE. ALLOWED: ${validTables.join(', ')}` };
        }

        // Try to fetch by ID first, then slug if applicable
        let query = supabase.from(table).select('*').eq('id', id).maybeSingle();

        // Execute
        const { data, error } = await query;

        if (error) throw new Error(error.message);
        if (!data) {
             // Retry with slug if the table has it
             if (['consoles', 'manufacturers', 'games'].includes(table)) {
                 const { data: slugData, error: slugError } = await supabase.from(table).select('*').eq('slug', id).maybeSingle();
                 if (slugError) throw new Error(slugError.message);
                 if (slugData) {
                     return { type: 'success', output: JSON.stringify(slugData, null, 2) };
                 }
             }
             return { type: 'error', output: `RECORD NOT FOUND IN ${table}` };
        }

        return {
            type: 'success',
            output: JSON.stringify(data, null, 2)
        };
      }

      case 'trace': {
          const operation = args[0];
          if (!operation) return { type: 'error', output: 'USAGE: trace <fetch_consoles | check_auth>' };

          const logs: string[] = [];
          const startTotal = performance.now();

          const logStep = (step: string, time?: number) => {
              logs.push(`[${(performance.now() - startTotal).toFixed(2)}ms] ${step} ${time ? `(${time.toFixed(2)}ms)` : ''}`);
          };

          try {
              if (operation === 'fetch_consoles') {
                  logStep('START: fetch_consoles');

                  const s1 = performance.now();
                  const { data, error } = await supabase
                    .from('consoles')
                    .select('id, name, variants:console_variants(count)')
                    .limit(5);
                  logStep('DB QUERY: select consoles + variant count', performance.now() - s1);

                  if (error) throw error;

                  const s2 = performance.now();
                  const processed = data.map(c => ({
                      ...c,
                      variant_count: c.variants ? (c.variants[0] as any).count : 0
                  }));
                  logStep('PROCESS: normalize data', performance.now() - s2);

                  logStep(`COMPLETE: found ${processed.length} records`);
              }
              else if (operation === 'check_auth') {
                  logStep('START: check_auth');
                  const s1 = performance.now();
                  const { data: { user } } = await supabase.auth.getUser();
                  logStep('AUTH: getUser()', performance.now() - s1);

                  if (user) {
                      const s2 = performance.now();
                      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
                      logStep('DB: fetch profile role', performance.now() - s2);
                      logStep(`RESULT: User ${user.email} is ${profile?.role}`);
                  } else {
                      logStep('RESULT: No Active Session');
                  }
              }
              else {
                  return { type: 'error', output: `UNKNOWN TRACE: ${operation}` };
              }

              return { type: 'success', output: logs.join('\n') };

          } catch (e: any) {
               return { type: 'error', output: `TRACE FAILED: ${e.message}` };
          }
      }

      case 'performance': {
           const metrics: string[] = [];

           // 1. Connection Ping
           const t1 = performance.now();
           await supabase.from('manufacturers').select('id').limit(1);
           metrics.push(`DB PING: ${(performance.now() - t1).toFixed(2)}ms`);

           // 2. Heavy Query Simulation (Join)
           const t2 = performance.now();
           await supabase.from('consoles').select('*, variants:console_variants(*)').limit(10);
           metrics.push(`HEAVY JOIN (10 rows): ${(performance.now() - t2).toFixed(2)}ms`);

           // 3. Count Query
           const t3 = performance.now();
           await supabase.from('games').select('id', { count: 'exact', head: true });
           metrics.push(`COUNT GAMES: ${(performance.now() - t3).toFixed(2)}ms`);

           return {
               type: 'success',
               output: `PERFORMANCE METRICS:\n--------------------\n${metrics.join('\n')}`
           };
      }

      default:
        return {
          type: 'error',
          output: `UNKNOWN COMMAND: "${command}". TYPE "help" FOR MANIFEST.`,
        };
    }
  } catch (err: any) {
    return {
      type: 'error',
      output: `SYSTEM ERROR: ${err.message}`,
    };
  }
}
