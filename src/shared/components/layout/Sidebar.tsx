"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Baby,
  CalendarDays,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  RefreshCcw,
<<<<<<< HEAD
  ShieldCheck,
=======
>>>>>>> main
  Stethoscope,
  Users,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import type { UserRole } from "@/shared/types/auth";

type SidebarProps = {
  fallbackRole: UserRole;
  previewRole?: UserRole;
};

const iconByHref: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
<<<<<<< HEAD
  "/hw-dashboard": LayoutDashboard,
  "/facility-dashboard": LayoutDashboard,
=======
  "/patient/dashboard": Home,
>>>>>>> main
  "/mothers": Users,
  "/visits": CalendarDays,
  "/diagnoses": Stethoscope,
  "/vaccinations": Baby,
  "/pregnancies": Baby,
  "/patient/pregnancies": FileText,
  "/children": Baby,
<<<<<<< HEAD
  "/my-children": Baby,
  "/appointments": CalendarDays,
  "/schedule": CalendarDays,
=======
  "/patient/children": Users,
  "/appointments": CalendarDays,
  "/patient/appointments": CalendarDays,
  "/patient/chat": MessageCircle,
  "/tips": Lightbulb,
>>>>>>> main
  "/staff": Users,
  "/service-requests": ClipboardList,
  "/reports": FileText,
  "/district-dashboard": LayoutDashboard,
  "/facilities": ClipboardList,
  "/analytics": LayoutDashboard,
<<<<<<< HEAD
  "/national-dashboard": LayoutDashboard,
  "/national-reports": FileText,
  "/sync-log": RefreshCcw,
  "/users": Users,
  "/service-requests": ClipboardList,
  "/consent": ShieldCheck,
  "/documents": FileText,
=======
  "/sync": RefreshCcw,
  "/sync-log": RefreshCcw,
>>>>>>> main
};

const mainNavItems = [
  "/dashboard",
<<<<<<< HEAD
  "/hw-dashboard",
  "/facility-dashboard",
  "/mothers",
  "/visits",
  "/diagnoses",
  "/vaccinations",
  "/pregnancies",
  "/children",
  "/my-children",
  "/appointments",
  "/schedule",
  "/service-requests",
  "/staff",
  "/reports",
  "/district-dashboard",
  "/facilities",
  "/analytics",
  "/national-dashboard",
  "/national-reports",
  "/sync-log",
  "/users",
  "/consent",
  "/documents",
];

export function Sidebar({ fallbackRole, previewRole }: SidebarProps) {
  const { role, roleLabel, organizationName, navItems, displayName } = useRole({
=======
  "/mothers",
  "/children",
  "/visits",
  "/diagnoses",
  "/pregnancies",
  "/appointments",
  "/service-requests",
  "/reports",
  "/analytics",
  "/staff",
  "/sync",
  "/sync-log",
];

export function Sidebar({ fallbackRole, previewRole }: SidebarProps) {
  const { roleLabel, roleTheme, organizationName, navItems, displayName } = useRole({
>>>>>>> main
    fallbackRole,
    previewRole,
  });
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const renderNavItem = (item: { href: string; label: string; shortLabel: string }) => {
    const Icon = iconByHref[item.href] ?? LayoutDashboard;
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Button
        key={item.href}
        asChild
        variant="ghost"
        className={cn(
          "relative h-10 w-full justify-start gap-3 rounded-xl px-3",
          isActive
            ? "bg-[#EAF4F2] text-[#0B5554]"
            : "text-[#6D8587] hover:bg-[#F3F8F7] hover:text-[#0B5554]",
        )}
        style={{ backgroundColor: isActive ? undefined : "transparent" }}
      >
        <Link href={item.href}>
          {isActive && (
            <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#0B5554]" />
          )}
          <Icon className="size-5 shrink-0" />
          <span className="text-sm font-medium">{item.label}</span>
        </Link>
      </Button>
    );
  };

  return (
    <aside
<<<<<<< HEAD
      className="hidden w-72 shrink-0 border-r border-[#163E43] lg:flex lg:flex-col print:hidden"
      style={{ backgroundColor: "#1D5052" }}
=======
      className="hidden w-72 shrink-0 border-r border-[#E4EFED] bg-white lg:flex lg:flex-col print:hidden"
      style={{ borderColor: roleTheme.border }}
>>>>>>> main
    >
      <div className="border-b border-[#E4EFED] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-[8px] bg-[#0B5554] text-sm font-bold text-white">
            MS
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8AA2A4]">
              Maternal
            </p>
            <h2 className="text-lg font-semibold text-[#153F42]">Sanctuary</h2>
          </div>
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#8AA2A4]">
          Workspace
        </p>
<<<<<<< HEAD
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {roleLabel} Portal
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Role-aware navigation for {role.replaceAll("_", " ")} workflows.
=======
        <h3 className="mt-2 text-xl font-semibold text-[#153F42]">
          {roleLabel} Portal
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#6D8587]">
          {organizationName}
>>>>>>> main
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems
          .filter((item) => mainNavItems.includes(item.href))
          .map(renderNavItem)}
      </nav>

      <div className="border-t border-[#E4EFED] p-3">
        <div className="flex items-center gap-3 rounded-[8px] border border-[#E4EFED] bg-[#F8FBFA] p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-[#E1F2EF] text-sm font-semibold text-[#0B5554]">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#153F42]">{displayName}</p>
            <p className="truncate text-[11px] text-[#7B9597]">{roleLabel}</p>
          </div>
          <Button
            variant="ghost"
            className="h-8 w-8 shrink-0 rounded-lg p-0 text-[#7B9597] hover:bg-[#EAF4F2] hover:text-[#0B5554]"
            style={{ backgroundColor: "transparent" }}
            onClick={() => void handleLogout()}
            title="Logout"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
