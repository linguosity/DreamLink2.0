// cSpell:ignore supabase
import { NextResponse } from 'next/server';
import { createClient, MutableCookies } from '@/lib/utils/server-client';

export async function POST(req: Request) {
  console.log('[logout] Received logout request.');
  try {
    const response = new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const mutableCookies = response.cookies as unknown as MutableCookies;
    const supabase = await createClient(mutableCookies);
    console.log('[logout] Supabase client created for logout.');

    const { error } = await supabase.auth.signOut();
    console.log('[logout] signOut result:', { error });

    if (error) {
      console.error('[logout] Error during signOut:', error.message);
      return new NextResponse(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[logout] Logout successful. Clearing auth cookie.');
    mutableCookies.delete('sb-localhost-auth-token'); // adjust the cookie name if needed

    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[logout] Exception:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}