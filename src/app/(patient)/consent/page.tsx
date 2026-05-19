"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { PageHeader } from "@/shared/components/layout";
import { getAllConsents, grantConsent, revokeConsent, type ConsentRecord, type ConsentType } from "@/lib/api/consent";
import { AlertTriangle, CheckCircle, XCircle, Calendar, Scale } from "lucide-react";

const CONSENT_TYPES: { type: ConsentType; title: string; description: string }[] = [
  {
    type: "GOV_DATA_SHARE",
    title: "Government Data Sharing",
    description: "Allow your health data to be shared with government health systems for coordinated care and public health monitoring."
  },
  {
    type: "SMS_REMINDERS",
    title: "SMS Reminders",
    description: "Receive automated SMS reminders for upcoming appointments, medication schedules, and important health check-ups."
  },
  {
    type: "RESEARCH_PARTICIPATION",
    title: "Research Participation",
    description: "Contribute your anonymized health data to medical research studies that help improve maternal and child healthcare."
  },
  {
    type: "FACILITY_TRANSFER",
    title: "Facility Transfer",
    description: "Allow your medical records to be transferred between healthcare facilities when needed for your care."
  }
];

export default function PatientConsentPage() {
  const [warningDialog, setWarningDialog] = useState<{
    isOpen: boolean;
    consent: ConsentRecord | null;
  }>({ isOpen: false, consent: null });

  const queryClient = useQueryClient();

  // Assume patient ID is 1 for demo purposes
  const patientId = "1";

  // Fetch all consents
  const { data: consents = [], isLoading } = useQuery({
    queryKey: ["consents", patientId],
    queryFn: () => getAllConsents(patientId),
  });

  // Mutation for granting consent
  const grantMutation = useMutation({
    mutationFn: (consentType: ConsentType) =>
      grantConsent(patientId, {
        consentType,
        grantedDate: new Date().toISOString(),
        // Set expiry date 2 years from now for GOV_DATA_SHARE and FACILITY_TRANSFER
        expiryDate: (consentType === "GOV_DATA_SHARE" || consentType === "FACILITY_TRANSFER")
          ? new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consents"] });
    },
  });

  // Mutation for revoking consent
  const revokeMutation = useMutation({
    mutationFn: (consentId: string) => revokeConsent(consentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consents"] });
      setWarningDialog({ isOpen: false, consent: null });
    },
  });

  const getConsentByType = (type: ConsentType): ConsentRecord | undefined => {
    return consents.find((c) => c.consentType === type);
  };

  const handleToggle = (consentType: ConsentType) => {
    const existingConsent = getConsentByType(consentType);

    if (!existingConsent || existingConsent.status === "REVOKED") {
      // Grant consent
      grantMutation.mutate(consentType);
    } else {
      // Revoke consent
      if (consentType === "GOV_DATA_SHARE") {
        // Show warning dialog for GOV_DATA_SHARE
        setWarningDialog({ isOpen: true, consent: existingConsent });
      } else {
        revokeMutation.mutate(existingConsent.id);
      }
    }
  };

  const handleConfirmRevoke = () => {
    if (warningDialog.consent) {
      revokeMutation.mutate(warningDialog.consent.id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Consent Management"
        subtitle="Manage your data sharing preferences and consents."
      />

      {/* Consent Cards Grid */}
      <section className="grid gap-6 md:grid-cols-2">
        {CONSENT_TYPES.map((consentType) => {
          const consent = getConsentByType(consentType.type);
          const isGranted = consent?.status === "GRANTED";

          return (
            <ConsentCard
              key={consentType.type}
              title={consentType.title}
              description={consentType.description}
              isGranted={isGranted}
              grantedDate={consent?.grantedDate}
              expiryDate={consent?.expiryDate}
              legalBasis={consent?.legalBasis}
              isLoading={isLoading || grantMutation.isPending || revokeMutation.isPending}
              onToggle={() => handleToggle(consentType.type)}
              formatDate={formatDate}
            />
          );
        })}
      </section>

      {/* Warning Dialog for GOV_DATA_SHARE Revocation */}
      {warningDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-3xl border border-[#D5E9E6] bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#1D5052]">
                Warning: Revoke Government Data Sharing
              </h3>
            </div>

            <p className="mb-6 text-sm text-[#54797C]">
              Revoking government data sharing consent may impact your ability to receive
              coordinated healthcare services across different facilities. This action will
              prevent your health data from being shared with government health systems.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setWarningDialog({ isOpen: false, consent: null })}
                className="flex-1 rounded-lg border border-[#D5E9E6] bg-white px-4 py-2 text-sm font-medium text-[#1D5052] hover:bg-[#F8FCFB]"
                disabled={revokeMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                disabled={revokeMutation.isPending}
              >
                {revokeMutation.isPending ? "Revoking..." : "Revoke Consent"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ConsentCardProps {
  title: string;
  description: string;
  isGranted: boolean;
  grantedDate?: string;
  expiryDate?: string;
  legalBasis?: string;
  isLoading: boolean;
  onToggle: () => void;
  formatDate: (date: string) => string;
}

function ConsentCard({
  title,
  description,
  isGranted,
  grantedDate,
  expiryDate,
  legalBasis,
  isLoading,
  onToggle,
  formatDate,
}: ConsentCardProps) {
  return (
    <article
      className={`rounded-3xl border p-5 transition-all duration-200 ${
        isGranted
          ? "border-[#1D5052] bg-[#F8FCFB]"
          : "border-[#D5E9E6] bg-white"
      }`}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#1D5052]">{title}</h3>
          <p className="mt-1 text-sm text-[#54797C]">{description}</p>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onToggle}
          disabled={isLoading}
          className={`relative ml-4 h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#1D5052] focus:ring-offset-2 ${
            isGranted ? "bg-[#1D5052]" : "bg-gray-300"
          }`}
          role="switch"
          aria-checked={isGranted}
          aria-label={`Toggle ${title}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isGranted ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-4 flex items-center gap-2">
        {isGranted ? (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3 w-3" />
            GRANTED
          </span>
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            <XCircle className="h-3 w-3" />
            REVOKED
          </span>
        )}
      </div>

      {/* Details */}
      {grantedDate && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#54797C]">
            <Calendar className="h-3 w-3" />
            <span>Granted: {formatDate(grantedDate)}</span>
          </div>

          {expiryDate && (
            <div className="flex items-center gap-2 text-xs text-[#54797C]">
              <Calendar className="h-3 w-3" />
              <span>Expires: {formatDate(expiryDate)}</span>
            </div>
          )}

          {legalBasis && (
            <div className="flex items-center gap-2 text-xs text-[#54797C]">
              <Scale className="h-3 w-3" />
              <span>{legalBasis}</span>
            </div>
          )}
        </div>
      )}
    </article>
  );
}