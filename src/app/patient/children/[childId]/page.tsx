'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Baby, Calendar, Weight, User } from 'lucide-react';
import Link from 'next/link';

type HealthStatus = 'HEALTHY' | 'AT_RISK' | 'CRITICAL';

interface ChildProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  healthStatus: HealthStatus;
  deliveryType: string;
  birthWeight: number;
  motherId: string;
  motherName: string;
}

// Mock child data
const MOCK_CHILD: ChildProfile = {
  id: '1',
  firstName: 'Grace',
  lastName: 'Uwase',
  dateOfBirth: '2024-01-15',
  healthStatus: 'HEALTHY',
  deliveryType: 'Normal Delivery',
  birthWeight: 3.2,
  motherId: 'mother-1',
  motherName: 'Divine Uwase',
};

export default function ChildProfilePage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.childId as string;
  const child = MOCK_CHILD;

  const healthStatusColors = {
    HEALTHY: 'bg-green-100 text-green-800 border-green-200',
    AT_RISK: 'bg-amber-100 text-amber-800 border-amber-200',
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (months < 12) return `${months} months old`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} old`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Child Profile</h1>
        </div>

        {/* Child Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
                <Baby size={28} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {child.firstName} {child.lastName}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{calculateAge(child.dateOfBirth)}</p>
                <button
                  onClick={() => router.push(`/mothers/${child.motherId}`)}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
                >
                  Mother: {child.motherName} →
                </button>
              </div>
            </div>
            
            <span className={`px-4 py-2 rounded-full text-sm font-bold border ${healthStatusColors[child.healthStatus]}`}>
              {child.healthStatus}
            </span>
          </div>

          {/* Birth Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(child.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Type</p>
                <p className="text-sm font-semibold text-gray-900">{child.deliveryType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Weight size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Birth Weight</p>
                <p className="text-sm font-semibold text-gray-900">{child.birthWeight} kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={`/patient/children/${childId}/vaccinations`}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900">View Vaccination Card</p>
                <p className="text-sm text-gray-600 mt-1">Complete immunization schedule</p>
              </div>
              <span className="text-teal-600">→</span>
            </Link>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900">Back to Children</p>
                <p className="text-sm text-gray-600 mt-1">Return to children list</p>
              </div>
              <span className="text-gray-600">←</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
