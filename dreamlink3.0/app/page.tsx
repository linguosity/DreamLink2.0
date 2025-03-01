import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DreamCard from "@/components/DreamCard";
import DreamInput from "@/components/DreamInput"; // Client Component for dream input
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Welcome to Dreamlink</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader>
              <CardTitle>Record Your Dream</CardTitle>
              <CardDescription>Document your dreams for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Capture your dreams while they're fresh in your memory. The more details you include, the better your analysis will be.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                Record New Dream
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Dream Journal</CardTitle>
              <CardDescription>View your dream history and patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Browse through your past dreams, see patterns over time, and review previous analyses and interpretations.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Dream Journal
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Recent Dreams Section */}
        <h2 className="text-2xl font-semibold mb-4">Recent Dreams</h2>
        {(!dreams || dreams.length === 0) ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">No dreams recorded yet</CardTitle>
              <CardDescription>Record your first dream to get started</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {dreams.slice(0, 3).map((dream: any) => (
              <DreamCard key={dream.id} dream={dream} />
            ))}
            {dreams.length > 3 && (
              <div className="text-center mt-4">
                <Button variant="outline">View All Dreams</Button>
              </div>
            )}
          </div>
        )}
        
        {/* Quick Links */}
        <h2 className="text-2xl font-semibold mt-10 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/account">
            <Button variant="outline" className="w-full">Account</Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" className="w-full">Settings</Button>
          </Link>
          <Link href="/help">
            <Button variant="outline" className="w-full">Help</Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" className="w-full">About</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}