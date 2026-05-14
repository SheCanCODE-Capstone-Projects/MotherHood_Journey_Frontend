"use client";
 
import { ServiceTypeId } from "@/features/service-requests/types";
import { SERVICE_TYPES } from "@/features/service-requests/constants";
import ServiceCard from "./ServiceCard";
 
interface Step1ServiceTypeProps {
  selected: ServiceTypeId | null;
  onSelect: (id: ServiceTypeId) => void;
  onNext: () => void;
  onCancel: () => void;
}
 
export default function Step1ServiceType({
  selected,
  onSelect,
  onNext,
  onCancel,
}: Step1ServiceTypeProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">New Service Request</h1>
      <p className="text-sm text-gray-500 mb-6">
        Please select the type of official document or service you wish to request from MotherHood Journey.
      </p>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {SERVICE_TYPES.map((s) => (
          <ServiceCard
            key={s.id}
            service={s}
            selected={selected === s.id}
            onClick={() => onSelect(s.id)}
          />
        ))}
      </div>
 
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel Request
        </button>
        <button
          onClick={onNext}
          disabled={!selected}
          className="px-6 py-2 rounded-lg bg-teal-800 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
 
      <div className="mt-6 bg-teal-50 border border-teal-100 rounded-xl flex items-center gap-4 px-5 py-4">
        <div className="w-10 h-10 rounded-full bg-teal-200 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6 text-teal-700">
            <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-800 text-sm">Need assistance with your request?</div>
          <div className="text-xs text-gray-500 mt-0.5">
            Our support team is available 24/7 to help you navigate through the document registration process.
          </div>
        </div>
        <button className="bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shrink-0">
          Get Help
        </button>
      </div>
    </div>
  );
}