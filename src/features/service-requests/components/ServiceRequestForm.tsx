"use client";

import { useState } from "react";
import { ServiceTypeId, DocKey, UploadedFiles } from "@/features/service-requests/types";
import Stepper from "./Stepper";
import Step1ServiceType from "./Step1ServiceType";
import Step2UploadDocs from "./Step2UploadDocs";
import Step3ReviewSubmit from "./Step3ReviewSubmit";
import SuccessScreen from "./SuccessScreen";
import {
  submitServiceRequest,
  uploadServiceRequestDocument,
} from "@/lib/api/ServiceRequests";
import {
  validateFileSize,
  validateFileMimeType,
  computeSHA256,
} from "@/features/service-requests/utils/fileValidation";

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
      // 1. Create the service request
      const result = await submitServiceRequest({
        serviceType: selectedService!,
        files: uploadedFiles,
      });

      // 2. Validate & upload each file in parallel
      if (Object.keys(uploadedFiles).length > 0) {
        const uploads = Object.entries(uploadedFiles).map(
          async ([docKey, file]) => {
            const sizeCheck = validateFileSize(file);
            if (!sizeCheck.valid) throw new Error(sizeCheck.error);

            const mimeCheck = await validateFileMimeType(file);
            if (!mimeCheck.valid) throw new Error(mimeCheck.error);

            const hash = await computeSHA256(file);
            await uploadServiceRequestDocument(
              result.requestId,
              docKey,
              file,
              hash,
            );
          },
        );
        await Promise.all(uploads);
      }

      setRefNum(result.referenceNumber);
      setStep(4);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong while submitting your request. Please try again.",
      );
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
          requestId={selectedService ?? ""}
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