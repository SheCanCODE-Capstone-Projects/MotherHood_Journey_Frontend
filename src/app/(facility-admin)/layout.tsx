import type { ReactNode } from "react";

import { PortalShell } from "@/shared/components/layout";

export default function FacilityAdminLayout({ children }: { children: ReactNode }) {
  return <PortalShell fallbackRole="facility_admin">{children}</PortalShell>;
}
