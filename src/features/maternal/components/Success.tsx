"use client";

import React from "react";
import { Printer, CheckCircle, Copy } from "lucide-react";

/**
 * Success Component - Health ID Display
 * 
 * Shown after successful registration
 * Displays the generated health_id
 * Provides:
 * - Print button for facilities with printers
 * - Copy button for shareable identifier
 * - Success message
 * 
 * Props:
 * - healthId: The generated health ID
 * - firstName: Mother's first name
 * - lastName: Mother's last name
 * - onNewRegistration: Callback to start a new registration
 */

interface SuccessProps {
  healthId: string;
  firstName: string;
  lastName: string;
  onNewRegistration: () => void;
}

export function MotherRegistrationSuccess({
  healthId,
  firstName,
  lastName,
  onNewRegistration,
}: SuccessProps) {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Health ID - ${firstName} ${lastName}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
            .container { max-width: 500px; margin: 0 auto; border: 2px solid #333; padding: 30px; border-radius: 10px; }
            .label { font-size: 18px; color: #666; margin-bottom: 20px; }
            .health-id { font-size: 48px; font-weight: bold; color: #10b981; letter-spacing: 2px; font-family: monospace; margin: 20px 0; }
            .name { font-size: 20px; color: #333; margin: 20px 0; }
            .footer { font-size: 12px; color: #999; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="label">Health ID</div>
            <div class="name">${firstName} ${lastName}</div>
            <div class="health-id">${healthId}</div>
            <div class="footer">Keep this ID for all future health visits</div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "height=400,width=600");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(healthId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Success Header */}
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mt-2">
          Welcome to the maternal health tracking system
        </p>
      </div>

      {/* Health ID Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Your Unique Health ID</p>
        <div className="bg-white rounded-md p-4 mb-4">
          <p className="text-3xl font-bold text-green-600 font-mono tracking-widest">
            {healthId}
          </p>
        </div>
        <p className="text-sm text-gray-700">
          This is your shareable identifier for all health visits
        </p>
      </div>

      {/* Mother's Name */}
      <div className="text-center bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">Registered Name</p>
        <p className="text-lg font-semibold text-gray-900">
          {firstName} {lastName}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {/* Print Button */}
        <button
          onClick={handlePrint}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Health ID
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Copy className="w-4 h-4" />
          {copied ? "Copied to Clipboard!" : "Copy Health ID"}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
        <p className="font-semibold mb-1">💡 Important</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Keep your Health ID safe for all future visits</li>
          <li>You can share this ID with health facilities</li>
          <li>For facilities without printers, use this digital ID</li>
        </ul>
      </div>

      {/* New Registration Button */}
      <button
        onClick={onNewRegistration}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors"
      >
        Register Another Mother
      </button>
    </div>
  );
}
