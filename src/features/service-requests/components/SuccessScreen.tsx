"use client";
 
interface SuccessScreenProps {
  refNum: string;
  onAnother: () => void;
}
 
export default function SuccessScreen({ refNum, onAnother }: SuccessScreenProps) {
  return (
    <div className="flex flex-col items-center text-center py-10">
      <div className="w-16 h-16 rounded-full border-4 border-teal-500 flex items-center justify-center mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-8 h-8 text-teal-600">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
 
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted Successfully</h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        Your application has been received and is currently being processed by our clinical review
        team.
      </p>
 
      <div className="bg-teal-800 text-white rounded-xl px-10 py-4 mb-8">
        <div className="text-xs text-teal-300 uppercase tracking-widest mb-1">Reference Number</div>
        <div className="text-2xl font-bold tracking-wide">{refNum}</div>
      </div>
 
      <div className="flex gap-3 mb-10">
        <button
          onClick={onAnother}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-800 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Submit Another Request
        </button>
        <button className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path d="M3 4a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3a1 1 0 011-1z" />
          </svg>
          Go to Dashboard
        </button>
      </div>
 
      <div className="w-full max-w-lg grid sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-start gap-3 text-left">
          <div className="text-teal-600 mt-0.5">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-800 mb-0.5">What happens next?</div>
            <div className="text-xs text-gray-500">
              Track your request in the <strong>Documents tab</strong> using your reference number.
              You will receive an SMS notification once the review is complete.
            </div>
          </div>
        </div>
        <button className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3 text-left hover:bg-gray-100 transition-colors">
          <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-teal-700">
              <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3-3-3z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm text-gray-800">Need assistance?</div>
            <div className="text-xs text-teal-700 font-medium">Talk to Support</div>
          </div>
        </button>
      </div>
    </div>
  );
}