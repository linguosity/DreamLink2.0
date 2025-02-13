import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/server-client';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, data });
}