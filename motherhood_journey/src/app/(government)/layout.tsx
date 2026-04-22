import type { ReactNode } from "react";

import { PortalShell } from "@/shared/components/layout";

type GovernmentLayoutProps = {
  children: ReactNode;
};

export default function GovernmentLayout({
  children,
}: GovernmentLayoutProps) {
  return <PortalShell fallbackRole="government">{children}</PortalShell>;
}
