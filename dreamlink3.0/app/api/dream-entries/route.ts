import { NextResponse } from "next/server";
import { z } from "zod";
import { dreamEntrySchema } from "@/schema/dreamEntry";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    // Parse and validate incoming JSON using the Zod schema
    const body = await req.json();
    const validatedData = dreamEntrySchema.parse(body);

    // Insert the validated data into the dream_entries table
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("dream_entries")
      .insert(validatedData)
      .select();

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true, data });
  } catch (err) {
    // Return validation errors if present
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: err.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Unexpected error" },
      { status: 500 }
    );
  }
}