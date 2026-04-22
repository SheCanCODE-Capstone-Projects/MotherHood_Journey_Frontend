import type { ReactNode } from "react";

import { PortalShell } from "@/shared/components/layout";

type DistrictOfficerLayoutProps = {
  children: ReactNode;
};

export default function DistrictOfficerLayout({
  children,
}: DistrictOfficerLayoutProps) {
  return <PortalShell fallbackRole="district_officer">{children}</PortalShell>;
}
