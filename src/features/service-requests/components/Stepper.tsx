"use client";
 
interface StepperProps {
  step: number;
}
 
const STEPS = ["Service Details", "Upload Documents", "Review & Submit"];
 
export default function Stepper({ step }: StepperProps) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all
                  ${done ? "bg-teal-700 border-teal-700 text-white" : active ? "bg-white border-teal-700 text-teal-700" : "bg-white border-gray-300 text-gray-400"}`}
              >
                {done ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  idx
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium whitespace-nowrap ${
                  active ? "text-teal-700" : done ? "text-teal-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 mb-4 rounded transition-all ${
                  step > idx ? "bg-teal-700" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}