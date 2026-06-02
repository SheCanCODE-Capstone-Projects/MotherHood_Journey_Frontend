"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Baby, CalendarDays, ClipboardList, FileText,
  LayoutDashboard, LogOut, MessageCircle, RefreshCcw,
  Stethoscope, Users, Lightbulb, type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useRole } from "@/shared/hooks/useRole";
import { cn } from "@/shared/lib/utils";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
import type { UserRole } from "@/shared/types/auth";

const ICON_MAP: Record<string, LucideIcon> = {
  "/dashboard":            LayoutDashboard,
  "/patient/dashboard":    LayoutDashboard,
  "/mothers":              Users,
  "/visits":               CalendarDays,
  "/diagnoses":            Stethoscope,
  "/vaccinations":         Baby,
  "/pregnancies":          Baby,
  "/patient/pregnancies":  FileText,
  "/children":             Baby,
  "/patient/children":     Users,
  "/appointments":         CalendarDays,
  "/patient/appointments": CalendarDays,
  "/patient/chat":         MessageCircle,
  "/tips":                 Lightbulb,
  "/staff":                Users,
  "/service-requests":     ClipboardList,
  "/reports":              FileText,
  "/district-dashboard":   LayoutDashboard,
  "/facilities":           ClipboardList,
  "/analytics":            LayoutDashboard,
  "/sync":                 RefreshCcw,
  "/sync-log":             RefreshCcw,
  "/users":                Users,
};

type Props = {
  fallbackRole: UserRole;
  previewRole?: UserRole;
};

export function AppSidebar({ fallbackRole, previewRole }: Props) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { roleLabel, roleTheme, navItems, displayName, organizationName } =
    useRole({ fallbackRole, previewRole });
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="hidden border-r bg-white lg:flex print:hidden"
      style={{ borderColor: roleTheme.border }}
    >
      {/* ── Brand header ─────────────────────────────────── */}
      <SidebarHeader
        className="border-b px-4 pt-5 pb-4"
        style={{ borderColor: roleTheme.border }}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-[10px] text-sm font-bold text-white shadow-sm"
            style={{ backgroundColor: roleTheme.accent }}
          >
            MS
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8AA2A4]">
                Maternal
              </p>
              <h2 className="text-[15px] font-bold leading-none text-[#163F42]">
                Sanctuary
              </h2>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8AA2A4]">
              {roleLabel} Portal
            </p>
            <p className="mt-0.5 truncate text-[13px] font-medium text-[#6D8587]">
              {organizationName}
            </p>
          </div>
        )}
      </SidebarHeader>

      {/* ── Navigation ───────────────────────────────────── */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8AA2A4]">
              Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => {
                const Icon = ICON_MAP[item.href] ?? LayoutDashboard;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "h-10 rounded-xl text-[13px] font-semibold transition-all",
                        isActive
                          ? "text-[#0B5554]"
                          : "text-[#6D8587] hover:text-[#0B5554]",
                      )}
                      style={{
                        backgroundColor: isActive
                          ? roleTheme.accentSoft
                          : undefined,
                      }}
                    >
                      <Link href={item.href}>
                        <Icon className="size-[18px] shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ───────────────────────────────────────── */}
      <SidebarFooter
        className="border-t p-3 space-y-2"
        style={{ borderColor: roleTheme.border }}
      >
        {/* Language switcher — only when expanded */}
        {!isCollapsed && (
          <div className="flex justify-center">
            <LanguageSwitcher variant="minimal" />
          </div>
        )}

        {/* User card */}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-xl border bg-[#F8FBFA] p-2.5",
            isCollapsed && "justify-center",
          )}
          style={{ borderColor: roleTheme.border }}
        >
          <div
            className="grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-bold text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            {displayName.slice(0, 1).toUpperCase()}
          </div>

          {!isCollapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#163F42]">
                  {displayName}
                </p>
                <p className="text-[11px] text-[#8AA2A4]">{roleLabel}</p>
              </div>
              <button
                onClick={() => void handleLogout()}
                title="Sign out"
                className="rounded-lg p-1.5 text-[#8AA2A4] transition-colors hover:bg-[#EAF4F2] hover:text-[#0B5554]"
              >
                <LogOut className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
