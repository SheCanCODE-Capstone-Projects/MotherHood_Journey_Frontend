"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  CalendarDays,
  LayoutGrid,
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
  "/dashboard": LayoutGrid,
  "/pregnancies": Baby,
  "/children": Baby,
  "/appointments": CalendarDays,
  "/mothers": Users,
  "/visits": Stethoscope,
  "/diagnoses": Stethoscope,
};

export function MobileNav({ fallbackRole, previewRole }: MobileNavProps) {
  const { role, navItems, roleTheme } = useRole({ fallbackRole, previewRole });
  const pathname = usePathname();

  if (role !== "patient" && role !== "health_worker") {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-2 py-2 shadow-[0_-10px_30px_-20px_rgba(39,111,117,0.45)] backdrop-blur print:hidden lg:hidden"
      style={{ borderColor: roleTheme.border }}
    >
      <div className="grid grid-cols-4 gap-1">
        {navItems.slice(0, 4).map((item) => {
          const Icon = mobileIconByHref[item.href] ?? LayoutGrid;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "h-auto flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[11px] font-medium",
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
