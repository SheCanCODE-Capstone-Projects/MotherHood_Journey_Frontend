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

import { cn } from "@/shared/lib/utils";
import type { RoleNavItem } from "@/shared/config/rbac";
import type { UserRole } from "@/shared/types/auth";

type MobileNavProps = {
  role: UserRole;
  navItems: RoleNavItem[];
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

export function MobileNav({ role, navItems }: MobileNavProps) {
  const pathname = usePathname();

  if (role !== "patient" && role !== "health_worker") {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#D6E7E5] bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-4 gap-1">
        {navItems.slice(0, 4).map((item) => {
          const Icon = mobileIconByHref[item.href] ?? LayoutGrid;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-[11px] font-medium transition",
                isActive
                  ? "bg-[#E2F3F1] text-[#1D5052]"
                  : "text-[#54797C] hover:bg-[#F3FAF9]",
              )}
            >
              <Icon className="size-4" />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
