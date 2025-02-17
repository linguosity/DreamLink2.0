import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClientWithServiceRole } from '@/lib/utils/server-client'; // or createClient if not testing with service role
import { dreamAnalysisSchema } from '@/types/dreamAnalysis';

// Dummy function to simulate server-side session retrieval.
async function getSession() {
  return { user: { id: 'cdfca057-74f7-4ece-b4de-5f624611d200' } };
}

// POST
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

    // Construct the analysis JSON object
    const analysisPayload = {
      title: parsed.data.title,
      original_dream: parsed.data.original_dream,
      tags: parsed.data.tags,
      analysis: parsed.data.analysis,
      // Optionally include timestamps if needed
      created_at: parsed.data.created_at,
      updated_at: parsed.data.updated_at,
    };

    const insertData = {
      user_id: session.user.id,
      analysis: JSON.stringify(analysisPayload),
    };

    // Use the service role client for testing (to bypass JWT issues)
    const supabase = await createClientWithServiceRole();
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

// GET: Retrieve all dream entries
export async function GET(req: Request) {
  try {
    // Use the service role client for testing
    const supabase = await createClientWithServiceRole();
    // Retrieve all dream entries
    const { data, error } = await supabase.from('dream_entries').select('*');

    if (error) {
      console.error('[dreams][GET] Supabase error:', error);
      return new NextResponse(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.log('[dreams][GET] Retrieved entries:', data);
    return new NextResponse(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[dreams][GET] Exception:', err);
    return new NextResponse(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE: Remove a dream entry by ID
export async function DELETE(req: Request) {
  try {
    // Parse the URL to get query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Missing id parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use the service role client for testing
    const supabase = await createClientWithServiceRole();

    // Delete the dream entry with the given id
    const { data, error } = await supabase
      .from("dream_entries")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("[dreams][DELETE] Supabase error:", error);
      return new NextResponse(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[dreams][DELETE] Deleted entry:", data);
    return new NextResponse(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[dreams][DELETE] Exception:", err);
    return new NextResponse(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}