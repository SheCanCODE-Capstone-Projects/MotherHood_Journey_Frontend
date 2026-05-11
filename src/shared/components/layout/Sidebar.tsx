"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Baby,
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import type { UserRole } from "@/shared/types/auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ROLE_NAV_ITEMS } from "@/shared/config/rbac";

type SidebarProps = {
  fallbackRole: UserRole;
  previewRole?: UserRole;
};

const iconByHref: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/mothers": Users,
  "/visits": CalendarDays,
  "/diagnoses": Stethoscope,
  "/pregnancies": Baby,
  "/children": Baby,
  "/appointments": CalendarDays,
  "/staff": Users,
  "/reports": FileText,
  "/analytics": LayoutDashboard,
  "/sync": LayoutDashboard,
};

const mainNavItems = ["/dashboard", "/mothers", "/visits", "/diagnoses", "/pregnancies", "/children", "/appointments", "/reports", "/analytics", "/staff", "/sync"];

const roleTheme = { text: '#085041', border: '#5DCAA5' };

export function Sidebar({ fallbackRole, previewRole }: SidebarProps) {
  const { role, roleLabel, organizationName, navItems, displayName } = useRole({
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
          "h-10 w-full justify-start gap-3 rounded-xl px-3",
          isActive
            ? "bg-[#5DCAA5]/20 text-white"
            : "text-white/60 hover:bg-white/10 hover:text-white",
        )}
        style={{ backgroundColor: isActive ? undefined : "transparent" }}
      >
        <Link href={item.href}>
          {isActive && (
            <div className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#5DCAA5]" />
          )}
          <Icon className="size-5 shrink-0" />
          <span className="text-sm font-medium">{item.label}</span>
        </Link>
      </Button>
    );
  };

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

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        {navItems
          .filter((item) => mainNavItems.includes(item.href))
          .map(renderNavItem)}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#5DCAA5] font-semibold text-[#085041] text-sm">
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="truncate text-[11px] text-white/50">{roleLabel}</p>
          </div>
          <Button
            variant="ghost"
            className="h-8 w-8 shrink-0 rounded-lg p-0 text-white/50 hover:bg-white/10 hover:text-white"
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
