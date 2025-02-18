// /src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { createClient, MutableCookies } from '@/lib/utils/server-client';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log('[login] Payload:', { email, password });

    // Create an initial mutable response object
    const initialResponse = new NextResponse(null, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Get the mutable cookies store
    const mutableCookies = initialResponse.cookies as unknown as MutableCookies;

    // Create the Supabase client using the mutable cookies
    const supabase = await createClient(mutableCookies);
    console.log('[login] Supabase client created.');

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('[login] signInWithPassword result:', { data, error });

    if (error || !data.session) {
      console.error('[login] Error during login:', error?.message);
      return new NextResponse(
        JSON.stringify({ success: false, error: error?.message || 'No session returned' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Prepare the final response with JSON body
    const responseBody = { success: true, data };
    const finalResponse = NextResponse.json(responseBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Manually set the auth cookie.
    // Note: Adjust the domain if your app runs on 127.0.0.1 (or localhost) accordingly.
    finalResponse.cookies.set('sb-127-auth-token', data.session.access_token, {
      path: '/',
      domain: '127.0.0.1', // make sure this matches your app's host
      sameSite: 'lax',
      httpOnly: false,   // for debugging; consider setting true in production
      maxAge: 3600,
    });
    console.log('[login] Auth cookie set with access token.');

    return finalResponse;
  } catch (err) {
    console.error('[login] Exception:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}