"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutGrid,
  RefreshCcw,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import type { UserRole } from "@/shared/types/auth";

type MobileNavProps = {
  fallbackRole: UserRole;
  previewRole?: UserRole;
};

const mobileIconByHref: Record<string, LucideIcon> = {
<<<<<<< HEAD
  "/dashboard":        LayoutGrid,
  "/pregnancies":      Baby,
  "/children":         Baby,
  "/appointments":     CalendarDays,
  "/schedule":         CalendarDays,
  "/mothers":          Baby,
  "/visits":           CalendarDays,
  "/diagnoses":        Stethoscope,
  "/service-requests": ClipboardList,
  "/staff":            Users,
  "/reports":          FileText,
  "/district-dashboard":  LayoutGrid,
  "/facilities":          ClipboardList,
  "/analytics":           LayoutGrid,
  "/national-dashboard":  LayoutGrid,
  "/national-reports":    FileText,
  "/users":               Users,
  "/sync":             RefreshCcw,
  "/sync-log":         RefreshCcw,
=======
  "/dashboard": LayoutGrid,
  "/pregnancies": Baby,
  "/children": Baby,
  "/my-children": Baby,
  "/appointments": CalendarDays,
  "/mothers": Baby,
  "/visits": CalendarDays,
  "/diagnoses": Stethoscope,
>>>>>>> 4afc06f6 (fix(routes): avoid parallel pages — move patient children to /my-children and update nav)
};

export function MobileNav({ fallbackRole, previewRole }: MobileNavProps) {
  const { navItems, roleTheme } = useRole({ fallbackRole, previewRole });
  const pathname = usePathname();

  const visibleItems = navItems.slice(0, 5);
  const cols = visibleItems.length <= 4 ? visibleItems.length : 5;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-2 py-2 shadow-[0_-10px_30px_-20px_rgba(39,111,117,0.45)] backdrop-blur print:hidden lg:hidden"
      style={{ borderColor: roleTheme.border }}
    >
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {visibleItems.map((item) => {
          const Icon = mobileIconByHref[item.href] ?? LayoutGrid;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "h-auto flex-col items-center justify-center gap-1 rounded-2xl px-1 py-3 text-[11px] font-medium",
                !isActive && "hover:bg-[#F3FAF9]",
              )}
              style={
                isActive
                  ? { backgroundColor: roleTheme.accentSoft, color: roleTheme.text }
                  : { color: "#54797C" }
              }
            >
              <Link href={item.href}>
                <Icon className="size-4" />
                <span>{item.shortLabel}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
