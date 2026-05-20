"use client";

import { Bell, Building2, LogOut, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";
import { useRole } from "@/shared/hooks/useRole";
import type { UserRole } from "@/shared/types/auth";
import { ROLE_NAV_ITEMS } from "@/shared/config/rbac";

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
    } else if (segment.match(/^[a-zA-Z0-9-]+$/)) {
      breadcrumbs.push(segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "));
    }
  }

  return breadcrumbs.join(" / ");
}

export function TopBar({ fallbackRole, previewRole }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    organizationName,
    logout,
    roleTheme,
    displayName,
    roleLabel,
  } = useRole({ fallbackRole, previewRole });

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    router.push("/login");
  };

  const breadcrumb = getBreadcrumb(pathname);
  const topLinks = ["Home", "My Records", "Care", "Chat"];

  return (
    <header className="sticky top-0 z-20 border-b border-[#E4EFED] bg-white px-4 py-3 print:hidden sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-[8px] font-semibold text-white"
            style={{ backgroundColor: roleTheme.accent }}
          >
            {displayName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#153F42]">{breadcrumb || roleLabel}</p>
            <p className="truncate text-xs text-[#6D8587]">{displayName}</p>
          </div>
        </div>

        <nav className="hidden items-center gap-1 rounded-[8px] bg-[#F7FBFA] p-1 lg:flex">
          {topLinks.map((item, index) => (
            <span
              key={item}
              className={`rounded-[7px] px-3 py-1.5 text-xs font-semibold ${
                index === 0 ? "bg-white text-[#0B5554] shadow-sm" : "text-[#6D8587]"
              }`}
            >
              {item}
            </span>
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 justify-center px-4 md:flex">
          <div className="flex h-9 w-full max-w-xs items-center gap-2 rounded-[8px] border border-[#E4EFED] bg-[#F7FBFA] px-3 text-sm text-[#6A898B]">
            <Search className="size-4" />
            <span>Search records</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-[8px] border border-[#E4EFED] bg-white px-3 py-2 text-xs font-medium text-[#315F62] xl:flex">
            <Building2 className="size-3.5 text-[#648386]" />
            <span>{organizationName}</span>
          </div>

          <Button
            variant="outline"
            className="size-9 rounded-[8px] border border-[#E4EFED] bg-white p-0"
            title="Notifications"
          >
            <Bell className="size-4 text-[#315F62]" />
          </Button>

          <Button
            variant="outline"
            className="size-9 rounded-[8px] border border-[#E4EFED] bg-white p-0"
            onClick={() => void handleLogout()}
            title="Logout"
          >
            <LogOut className="size-4 text-[#315F62]" />
          </Button>
        </div>
      </div>
    </header>
  );
}
