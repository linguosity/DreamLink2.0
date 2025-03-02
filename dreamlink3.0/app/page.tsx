import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DreamCard from "@/components/DreamCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import CompactDreamInput from "@/components/CompactDreamInput";

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
        
        {/* Dream Cards Carousel */}
        <div className="mt-12">
          <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory gap-4 scrollbar-hide">
            {(!dreams || dreams.length === 0) ? (
              <div className="snap-center shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/3">
                <DreamCard 
                  empty={true} 
                  dream={{
                    id: 'placeholder',
                    original_text: "I was walking along a beach at sunset when I noticed the water was crystal clear. I could see colorful fish swimming beneath the surface. Suddenly, the water parted in front of me like the Red Sea in the Bible. I walked between the walls of water and discovered an ancient temple with symbols I couldn't understand. Inside the temple was a bright light that spoke to me, saying I had a mission to fulfill. I woke up feeling peaceful yet with a sense of purpose.",
                    title: 'Example: Ocean Temple Dream',
                    dream_summary: 'A journey to an underwater temple where divine guidance was received, suggesting a spiritual calling or mission.',
                    analysis_summary: 'This dream contains elements of divine revelation and spiritual journey. The parting waters reference Moses and the Exodus story, while the temple represents a sacred space for divine communication. The voice from light suggests divine guidance or calling.',
                    tags: ['Water', 'Temple', 'Divine Message', 'Journey'],
                    bible_refs: ['Exodus 14:21', 'John 8:12', '1 Kings 6:19', 'Psalm 23:2'],
                    created_at: new Date().toISOString()
                  }} 
                />
              </div>
            ) : (
              // Show actual dreams if they exist
              dreams.slice(0, 10).map((dream: any) => (
                <div key={dream.id} className="snap-center shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/3">
                  {/* We can't directly use localStorage here since this is a server component.
                      The loading state will be handled by client JavaScript in the DreamCard */}
                  <DreamCard dream={dream} />
                </div>
              ))
            )}
          </div>
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