import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { data, error: userError } = await supabase.auth.getUser();
  const user = data?.user;

  if (userError || !user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the user's profile
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('preferred_language, bible_version, color_analysis, gematria_analysis, avatar_url, display_name')
    .eq('id', user.id);

  if (profileError) {
    return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
  }

  // Ensure exactly one profile is returned
  if (!profiles || profiles.length !== 1) {
    return NextResponse.json({ success: false, error: 'Profile not found or duplicate profiles exist' }, { status: 400 });
  }

  return NextResponse.json({ success: true, data: profiles[0] });
}