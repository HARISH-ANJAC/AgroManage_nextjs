'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  to?: string; // for compatibility with copied code
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  end?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, to, children, end, ...props }, ref) => {
    const pathname = usePathname();
    const targetHref = href || to || "#";
    
    const isActive = end 
      ? pathname === targetHref 
      : pathname.startsWith(targetHref) && (targetHref !== "/" || pathname === "/");

    return (
      <Link
        ref={ref}
        href={targetHref}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
