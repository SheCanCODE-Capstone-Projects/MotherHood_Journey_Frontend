import type { ReactNode } from "react";

// PortalShell is provided by the root layout — no double-wrapping.
export default function FacilityAdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
