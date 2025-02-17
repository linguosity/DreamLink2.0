// /src/app/api/debug-session/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/utils/server-client';

export async function GET() {
  console.log('[debug-session] Received GET request.');
  try {
    // Await cookies() to get the actual cookie store from the incoming request.
    const cookieStore = await cookies();
    console.log('[debug-session] Request cookies:', cookieStore.getAll());

    // Pass the actual cookie store to createClient.
    const supabase = await createClient(cookieStore as any);
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log('[debug-session] Session data:', session, 'Error:', error);

    const responseData = {
      success: !error,
      session, // will be null if not authenticated
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      error: error ? error.message : null,
    };

    return new NextResponse(JSON.stringify(responseData), {
      status: error ? 500 : 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[debug-session] Exception:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}