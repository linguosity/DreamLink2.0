// /lib/utils/server-client.ts
// cSpell:ignore dreamlink supabase shadcn
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface MutableCookies {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options?: any) => void;
  delete: (name: string) => void;
}

/**
 * Create a Supabase SSR client using cookies.
 * If no mutable cookies store is provided, it awaits Next.js's cookies().
 */
export async function createClient(responseCookies?: MutableCookies) {
  const cookieStore: MutableCookies = responseCookies ?? (await cookies());
  console.log('[server-client] Initial cookies:', cookieStore.getAll());

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const all = cookieStore.getAll();
          console.log('[server-client] getAll cookies:', all);
          return all;
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          console.log('[server-client] setAll called with:', cookiesToSet);
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log(`[server-client] Setting cookie ${name}=${value}`, options);
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}

/**
 * Create a Supabase SSR client using the service role key.
 * This bypasses JWT verification and is for testing/server-to-server calls only.
 */
export async function createClientWithServiceRole(responseCookies?: MutableCookies) {
  const cookieStore: MutableCookies = responseCookies ?? (await cookies());
  console.log('[server-client] Initial cookies (service role):', cookieStore.getAll());

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // Use the service role key here
    {
      cookies: {
        getAll() {
          const all = cookieStore.getAll();
          console.log('[server-client] getAll cookies (service role):', all);
          return all;
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          console.log('[server-client] setAll called with (service role):', cookiesToSet);
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log(`[server-client] Setting cookie ${name}=${value} (service role)`, options);
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
}