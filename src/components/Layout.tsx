import { useState, useMemo, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { CategoryBars } from "./CategoryBars";
import { SiteFooter } from "./SiteFooter";
import { NavLink } from "./NavLink";
import { useCategories } from "@/hooks/useSoftware";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/", label: "Home", end: true },
];

const mainNavItems = [
  { href: "/compare", label: "Compare" },
  { href: "/shortcuts", label: "Shortcuts" },
  { href: "/pricing", label: "Pricing" },
];

export const Layout = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: categories } = useCategories();

  const categoryLinks = useMemo(() => {
    return (categories ?? []).map((c) => ({
      icon: c.icon,
      name: c.name,
      slug: c.slug,
    }));
  }, [categories]);

  const linkClass =
    "px-3 py-1.5 rounded text-sm text-foreground hover:text-primary transition-colors";

  return (
    <div className="min-h-screen flex flex-col">
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
              <NavLink
                key={item.label}
                href={item.href}
                className={({ isActive }) => `${linkClass} ${isActive ? "text-primary" : ""}`}
              >
                {item.label}
              </NavLink>
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
              <NavLink
                key={item.label}
                href={item.href}
                className={({ isActive }) => `${linkClass} ${isActive ? "text-primary" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

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
            </nav>
          </div>
        )}
      </header>

      <CategoryBars />

      <main className="flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
};
