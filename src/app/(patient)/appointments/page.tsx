"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { PageHeader } from "@/shared/components/layout";
import { Button } from "@/shared/components/ui/button";
import { AppointmentStatusBadge } from "@/shared/components/status";
import { useAllAppointments, useCancelAppointment } from "@/features/appointment/hooks";
import { formatAppointmentDate, formatAppointmentTime, getRelativeTime } from "@/features/appointment/utils";
import type { Appointment } from "@/features/appointment/types";

import { AppointmentDetailModal } from "./_components/AppointmentDetailModal";

/**
 * Patient Appointments Page
 * Lists all appointments in chronological order with future/past separation
 */
export default function PatientAppointmentsPage() {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { futureAppointments, pastAppointments, isLoading, error } = useAllAppointments();
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();

  // Handle appointment selection
  const handleSelectAppointment = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  }, []);

  // Handle cancel appointment
  const handleCancelAppointment = useCallback(
    (appointmentId: string) => {
      cancelAppointment({
        appointmentId,
        request: {
          reason: "Patient requested cancellation",
        },
      });
      setShowDetailModal(false);
    },
    [cancelAppointment]
  );

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Appointments"
          subtitle="Manage your upcoming visits and review past appointments."
        />
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-5 w-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Failed to load appointments</h3>
              <p className="mt-1 text-sm text-red-700">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Appointments"
        subtitle="Manage your upcoming visits and review past appointments."
      />

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border border-gray-200 bg-white py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600">Loading appointments...</span>
        </div>
      ) : futureAppointments.length === 0 && pastAppointments.length === 0 ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No appointments yet</h3>
          <p className="mt-2 text-gray-600">
            Schedule your first appointment to get started.
          </p>
          <Link href="/appointments/request">
            <Button className="mt-4">Request Appointment</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Future Appointments Section */}
          {futureAppointments.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
              <div className="space-y-3">
                {futureAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onClick={() => handleSelectAppointment(appointment)}
                    isPast={false}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Past Appointments Section */}
          {pastAppointments.length > 0 && (
            <section className="space-y-4 border-t border-gray-200 pt-8">
              <h2 className="text-xl font-semibold text-gray-900">Past Appointments</h2>
              <div className="space-y-3">
                {pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onClick={() => handleSelectAppointment(appointment)}
                    isPast={true}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* Floating Action Button for New Appointment Request */}
      <div className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8">
        <Link href="/appointments/request">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Request new appointment</span>
          </Button>
        </Link>
      </div>

      {/* Detail Modal */}
      {selectedAppointment && (
        <AppointmentDetailModal
          isOpen={showDetailModal}
          appointment={selectedAppointment}
          onClose={() => setShowDetailModal(false)}
          onCancel={() => handleCancelAppointment(selectedAppointment.id)}
          isCancelling={isCancelling}
        />
      )}
    </div>
  );
}

/**
 * Appointment Card Component
 * Displays appointment summary (future: interactive, past: view-only)
 */
function AppointmentCard({
  appointment,
  onClick,
  isPast,
}: {
  appointment: Appointment;
  onClick: () => void;
  isPast: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md ${
        isPast ? "cursor-default hover:border-gray-200 hover:shadow-sm" : "cursor-pointer"
      }`}
      disabled={isPast}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Facility Name and Type */}
          <div>
            <h3 className="font-semibold text-gray-900">{appointment.facilityName}</h3>
            <p className="text-sm text-gray-600">{appointment.appointmentTypeLabel}</p>
          </div>

          {/* Date and Time */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{formatAppointmentDate(appointment.scheduledDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{formatAppointmentTime(appointment.scheduledTime)}</span>
            </div>
          </div>

          {/* Relative Time for Future Appointments */}
          {!isPast && (
            <p className="text-xs text-blue-600 font-medium">
              {getRelativeTime(appointment.scheduledDate, appointment.scheduledTime)}
            </p>
          )}
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          <AppointmentStatusBadge status={appointment.status} />
        </div>
      </div>

      {/* Notes if available */}
      {appointment.notes && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-600 line-clamp-2">{appointment.notes}</p>
        </div>
      )}
    </button>
  );
}
