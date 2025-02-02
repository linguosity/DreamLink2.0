import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  console.log('Received a request with method:', req.method);  // Should output POST
  const { email, password } = await req.json();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
  
  return NextResponse.json({ success: true, data });
}