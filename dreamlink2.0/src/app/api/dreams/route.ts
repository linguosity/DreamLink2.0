// src/app/api/dreams/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServerClient } from '@/lib/utils/server-client';
import { dreamAnalysisSchema } from '@/types/dreamAnalysis';

// Dummy function to simulate server-side session retrieval.
async function getSession() {
  return { user: { id: 'cdfca057-74f7-4ece-b4de-5f624611d200' } };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('POST /api/dreams - Request body:', body);

    const parsed = dreamAnalysisSchema.safeParse(body);
    if (!parsed.success) {
      console.error('Zod validation error:', parsed.error);
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }
    console.log('Validated data:', parsed.data);

    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }
    console.log('Session user id:', session.user.id);

    const insertData = {
      user_id: session.user.id,
      title: parsed.data.title,
      content: parsed.data.original_dream,
      summary: JSON.stringify({
        tags: parsed.data.tags,
        analysis: parsed.data.analysis,
      }),
    };

    const supabase = createSupabaseServerClient();

    // (Removed RPC call for setting search_path.)

    const { data, error } = await supabase
      .from('dream_entries')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
    console.log('Supabase insert success:', data);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('POST /api/dreams error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}