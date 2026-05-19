"use client";
 
import { ServiceType } from "@/features/service-requests/types";
 
interface ServiceCardProps {
  service: ServiceType;
  selected: boolean;
  onClick: () => void;
}
 
export default function ServiceCard({ service, selected, onClick }: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-150 hover:shadow-md focus:outline-none
        ${selected ? "border-teal-600 bg-teal-50 shadow-sm" : "border-gray-200 bg-white hover:border-teal-300"}`}
    >
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center mb-3 ${
          selected ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"
        }`}
      >
        {service.icon}
      </div>
      <div className="font-semibold text-gray-800 text-sm">{service.label}</div>
      <div className="text-xs text-gray-500 mt-1">{service.description}</div>
    </button>
  );
}