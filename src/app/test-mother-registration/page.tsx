"use client";

import { MotherRegistrationForm } from "@/features/maternal/components";

/**
 * Test page for Mother Registration Form
 * This is a simple standalone page without role-based access control
 */
export default function TestMotherRegistrationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mother Registration
          </h1>
          <p className="text-lg text-gray-600">
            Register a new mother in the maternal health tracking system
          </p>
        </div>

        {/* Form */}
        <MotherRegistrationForm />

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            Need help?{" "}
            <a
              href="mailto:support@motherhood.rw"
              className="text-blue-600 hover:underline font-semibold"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
