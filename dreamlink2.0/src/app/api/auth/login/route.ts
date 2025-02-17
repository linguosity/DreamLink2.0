// /src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { createClient, MutableCookies } from '@/lib/utils/server-client';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    console.log('[login] Payload:', { email, password });

    // 1. Create an initial mutable response object
    const initialResponse = new NextResponse(null, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // 2. Convert its cookies store to our mutable cookies type
    const mutableCookies = initialResponse.cookies as unknown as MutableCookies;

    // 3. Create the Supabase client with that mutable cookies store
    const supabase = await createClient(mutableCookies);
    console.log('[login] Supabase client created.');

    // 4. Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('[login] signInWithPassword result:', { data, error });

    if (error) {
      console.error('[login] Error during login:', error.message);
      return new NextResponse(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Build the final response with the JSON body
    const responseBody = { success: true, data };
    const finalResponse = NextResponse.json(responseBody, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // 6. Copy all cookies from the initialResponse to the finalResponse.
    const allCookies = initialResponse.cookies.getAll();
    for (const cookie of allCookies) {
      // Since cookie.options is not available, we simply set the cookie using name and value.
      finalResponse.cookies.set(cookie.name, cookie.value);
    }

    return finalResponse;
  } catch (err) {
    console.error('[login] Exception:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}