"use client";

import { ServiceTypeId, UploadedFiles } from "@/features/service-requests/types";
import { SERVICE_TYPES } from "@/features/service-requests/constants";

interface Step3ReviewSubmitProps {
  service: ServiceTypeId;
  files: UploadedFiles;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string | null;
}

export default function Step3ReviewSubmit({
  service,
  files,
  onBack,
  onSubmit,
  submitting,
  error,
}: Step3ReviewSubmitProps) {
  const svc = SERVICE_TYPES.find((s) => s.id === service)!;

  return (
    <div>
      <div className="text-xs text-gray-400 mb-1">Service Requests &rsaquo; New Request</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Review &amp; Submit Request</h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-teal-700">
              <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Request Summary
          </div>
          <button className="flex items-center gap-1 text-sm text-teal-700 font-medium hover:underline">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-3.5 h-3.5">
              <path d="M11 2l3 3-8 8H3v-3l8-8z" />
            </svg>
            Edit All
          </button>
        </div>

        <div className="p-5 grid sm:grid-cols-2 gap-5">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
              Service Type
            </div>
            <div className="bg-teal-50 text-teal-800 font-semibold text-sm px-3 py-2 rounded-lg inline-block">
              {svc.label}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
              Request Priority
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 rounded-full bg-teal-600 inline-block" />
              Standard Processing (3–5 Days)
            </div>
          </div>
          <div className="sm:col-span-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Attached Documents
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {Object.entries(files).map(([, file]) => (
                <div key={file.name} className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-teal-600 shrink-0">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-700 truncate">{file.name}</div>
                    <div className="text-xs text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(1)}MB &bull;{" "}
                      {file.name.split(".").pop()?.toUpperCase()}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-teal-600 transition-colors">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-5 mb-5 flex items-start gap-2.5 bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 text-xs text-gray-600 italic">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal-600 mt-0.5 shrink-0">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          By submitting this request, you confirm that all provided information is accurate and
          matches the official medical records within the MotherHood Journey platform.
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">Submission is final and cannot be undone</span>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-800 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                Submit Request
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-500 shrink-0 mt-0.5">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <div className="text-sm font-semibold text-red-700">Submission Failed</div>
            <div className="text-xs text-red-600 mt-0.5">{error}</div>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-teal-700">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-gray-800 text-sm mb-1">What happens next?</div>
          <div className="text-xs text-gray-500 leading-relaxed">
            Your request will be routed to the District Health Officer for verification. You can
            track the real-time status under the "Service Requests" tab on your dashboard. You will
            receive a notification once the certificate is ready for download.
          </div>
        </div>
      </div>
    </div>
  );
}