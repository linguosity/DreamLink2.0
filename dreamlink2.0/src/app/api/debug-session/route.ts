// cSpell:ignore supabase
import { NextResponse } from 'next/server';
import { createClient, MutableCookies } from '@/lib/utils/server-client';

export async function GET() {
  console.log('[debug-session] Received GET request.');
  try {
    const dummyResponse = new NextResponse();
    dummyResponse.headers.set('Content-Type', 'application/json');
    const mutableCookies = dummyResponse.cookies as unknown as MutableCookies;
    const supabase = await createClient(mutableCookies);
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