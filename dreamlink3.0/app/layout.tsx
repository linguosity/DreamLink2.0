import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import Navbar from "@/components/Navbar";
import { headers } from "next/headers";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://dreamlink3-0.vercel.app";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Dreamlink - Dream Journal",
  description: "Track and analyze your dreams with AI-powered insights",
};

const inter = Inter({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Retrieve the user directly for better security
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error fetching user:", userError.message);
  }

  // Check if current path is an auth page
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isAuthPage = 
    pathname.includes('/sign-in') || 
    pathname.includes('/sign-up') || 
    pathname.includes('/forgot-password');
  
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            {/* Show env var warning if needed, otherwise show the navbar (only if user is logged in and not on auth page) */}
            {!hasEnvVars ? (
              <div className="w-full flex justify-center border-b h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 text-sm">
                  <EnvVarWarning />
                </div>
              </div>
            ) : user && !isAuthPage ? (
              <Navbar />
            ) : null}
            
            {/* Main content */}
            <div className={`flex-1 ${!user && !isAuthPage ? "flex items-center justify-center" : ""}`}>
              {children}
            </div>
            
            {/* Global footer only shown on auth pages */}
            {isAuthPage && (
              <footer className="w-full flex items-center justify-between border-t p-4 text-xs">
                <p className="text-muted-foreground">
                  © {new Date().getFullYear()} Dreamlink. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                  <ThemeSwitcher />
                </div>
              </footer>
            )}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}