import { NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/server-client';

export async function POST(req: Request) {
  console.log('Received a request with method:', req.method);
  const { email, password } = await req.json();

  // Use your SSR client instead of the client from supabaseClient.ts
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
  
  return NextResponse.json({ success: true, data });
}