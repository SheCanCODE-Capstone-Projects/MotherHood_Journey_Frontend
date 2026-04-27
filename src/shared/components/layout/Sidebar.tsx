"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  BarChart3,
  CalendarDays,
  FileText,
  LayoutGrid,
  RefreshCcw,
  ShieldPlus,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import type { UserRole } from "@/shared/types/auth";

type SidebarProps = {
  fallbackRole: UserRole;
  previewRole?: UserRole;
};

const iconByHref: Record<string, LucideIcon> = {
  "/dashboard": LayoutGrid,
  "/pregnancies": Baby,
  "/children": Baby,
  "/appointments": CalendarDays,
  "/mothers": Users,
  "/visits": Stethoscope,
  "/diagnoses": ShieldPlus,
  "/staff": Users,
  "/reports": FileText,
  "/analytics": BarChart3,
  "/sync": RefreshCcw,
};

export function Sidebar({ fallbackRole, previewRole }: SidebarProps) {
  const { role, roleLabel, navItems } = useRole({ fallbackRole, previewRole });
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[#D6E7E5] bg-[#F5FBFA] lg:flex lg:flex-col">
      <div className="border-b border-[#D6E7E5] px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5B8784]">
          Motherhood Journey
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-[#1D5052]">
          {roleLabel} Portal
        </h2>
        <p className="mt-2 text-sm text-[#54797C]">
          Role-aware navigation for {role.replaceAll("_", " ")} workflows.
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {navItems.map((item) => {
          const Icon = iconByHref[item.href] ?? LayoutGrid;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "h-11 w-full justify-start rounded-2xl px-4",
                isActive
                  ? "bg-[#2C6F73] text-white hover:bg-[#245C60]"
                  : "text-[#24585B] hover:bg-[#E0F0ED] hover:text-[#1D5052]",
              )}
            >
              <Link href={item.href}>
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
