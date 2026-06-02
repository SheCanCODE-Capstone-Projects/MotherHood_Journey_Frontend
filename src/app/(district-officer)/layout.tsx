import type { ReactNode } from "react";

// PortalShell is provided by the root layout — no double-wrapping.
export default function DistrictOfficerLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
