'use client';

import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';

export default function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // TODO: Implement actual session retrieval from Supabase.
    // For now, we simulate a logged-out state.
    setSession(null);
  }, []);

  return session;
}