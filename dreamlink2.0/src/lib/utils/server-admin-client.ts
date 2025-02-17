// src/lib/utils/server-admin-client.ts
import { createClient } from "@supabase/supabase-js";

// This admin client uses the service-role key for privileged operations.
// IMPORTANT: never expose this file to client-side code.

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,        // same URL as your normal client
  process.env.SUPABASE_SERVICE_ROLE_KEY!        // service-role key from your .env
);

export default supabaseAdmin;