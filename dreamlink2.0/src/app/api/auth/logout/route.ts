import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/utils/server-client';

export async function POST() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}