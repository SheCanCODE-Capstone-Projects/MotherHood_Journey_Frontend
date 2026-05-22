import React from 'react';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

type ServiceRequestStatus = 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'IREMBO_SUBMITTED' 
  | 'COMPLETED'
  | 'REJECTED';

interface ServiceRequestDTO {
  id: string;
  status: ServiceRequestStatus;
  createdAt: string;
  reviewedAt?: string;
  approvedAt?: string;
  submittedAt?: string;
  completedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface ServiceRequestTrackerProps {
  serviceRequest: ServiceRequestDTO;
}

const STEPS = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'IREMBO_SUBMITTED', label: 'Irembo Submitted' },
  { key: 'COMPLETED', label: 'Completed' },
] as const;

export function ServiceRequestTracker({ serviceRequest }: ServiceRequestTrackerProps) {
  const currentStepIndex = STEPS.findIndex(step => step.key === serviceRequest.status);
  const isRejected = serviceRequest.status === 'REJECTED';

  const getStepDate = (stepKey: string): string | undefined => {
    switch (stepKey) {
      case 'PENDING':
        return serviceRequest.createdAt;
      case 'UNDER_REVIEW':
        return serviceRequest.reviewedAt;
      case 'APPROVED':
        return serviceRequest.approvedAt;
      case 'IREMBO_SUBMITTED':
        return serviceRequest.submittedAt;
      case 'COMPLETED':
        return serviceRequest.completedAt;
      default:
        return undefined;
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStepStatus = (index: number): 'completed' | 'current' | 'pending' => {
    if (isRejected) return 'pending';
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const status = getStepStatus(index);
          const stepDate = getStepDate(step.key);
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                {/* Step Icon */}
                <div className="relative">
                  {status === 'completed' ? (
                    <CheckCircle2 className="w-8 h-8 text-teal-600" />
                  ) : status === 'current' ? (
                    <div className="w-8 h-8 rounded-full border-4 border-teal-600 bg-white flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-teal-600" />
                    </div>
                  ) : (
                    <Circle className="w-8 h-8 text-gray-300" />
                  )}
                </div>

                {/* Step Label */}
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    status === 'completed' || status === 'current' 
                      ? 'text-gray-900' 
                      : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {stepDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(stepDate)}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-2 mb-8 ${
                  status === 'completed' ? 'bg-teal-600' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Rejected Status Callout */}
      {isRejected && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-900">Request Rejected</p>
              {serviceRequest.rejectionReason && (
                <p className="text-sm text-red-700 mt-1">
                  {serviceRequest.rejectionReason}
                </p>
              )}
              {serviceRequest.rejectedAt && (
                <p className="text-xs text-red-600 mt-2">
                  Rejected on {formatDate(serviceRequest.rejectedAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
