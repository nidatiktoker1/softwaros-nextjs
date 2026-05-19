import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSoftwareSlug } from "@/hooks/useSoftwareSlug";

export const SoftwareTabs = () => {
  const { basePath } = useSoftwareSlug();
  const pathname = usePathname();
  if (!basePath) return null;
  const tabs = [
    { href: `${basePath}/shortcuts`, label: "shortcuts" },
    { href: `${basePath}/reviews`, label: "reviews" },
    { href: `${basePath}/pricing`, label: "pricing" },
  ];
  return (
    <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
      {tabs.map((t) => {
        const isActive = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-2 text-sm font-mono whitespace-nowrap border-b-2 -mb-px transition ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            ./{t.label}
          </Link>
        );
      })}
    </div>
  );
};
