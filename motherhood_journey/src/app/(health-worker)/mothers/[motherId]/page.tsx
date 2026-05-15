'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Phone, Mail, MapPin, Baby, Calendar } from 'lucide-react';

type HealthStatus = 'HEALTHY' | 'AT_RISK' | 'CRITICAL';

interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  healthStatus: HealthStatus;
  vaccinationStatus: 'UP_TO_DATE' | 'PENDING' | 'OVERDUE';
}

interface MotherProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  children: Child[];
}

// Mock data
const MOCK_MOTHER: MotherProfile = {
  id: 'mother-1',
  firstName: 'Divine',
  lastName: 'Uwase',
  phone: '+250 788 123 456',
  email: 'divine.uwase@example.com',
  address: 'Kigali, Gasabo District, Remera Sector',
  children: [
    {
      id: '1',
      firstName: 'Grace',
      lastName: 'Uwase',
      dateOfBirth: '2024-01-15',
      healthStatus: 'HEALTHY',
      vaccinationStatus: 'OVERDUE',
    },
    {
      id: '2',
      firstName: 'Emmanuel',
      lastName: 'Uwase',
      dateOfBirth: '2022-06-20',
      healthStatus: 'HEALTHY',
      vaccinationStatus: 'PENDING',
    },
    {
      id: '3',
      firstName: 'Hope',
      lastName: 'Uwase',
      dateOfBirth: '2020-03-10',
      healthStatus: 'AT_RISK',
      vaccinationStatus: 'UP_TO_DATE',
    },
  ],
};

export default function MotherProfilePage() {
  const params = useParams();
  const router = useRouter();
  const motherId = params.motherId as string;
  
  const mother = MOCK_MOTHER;

  const healthStatusColors = {
    HEALTHY: 'bg-green-100 text-green-800 border-green-200',
    AT_RISK: 'bg-amber-100 text-amber-800 border-amber-200',
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
  };

  const vaccinationStatusColors = {
    UP_TO_DATE: 'bg-green-100 text-green-800',
    PENDING: 'bg-amber-100 text-amber-800',
    OVERDUE: 'bg-red-100 text-red-800',
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''}`;
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
          <h1 className="text-2xl font-bold text-gray-900">Mother Profile</h1>
        </div>

        {/* Mother Info Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
              <User size={28} className="text-teal-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {mother.firstName} {mother.lastName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Mother ID: {mother.id}</p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                <a href={`tel:${mother.phone}`} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                  {mother.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                <a href={`mailto:${mother.email}`} className="text-sm font-semibold text-teal-600 hover:text-teal-700">
                  {mother.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                <p className="text-sm font-semibold text-gray-900">{mother.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Children Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Children</h3>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {mother.children.length} {mother.children.length === 1 ? 'Child' : 'Children'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mother.children.map((child) => (
              <div
                key={child.id}
                onClick={() => router.push(`/children/${child.id}`)}
                className="border border-gray-200 rounded-xl p-5 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <Baby size={20} className="text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                        {child.firstName} {child.lastName}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{calculateAge(child.dateOfBirth)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Health Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${healthStatusColors[child.healthStatus]}`}>
                      {child.healthStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Vaccination</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${vaccinationStatusColors[child.vaccinationStatus]}`}>
                      {child.vaccinationStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-600">
                      Born: {new Date(child.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="w-full text-sm font-semibold text-teal-600 hover:text-teal-700 text-center">
                    View Profile →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
