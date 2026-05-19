"use client";

import { useState } from "react";
import { ServiceTypeId, DocKey, UploadedFiles } from "@/features/service-requests/types";
import Stepper from "./Stepper";
import Step1ServiceType from "./Step1ServiceType";
import Step2UploadDocs from "./Step2UploadDocs";
import Step3ReviewSubmit from "./Step3ReviewSubmit";
import SuccessScreen from "./SuccessScreen";
import { submitServiceRequest } from "@/lib/api/ServiceRequests";

const REQUEST_ID = "SR-2024-0892";

export default function ServiceRequestForm() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceTypeId | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles>({});
  const [refNum, setRefNum] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleFile(docKey: DocKey, file: File) {
    setUploadedFiles((prev) => ({ ...prev, [docKey]: file }));
  }

  function handleRemove(docKey: string) {
    setUploadedFiles((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitServiceRequest({
        serviceType: selectedService!,
        files: uploadedFiles,
      });
      setRefNum(result.referenceNumber);
      setStep(4);
    } catch (error) {
      setSubmitError("Something went wrong while submitting your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1);
    setSelectedService(null);
    setUploadedFiles({});
    setRefNum(null);
    setSubmitError(null);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 lg:p-8">
      {step > 1 && step < 4 && <Stepper step={step} />}

      {step === 1 && (
        <Step1ServiceType
          selected={selectedService}
          onSelect={setSelectedService}
          onNext={() => setStep(2)}
          onCancel={reset}
        />
      )}

      {step === 2 && selectedService && (
        <Step2UploadDocs
          service={selectedService}
          files={uploadedFiles}
          onFile={handleFile}
          onRemove={handleRemove}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
          requestId={REQUEST_ID}
        />
      )}

      {step === 3 && selectedService && (
        <Step3ReviewSubmit
          service={selectedService}
          files={uploadedFiles}
          onBack={() => setStep(2)}
          onSubmit={handleSubmit}
          submitting={submitting}
          error={submitError}
        />
      )}

      {step === 4 && refNum && (
        <SuccessScreen refNum={refNum} onAnother={reset} />
      )}
    </div>
  );
}