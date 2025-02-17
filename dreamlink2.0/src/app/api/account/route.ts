// src/app/api/account/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/utils/server-client";
// Import the admin client which uses the service-role key.
// IMPORTANT: Ensure this file (server-admin-client.ts) is used only in server routes.
import supabaseAdmin from "@/lib/utils/server-admin-client";

export async function DELETE(req: Request) {
  console.log("[account][DELETE] Received account deletion request.");
  try {
    // Step 1: Retrieve cookies from the incoming request.
    const cookieStore = await cookies();
    console.log("[account][DELETE] Request cookies:", cookieStore.getAll());

    // Step 2: Create a normal Supabase client using the request cookies to verify the user's session.
    const supabase = await createClient(cookieStore);
    console.log("[account][DELETE] Supabase client created.");

    // Step 3: Get the current user session.
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    console.log("[account][DELETE] getUser result:", { user, userError });
    if (userError || !user) {
      return new NextResponse(
        JSON.stringify({ success: false, error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 4: Use the admin client to delete the user from auth.users.
    const { error: adminError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (adminError) {
      console.error("[account][DELETE] Admin deletion error:", adminError.message);
      return new NextResponse(
        JSON.stringify({ success: false, error: adminError.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 5: Optionally, delete the user's profile from your custom 'profiles' table.
    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);
    if (profileError) {
      console.error("[account][DELETE] Profile deletion error:", profileError.message);
      return new NextResponse(
        JSON.stringify({ success: false, error: profileError.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("[account][DELETE] Account deletion successful.");
    return new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[account][DELETE] Exception:", err);
    return new NextResponse(
      JSON.stringify({ success: false, error: "Unexpected error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}