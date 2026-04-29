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
  const { role, roleLabel, navItems, roleTheme } = useRole({
    fallbackRole,
    previewRole,
  });
  const pathname = usePathname();

  return (
    <aside
      className="hidden w-72 shrink-0 border-r bg-[#F5FBFA] lg:flex lg:flex-col print:hidden"
      style={{ borderColor: roleTheme.border }}
    >
      <div className="border-b px-6 py-6" style={{ borderColor: roleTheme.border }}>
        <p className="text-xs font-semibold uppercase tracking-[0.24em]" style={{ color: roleTheme.text }}>
          Motherhood Journey
        </p>
        <h2 className="mt-2 text-2xl font-semibold" style={{ color: roleTheme.text }}>
          {roleLabel} Portal
        </h2>
        <p className="mt-2 text-sm" style={{ color: roleTheme.text }}>
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
                  ? "text-white"
                  : "hover:text-[#1D5052]",
              )}
              style={
                isActive
                  ? { backgroundColor: roleTheme.accent }
                  : { color: roleTheme.text, backgroundColor: "transparent" }
              }
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
