import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return NextResponse.json(
      { error: "Unauthorized: You must be logged in to submit a dream" },
      { status: 401 }
    );
  }
  
  try {
    // Parse request body
    const body = await request.json();
    const { dream_text } = body;
    
    if (!dream_text || typeof dream_text !== "string" || dream_text.trim() === "") {
      return NextResponse.json(
        { error: "Dream text is required" },
        { status: 400 }
      );
    }
    
    // Generate a placeholder title from the first 50 characters
    const title = dream_text.substring(0, 50) + (dream_text.length > 50 ? "..." : "");
    
    // Default placeholder analysis (will be replaced with AI processing in the future)
    const placeholder_analysis = {
      summary: "Dream analysis is being processed...",
      interpretation: "Interpretation pending...",
      biblical_references: []
    };
    
    // Insert dream into database
    const { data, error } = await supabase
      .from("dream_entries")
      .insert({
        user_id: user.id,
        original_text: dream_text,
        title,
        analysis: placeholder_analysis,
        status: "pending" // For tracking analysis status
      })
      .select("id")
      .single();
    
    if (error) {
      console.error("Error saving dream:", error);
      return NextResponse.json(
        { error: "Failed to save dream entry" },
        { status: 500 }
      );
    }
    
    // Return success with the created dream ID
    return NextResponse.json({ 
      success: true,
      message: "Dream recorded successfully",
      id: data.id
    });
    
  } catch (error) {
    console.error("Error processing dream submission:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}