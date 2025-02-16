// cSpell:ignore supabase
import { NextResponse } from 'next/server';
import { createClient, MutableCookies } from '@/lib/utils/server-client';

export async function POST(req: Request) {
  console.log('[login] Received request with method:', req.method);
  try {
    const { email, password } = await req.json();
    console.log('[login] Payload:', { email, password });

    // Create a new mutable response.
    const response = new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    // Cast response.cookies to our MutableCookies type.
    const mutableCookies = response.cookies as unknown as MutableCookies;

    // Await the asynchronous createClient call.
    const supabase = await createClient(mutableCookies);
    console.log('[login] Supabase client created.');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    console.log('[login] signInWithPassword result:', { data, error });

    if (error) {
      console.error('[login] Error during login:', error.message);
      return new NextResponse(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[login] Login successful. Data:', data);
    return new NextResponse(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[login] Exception:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}