import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import CompactDreamInput from "@/components/CompactDreamInput";
import AnimatedDreamGrid from "@/components/AnimatedDreamGrid";

export default async function MainPage() {
  const supabase = await createClient();

  // Check if user is logged in (more secure method)
  const { data, error: userError } = await supabase.auth.getUser();
  const user = data?.user;
  
  console.log("Home page - Auth check:", user ? "User authenticated" : "No user found");
  
  if (userError || !user) {
    console.error("Authentication error:", userError?.message || "No user found");
    return redirect("/sign-in");
  }

  // Fetch dream entries for the logged in user
  const { data: dreams, error } = await supabase
    .from("dream_entries")
    .select("*")
    .eq("user_id", user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Dream Input Section */}
        <CompactDreamInput userId={user.id} />
        
        {/* Animated Dream Grid */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Your Dream Journal</h2>
          <AnimatedDreamGrid dreams={dreams || []} />
        </div>
        
        {/* Footer Section */}
        <footer className="border-t pt-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">Dreamlink</h3>
              <p className="text-muted-foreground text-sm">
                AI-powered dream journaling with biblical insights and dream pattern analysis.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/account" className="text-sm hover:underline">Account</Link></li>
                <li><Link href="/settings" className="text-sm hover:underline">Settings</Link></li>
                <li><Link href="/help" className="text-sm hover:underline">Help</Link></li>
                <li><Link href="/about" className="text-sm hover:underline">About</Link></li>
                <li><Link href="/privacy" className="text-sm hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-3">Connect</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Have questions or feedback?
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">Contact Us</Button>
              </Link>
            </div>
          </div>
          
          <div className="text-center text-xs text-muted-foreground mt-8 pt-4 border-t">
            &copy; {new Date().getFullYear()} Dreamlink. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}