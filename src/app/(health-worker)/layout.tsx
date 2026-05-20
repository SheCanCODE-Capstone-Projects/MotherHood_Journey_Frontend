import type { ReactNode } from "react";

import { PortalShell } from "@/shared/components/layout";

type HealthWorkerLayoutProps = {
  children: ReactNode;
};

export default function HealthWorkerLayout({
  children,
}: HealthWorkerLayoutProps) {
  return <PortalShell fallbackRole="health_worker">{children}</PortalShell>;
}
