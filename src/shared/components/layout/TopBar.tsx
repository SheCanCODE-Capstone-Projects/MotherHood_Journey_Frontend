"use client";

import { Bell, Building2, LogOut } from "lucide-react";
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

  return breadcrumbs.join(" > ");
}

export function TopBar({ fallbackRole, previewRole }: TopBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    organizationName,
    logout,
  } = useRole({ fallbackRole, previewRole });

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    router.push("/login");
  };

  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#e5e7eb] bg-white px-4 sm:px-6">
      <div className="min-w-0 text-sm font-medium text-gray-700">
        {breadcrumb || "Dashboard"}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700">
          <Building2 className="size-3.5 text-gray-500" />
          <span>{organizationName}</span>
        </div>

        <Button
          variant="outline"
          className="size-8 rounded-lg border border-gray-200 p-0"
          title="Notifications"
        >
          <Bell className="size-4 text-gray-600" />
        </Button>

        <Button
          variant="outline"
          className="size-8 rounded-lg border border-gray-200 p-0"
          onClick={() => void handleLogout()}
          title="Logout"
        >
          <LogOut className="size-4 text-gray-600" />
        </Button>
      </div>
    </header>
  );
}
