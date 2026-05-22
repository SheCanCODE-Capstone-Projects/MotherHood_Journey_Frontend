'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Baby, Calendar, Weight, User, X, CheckCircle } from 'lucide-react';
import { useChildVaccinations, useMarkAdministered, VaccinationRecord } from '../../../../hooks/useVaccinations';

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
  
  const [selectedVaccination, setSelectedVaccination] = useState<VaccinationRecord | null>(null);
  const [showAdministerDialog, setShowAdministerDialog] = useState(false);
  
  const { data: vaccinations, isLoading } = useChildVaccinations(childId);
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

  const handleRowClick = (vaccination: VaccinationRecord) => {
    if (vaccination.status === 'OVERDUE' || vaccination.status === 'PENDING') {
      setSelectedVaccination(vaccination);
      setShowAdministerDialog(true);
    }
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

        {/* Vaccination Schedule */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Vaccination Schedule</h3>
          
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Vaccine
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Antigen Code
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Window
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Administered Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Lot Number
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vaccinations?.map((vaccination: VaccinationRecord) => (
                    <VaccinationRow
                      key={vaccination.id}
                      vaccination={vaccination}
                      onClick={() => handleRowClick(vaccination)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mark Administered Dialog */}
      {showAdministerDialog && selectedVaccination && (
        <MarkAdministeredDialog
          vaccination={selectedVaccination}
          onClose={() => {
            setShowAdministerDialog(false);
            setSelectedVaccination(null);
          }}
        />
      )}
    </div>
  );
}

function VaccinationRow({ vaccination, onClick }: { vaccination: VaccinationRecord; onClick: () => void }) {
  const statusColors = {
    PENDING: 'bg-gray-50',
    ADMINISTERED: 'bg-green-50',
    MISSED: 'bg-amber-50',
    OVERDUE: 'bg-red-50',
  };

  const statusBadgeColors = {
    PENDING: 'bg-gray-100 text-gray-800',
    ADMINISTERED: 'bg-green-100 text-green-800',
    MISSED: 'bg-amber-100 text-amber-800',
    OVERDUE: 'bg-red-100 text-red-800',
  };

  const isClickable = vaccination.status === 'OVERDUE' || vaccination.status === 'PENDING';

  return (
    <tr
      className={`border-b border-gray-100 ${statusColors[vaccination.status]} ${
        isClickable ? 'cursor-pointer hover:opacity-75' : ''
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      <td className="py-4 px-4 text-sm font-medium text-gray-900">{vaccination.vaccineName}</td>
      <td className="py-4 px-4 text-sm text-gray-600">{vaccination.antigenCode}</td>
      <td className="py-4 px-4 text-sm text-gray-600">
        {new Date(vaccination.dueDate).toLocaleDateString()}
      </td>
      <td className="py-4 px-4 text-sm text-gray-600">
        {new Date(vaccination.windowStart).toLocaleDateString()} -{' '}
        {new Date(vaccination.windowEnd).toLocaleDateString()}
      </td>
      <td className="py-4 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusBadgeColors[vaccination.status]}`}>
          {vaccination.status}
        </span>
      </td>
      <td className="py-4 px-4 text-sm text-gray-600">
        {vaccination.administeredDate
          ? new Date(vaccination.administeredDate).toLocaleDateString()
          : '-'}
      </td>
      <td className="py-4 px-4 text-sm text-gray-600">{vaccination.lotNumber || '-'}</td>
    </tr>
  );
}

function MarkAdministeredDialog({ vaccination, onClose }: { vaccination: VaccinationRecord; onClose: () => void }) {
  const [administeredDate, setAdministeredDate] = useState(new Date().toISOString().split('T')[0]);
  const [lotNumber, setLotNumber] = useState('');
  const [facilityName, setFacilityName] = useState('');

  const { mutate: markAdministered, isPending } = useMarkAdministered();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markAdministered(
      {
        vaccinationId: vaccination.id,
        administeredDate,
        lotNumber,
        facilityName,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Mark as Administered</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-semibold text-gray-900">{vaccination.vaccineName}</p>
          <p className="text-xs text-gray-600 mt-1">Antigen: {vaccination.antigenCode}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Administered Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={administeredDate}
              onChange={(e) => setAdministeredDate(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lot Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lotNumber}
              onChange={(e) => setLotNumber(e.target.value)}
              placeholder="e.g., LOT-BCG-2024-001"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facility Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={facilityName}
              onChange={(e) => setFacilityName(e.target.value)}
              placeholder="e.g., Kigali Health Center"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Mark Administered
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
