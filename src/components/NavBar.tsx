"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useCategories } from "@/hooks/useSoftware";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/", label: "Home" },
];

const mainNavItems = [
  { href: "/compare", label: "Compare" },
  { href: "/shortcuts", label: "Shortcuts" },
  { href: "/pricing", label: "Pricing" },
];

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: categories } = useCategories();

  useEffect(() => {
    // Get the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const categoryLinks = useMemo(() => {
    return (categories ?? []).map((c) => ({
      icon: c.icon,
      name: c.name,
      slug: c.slug,
    }));
  }, [categories]);

  const linkClass =
    "px-3 py-1.5 rounded text-sm text-foreground hover:text-primary transition-colors";

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link href="/" className="flex items-center font-bold text-[22px] leading-none">
          <span className="text-foreground">Software</span>
          <span className="text-primary">OS</span>
          <span className="text-primary animate-blink ml-0.5">_</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${linkClass} ${isActive(item.href) ? "text-primary" : ""}`}
            >
              {item.label}
            </Link>
          ))}

          {/* Categories Dropdown */}
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className={`${linkClass} inline-flex items-center gap-1`}>
                Categories
                <ChevronDown className="w-3 h-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 bg-[#111111] border-border/40">
              {categoryLinks.map((cat) => (
                <DropdownMenuItem key={cat.slug} asChild>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:text-[#ff4d00] cursor-pointer transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${linkClass} ${isActive(item.href) ? "text-primary" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons / User menu */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <DropdownMenu open={userMenuOpen} onOpenChange={setUserMenuOpen}>
              <DropdownMenuTrigger asChild>
                <button className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-xs font-mono hover:bg-primary/30 transition">
                  {session.user?.email?.split("@")[0]}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-[#111111] border-border/40">
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="px-3 py-2 text-sm text-foreground hover:text-primary cursor-pointer transition-colors"
                  >
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="px-3 py-2 text-sm text-foreground hover:text-primary cursor-pointer transition-colors"
                  >
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="px-3 py-2 text-sm text-red-500 hover:text-red-400 cursor-pointer transition-colors"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                href="/login"
                className={`${linkClass} text-primary hover:text-primary-glow`}
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 rounded-md bg-gradient-to-r from-primary to-primary-glow text-primary-foreground text-xs font-mono font-bold hover:shadow-glow transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded text-foreground hover:text-primary transition"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-sm text-foreground hover:text-primary border-b border-border/40 last:border-0"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Categories Section */}
            <div className="border-b border-border/40">
              <div className="px-2 py-2 text-sm font-semibold text-foreground">
                Categories
              </div>
              {categoryLinks.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="pl-6 px-2 py-2.5 text-sm text-muted-foreground hover:text-primary border-b border-border/40 last:border-0 flex items-center gap-2"
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>

            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-sm text-foreground hover:text-primary border-b border-border/40 last:border-0"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile auth section */}
            <div className="border-t border-border/40 mt-2 pt-2">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="px-2 py-3 text-sm text-foreground hover:text-primary border-b border-border/40 block"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="px-2 py-3 text-sm text-foreground hover:text-primary border-b border-border/40 block"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                    className="w-full px-2 py-3 text-sm text-red-500 hover:text-red-400 border-b border-border/40 text-left"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="px-2 py-3 text-sm text-foreground hover:text-primary border-b border-border/40 block"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="px-2 py-3 text-sm text-primary hover:text-primary-glow block"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
