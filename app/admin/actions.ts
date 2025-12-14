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
        const [users, consoles, games] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('consoles').select('id', { count: 'exact', head: true }),
          supabase.from('games').select('id', { count: 'exact', head: true }),
        ]);

        return {
          type: 'success',
          output: `SYSTEM METRICS:\n----------------\nUSERS:    ${users.count ?? 'ERR'}\nCONSOLES: ${consoles.count ?? 'ERR'}\nGAMES:    ${games.count ?? 'ERR'}`,
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
