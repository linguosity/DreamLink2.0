import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET() {
  // Retrieve the session using Supabase client
  const { data: session, error } = await supabase.auth.getSession();

  // Build a response object that includes debugging information
  const response = {
    success: !error,
    session: session || null,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    error: error ? error.message : null,
  };

  // Return the JSON response
  return NextResponse.json(response, { status: error ? 500 : 200 });
}