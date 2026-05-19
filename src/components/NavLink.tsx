import Link, { LinkProps } from "next/link";
import { forwardRef, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends LinkProps {
  className?: string | ((state: { isActive: boolean; isPending: boolean }) => string);
  activeClassName?: string;
  pendingClassName?: string;
  children?: ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, children, ...props }, ref) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    let classes: string;
    if (typeof className === "function") {
      classes = className({ isActive, isPending: false });
    } else {
      classes = cn(
        className,
        isActive && activeClassName,
        pendingClassName
      );
    }

    return (
      <Link
        ref={ref}
        href={href}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
