import { createClient } from '@/lib/utils/server-client';
import { NextResponse } from 'next/server';

// GET: Fetch user profile
export async function GET(req: Request) {
  // Use the custom server client helper (which already awaits cookies())
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select(
      'preferred_language, bible_version, color_analysis, gematria_analysis, avatar_url, display_name'
    )
    .eq('id', user.id);
  
  if (profileError) {
    return NextResponse.json(
      { success: false, error: profileError.message },
      { status: 500 }
    );
  }
  
  if (!profiles || profiles.length !== 1) {
    return NextResponse.json(
      { success: false, error: 'Profile not found or duplicate profiles exist' },
      { status: 400 }
    );
  }
  
  return NextResponse.json({ success: true, data: profiles[0] });
}

// PATCH: Update user profile
export async function PATCH(req: Request) {
  const supabase = await createClient();
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  let updates: Record<string, any>;
  try {
    updates = await req.json();
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }
  
  const { data, error: updateError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select();
  
  if (updateError) {
    return NextResponse.json(
      { success: false, error: updateError.message },
      { status: 400 }
    );
  }
  
  return NextResponse.json({ success: true, data: data?.[0] ?? null });
}