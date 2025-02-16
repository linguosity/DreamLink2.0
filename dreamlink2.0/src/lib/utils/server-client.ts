// cSpell:ignore dreamlink supabase shadcn
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface MutableCookies {
  getAll: () => { name: string; value: string }[];
  set: (name: string, value: string, options?: any) => void;
  delete: (name: string) => void;
}

/**
 * Create a Supabase SSR client.
 * If a mutable cookies store is provided, it will be used;
 * otherwise, the function awaits Next.js's cookies() to obtain one.
 */
export async function createClient(responseCookies?: MutableCookies) {
  // If no cookies store is provided, await the default one.
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