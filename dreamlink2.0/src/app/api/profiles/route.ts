import { createClient } from '@/lib/utils/server-client';
import { NextResponse } from 'next/server';

// GET: Fetch user profile
export async function GET(req: Request) {
  console.log('[profiles][GET] Received request.');
  // Create a mutable response to obtain a mutable cookies store.
  const response = new NextResponse();
  response.headers.set('Content-Type', 'application/json');

  // Await the async createClient call
  const supabase = await createClient(response.cookies);
  console.log('[profiles][GET] Supabase client created.');

  // Retrieve the user from the session.
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('[profiles][GET] getUser result:', { user, userError });

  if (userError || !user) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Fetch the user's profile from the "profiles" table.
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('preferred_language, bible_version, color_analysis, gematria_analysis, avatar_url, display_name')
    .eq('id', user.id);
  console.log('[profiles][GET] Profile query result:', { profiles, profileError });

  if (profileError) {
    return new NextResponse(
      JSON.stringify({ success: false, error: profileError.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!profiles || profiles.length !== 1) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Profile not found or duplicate profiles exist' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new NextResponse(
    JSON.stringify({ success: true, data: profiles[0] }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

// PATCH: Update user profile
export async function PATCH(req: Request) {
  console.log('[profiles][PATCH] Received request.');
  // Create a mutable response.
  const response = new NextResponse();
  response.headers.set('Content-Type', 'application/json');

  // Await the async createClient call
  const supabase = await createClient(response.cookies);
  console.log('[profiles][PATCH] Supabase client created.');

  // Retrieve the user session.
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('[profiles][PATCH] getUser result:', { user, userError });
  if (userError || !user) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Parse the JSON body for updates.
  let updates: Record<string, any>;
  try {
    updates = await req.json();
    console.log('[profiles][PATCH] Updates received:', updates);
  } catch (err) {
    console.error('[profiles][PATCH] Error parsing JSON:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Update the user's profile.
  const { data, error: updateError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select();
  console.log('[profiles][PATCH] Update result:', { data, updateError });

  if (updateError) {
    return new NextResponse(
      JSON.stringify({ success: false, error: updateError.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new NextResponse(
    JSON.stringify({ success: true, data: data?.[0] ?? null }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}