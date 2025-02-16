'use client';

import { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';

export default function useSession(): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    async function fetchSession() {
      console.log('[useSession] Fetching session from /api/debug-session...');
      try {
        const res = await fetch('/api/debug-session');
        if (!res.ok) {
          console.error('[useSession] Failed to fetch session:', res.statusText);
          return;
        }
        const data = await res.json();
        console.log('[useSession] Session received:', data.session);
        setSession(data.session);
      } catch (error) {
        console.error('[useSession] Error fetching session:', error);
      }
    }
    fetchSession();
  }, []);

  return session;
}