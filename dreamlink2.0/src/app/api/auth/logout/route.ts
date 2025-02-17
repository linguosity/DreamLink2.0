// /src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/utils/server-client';

export async function POST(req: Request) {
  console.log('[logout] Received logout request.');
  try {
    // Get the cookie store from the request
    const cookieStore = await cookies();
    console.log('[logout] Request cookies:', cookieStore.getAll());

    // Create Supabase client using these cookies
    const supabase = await createClient(cookieStore);
    console.log('[logout] Supabase client created for logout.');

    // Call signOut with local scope
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    console.log('[logout] signOut result:', { error });

    if (error) {
      console.error('[logout] Error during signOut:', error.message);
      return new NextResponse(JSON.stringify({ success: false, error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Manually clear the auth cookie by setting it with maxAge -1
    cookieStore.set('sb-localhost-auth-token', '', { maxAge: -1 });
    console.log('[logout] Auth cookie cleared.');

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[logout] Exception:', err);
    return new NextResponse(JSON.stringify({ success: false, error: 'Unexpected error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}