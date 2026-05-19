"use client";
 
import { ServiceTypeId, DocKey, UploadedFiles } from "@/features/service-requests/types";
import { SERVICE_TYPES } from "@/features/service-requests/constants";
import DropZone from "./DropZone";
import FileRow from "./FileRow";
 
interface Step2UploadDocsProps {
  service: ServiceTypeId;
  files: UploadedFiles;
  onFile: (docKey: DocKey, file: File) => void;
  onRemove: (docKey: string) => void;
  onBack: () => void;
  onNext: () => void;
  requestId: string;
}
 
export default function Step2UploadDocs({
  service,
  files,
  onFile,
  onRemove,
  onBack,
  onNext,
  requestId,
}: Step2UploadDocsProps) {
  const svc = SERVICE_TYPES.find((s) => s.id === service)!;
  const allUploaded = svc.requiredDocs.every((d) => files[d]);
 
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Upload Supporting Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Please provide clear scans or photos of the following documents to process your{" "}
            {svc.label.toLowerCase()} request.
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-gray-400 uppercase tracking-wide">Request ID</div>
          <div className="font-bold text-teal-800 text-sm">{requestId}</div>
        </div>
      </div>
 
      <div
        className={`grid gap-4 mb-6 ${
          svc.requiredDocs.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {svc.requiredDocs.map((d) => (
          <DropZone key={d} docKey={d} onFile={onFile} />
        ))}
      </div>
 
      {Object.keys(files).length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Uploaded Documents
          </div>
          <div className="space-y-2">
            {Object.entries(files).map(([key, file]) => (
              <FileRow key={key} file={file} onRemove={() => onRemove(key)} />
            ))}
          </div>
        </div>
      )}
 
      <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 text-sm text-gray-600 mb-8">
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal-600 mt-0.5 shrink-0">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          Ensure all text is legible and edges of the documents are visible. Blurred or cropped
          documents may lead to application rejection.
        </span>
      </div>
 
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <button className="text-sm text-teal-700 font-medium hover:underline">
            Save for Later
          </button>
          <button
            onClick={onNext}
            disabled={!allUploaded}
            className="flex items-center gap-1.5 px-6 py-2 rounded-lg bg-teal-800 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}