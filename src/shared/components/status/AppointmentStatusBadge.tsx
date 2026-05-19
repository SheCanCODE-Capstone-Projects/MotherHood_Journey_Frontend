"use client";

import type { AppointmentStatus } from "@/features/appointment/types";
import { APPOINTMENT_STATUS_CONFIG } from "@/features/appointment/constants";
import { cn } from "@/shared/lib/utils";

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
  showIcon?: boolean;
}

/**
 * Appointment Status Badge Component
 * Displays appointment status with color-coded styling
 */
export function AppointmentStatusBadge({
  status,
  className,
  showIcon = true,
}: AppointmentStatusBadgeProps) {
  const config = APPOINTMENT_STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {showIcon && <span className="text-xs">{config.icon}</span>}
      <span>{config.label}</span>
    </div>
  );
}

/**
 * Appointment Status Pill Component
 * Compact version for lists
 */
export function AppointmentStatusPill({
  status,
  className,
}: {
  status: AppointmentStatus;
  className?: string;
}) {
  const config = APPOINTMENT_STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
        config.bgColor,
        config.textColor,
        className
      )}
    >
      {config.label}
    </span>
  );
}
