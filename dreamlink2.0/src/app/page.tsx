'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSession from '@/lib/utils/use-session';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const session = useSession();
  const router = useRouter();

  // Redirect to the main page if the user is already logged in
  useEffect(() => {
    if (session) {
      router.push('/main');
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Welcome to Dreamlink</h1>
      <p className="mb-8 text-lg">
        Share your dreams, explore interpretations, and connect with your subconscious.
      </p>
      <Button variant="default" onClick={() => router.push('/login')}>
        Login / Sign Up
      </Button>
    </div>
  );
}