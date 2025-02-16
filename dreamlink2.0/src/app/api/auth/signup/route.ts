// cSpell:ignore supabase
import { NextResponse } from 'next/server';
import { createClient, MutableCookies } from '@/lib/utils/server-client';

export async function POST(req: Request) {
  console.log('[signup] Received signup request.');
  try {
    const { email, password } = await req.json();
    console.log('[signup] Payload:', { email, password });

    const response = new NextResponse(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    const mutableCookies = response.cookies as unknown as MutableCookies;
    const supabase = await createClient(mutableCookies);
    console.log('[signup] Supabase client created for signup.');

    const { data, error } = await supabase.auth.signUp({ email, password });
    console.log('[signup] signUp result:', { data, error });

    if (error) {
      console.error('[signup] Error during signup:', error.message);
      return new NextResponse(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('[signup] Signup successful. Data:', data);
    return new NextResponse(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[signup] Exception:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unexpected error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}