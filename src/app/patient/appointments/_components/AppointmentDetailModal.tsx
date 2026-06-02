"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { AppointmentStatusBadge } from "@/shared/components/status";
import { formatAppointmentDate, formatAppointmentTime, canCancelAppointment } from "@/features/appointment/utils";
import type { Appointment } from "@/features/appointment/types";

interface AppointmentDetailModalProps {
  isOpen: boolean;
  appointment: Appointment;
  onClose: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}

/**
 * Appointment Detail Modal
 * Shows full appointment details with cancel option for future appointments
 */
export function AppointmentDetailModal({
  isOpen,
  appointment,
  onClose,
  onCancel,
  isCancelling,
}: AppointmentDetailModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const canBeCancelled = canCancelAppointment(appointment);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md space-y-6 rounded-3xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Facility Name */}
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Facility
            </p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900">
              {appointment.facilityName}
            </h3>
          </div>

          {/* Appointment Type */}
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Service
            </p>
            <p className="mt-1 text-gray-900">{appointment.appointmentTypeLabel}</p>
          </div>

          {/* Status */}
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Status
            </p>
            <div className="mt-2">
              <AppointmentStatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <Calendar className="h-4 w-4" />
                Date
              </p>
              <p className="mt-2 font-medium text-gray-900">
                {formatAppointmentDate(appointment.scheduledDate)}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                <Clock className="h-4 w-4" />
                Time
              </p>
              <p className="mt-2 font-medium text-gray-900">
                {formatAppointmentTime(appointment.scheduledTime)}
              </p>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Notes
              </p>
              <p className="mt-2 text-gray-700">{appointment.notes}</p>
            </div>
          )}

          {/* Cancel Confirmation Dialog */}
          {showCancelConfirm && (
            <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-semibold text-amber-900">
                    Cancel this appointment?
                  </h4>
                  <p className="mt-1 text-sm text-amber-800">
                    This action cannot be undone. You can request a new appointment later.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={isCancelling}
                >
                  Keep Appointment
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={onCancel}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancel"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-300"
            onClick={onClose}
            disabled={isCancelling || showCancelConfirm}
          >
            Close
          </Button>
          {canBeCancelled && !showCancelConfirm && (
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setShowCancelConfirm(true)}
              disabled={isCancelling}
            >
              Cancel Appointment
            </Button>
          )}
        </div>

        {/* Info Text */}
        {!canBeCancelled && (
          <p className="text-xs text-gray-500">
            {appointment.status === "SCHEDULED"
              ? "Past appointments cannot be cancelled"
              : `${appointment.status} appointments cannot be cancelled`}
          </p>
        )}
      </div>
    </div>
  );
}
