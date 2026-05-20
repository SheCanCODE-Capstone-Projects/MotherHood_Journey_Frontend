import type { ReactNode } from "react";

import { PortalShell } from "@/shared/components/layout";

type FacilityAdminLayoutProps = {
  children: ReactNode;
};

export default function FacilityAdminLayout({
  children,
}: FacilityAdminLayoutProps) {
  return <PortalShell fallbackRole="facility_admin">{children}</PortalShell>;
}
