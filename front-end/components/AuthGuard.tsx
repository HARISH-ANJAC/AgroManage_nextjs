"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    if (!isLoggedIn && pathname !== "/login") {
      router.push("/login");
    } else if (isLoggedIn && pathname === "/login") {
      router.push("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  if (isChecking && pathname !== "/login") {
     return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
  }

  return <>{children}</>;
}
