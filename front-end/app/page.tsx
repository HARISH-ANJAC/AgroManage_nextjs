"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Home component serves as the entry point of the application.
 * It removes the previous landing page and performs a quick authentication check
 * to redirect the user to either the Dashboard or the Login page.
 */
import { isAuthenticated } from '@/lib/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  // Premium loading state while redirecting
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-body transition-colors duration-500">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 animate-pulse"></div>
          <div className="absolute top-0 h-16 w-16 rounded-full border-t-4 border-primary animate-spin"></div>
        </div>
        <div className="flex flex-col items-center animate-pulse">
          <span className="text-xl font-display font-bold text-primary tracking-tight">TBGS</span>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em] mt-1">Initializing Ecosystem...</p>
        </div>
      </div>
    </div>
  );
}
