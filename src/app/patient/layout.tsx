import type { ReactNode } from "react";

import { PortalShell } from "@/shared/components/layout";

type PatientLayoutProps = {
  children: ReactNode;
};

export default function PatientLayout({ children }: PatientLayoutProps) {
  return <PortalShell fallbackRole="patient">{children}</PortalShell>;
}
