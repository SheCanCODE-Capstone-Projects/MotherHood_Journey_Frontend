"use client";

import { Bell, Building2, LogOut, Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Button } from "@/shared/components/ui/button";
import LanguageSwitcher from "@/shared/components/ui/LanguageSwitcher";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { ROLE_NAV_ITEMS } from "@/shared/config/rbac";
import { useRole } from "@/shared/hooks/useRole";
import type { UserRole } from "@/shared/types/auth";

type TopBarProps = {
  fallbackRole: UserRole;
  previewRole?: UserRole;
};

function getBreadcrumb(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: string[] = [];

  for (const segment of segments) {
    const matchedItem = Object.values(ROLE_NAV_ITEMS)
      .flat()
      .find((item) => item.href === `/${segment}` || item.href.includes(segment));

    if (matchedItem) {
      breadcrumbs.push(matchedItem.label);
    } else if (/^[a-zA-Z0-9-]+$/.test(segment)) {
      breadcrumbs.push(
        segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
      );
    }
  }

  return breadcrumbs.join(" / ");
}

export function TopBar({ fallbackRole, previewRole }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { organizationName, roleTheme, displayName, roleLabel } = useRole({
    fallbackRole,
    previewRole,
  });

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-[#E4EFED] bg-white/95 px-3 py-0 backdrop-blur print:hidden sm:px-4">
      <div className="flex h-14 items-center gap-3">

        {/* Desktop sidebar toggle — only visible lg+ */}
        <SidebarTrigger className="hidden size-9 shrink-0 rounded-lg border border-[#E4EFED] bg-white text-[#6D8587] hover:bg-[#F4F8F7] hover:text-[#0B5554] lg:inline-flex" />

        {/* Breadcrumb / page title */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[#163F42]">
              {breadcrumb || roleLabel}
            </p>
            <p className="truncate text-[12px] text-[#6D8587] hidden sm:block">
              {organizationName}
            </p>
          </div>
        </div>

        {/* Search — hidden on mobile */}
        <div className="hidden max-w-[220px] flex-1 lg:flex xl:max-w-xs">
          <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-[#E4EFED] bg-[#F7FBFA] px-3 text-[13px] text-[#6A898B] transition-colors focus-within:border-[#B0D4D1] focus-within:bg-white">
            <Search className="size-3.5 shrink-0" />
            <span className="text-[13px]">Search records…</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Language — hidden on mobile, text-only compact version */}
          <div className="hidden sm:block">
            <LanguageSwitcher variant="minimal" />
          </div>

          {/* Org chip — desktop only */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-[#E4EFED] bg-white px-2.5 py-1.5 xl:flex">
            <Building2 className="size-3 text-[#6D8587]" />
            <span className="text-[12px] font-medium text-[#163F42] max-w-[120px] truncate">
              {organizationName}
            </span>
          </div>

          {/* Notifications */}
          <Button
            variant="outline"
            className="size-9 rounded-lg border-[#E4EFED] bg-white p-0 text-[#6D8587] hover:bg-[#F4F8F7] hover:text-[#0B5554]"
            title="Notifications"
          >
            <Bell className="size-4" />
          </Button>

          {/* User avatar + sign-out — mobile only (desktop uses sidebar) */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <div
              className="grid size-8 shrink-0 place-items-center rounded-lg text-[12px] font-bold text-white"
              style={{ backgroundColor: roleTheme.accent }}
            >
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            <Button
              variant="outline"
              className="size-9 rounded-lg border-[#E4EFED] bg-white p-0 text-[#6D8587] hover:bg-[#F4F8F7] hover:text-red-500"
              onClick={() => void handleLogout()}
              title="Sign out"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
