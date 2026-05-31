'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Baby, Calendar, Weight, User, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';

interface ChildRecord {
  id: string;
  mother_id: string;
  first_name: string;
  gender: 'MALE' | 'FEMALE';
  date_of_birth: string;
  birth_weight: number;
  delivery_type: 'NORMAL' | 'CAESAREAN' | 'ASSISTED';
  birth_certificate_number?: string;
  created_at: string;
}

type HealthStatus = 'HEALTHY' | 'AT_RISK' | 'CRITICAL';

interface ChildProfile extends ChildRecord {
  healthStatus: HealthStatus;
  motherName: string;
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

function calculateAge(dob: string): string {
  const today = new Date();
  const birthDate = new Date(dob);
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} old`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? 's' : ''} old`;
}

export default function ChildProfilePage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.childId as string;
  
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChildProfile() {
      try {
        const response = await apiClient.get<ChildRecord>(`/api/v1/children/${childId}`);
        // In a real implementation, we would fetch the mother's name from the API
        // For now, we'll use a placeholder
        setChild({
          ...response,
          healthStatus: 'HEALTHY', // This would come from growth monitoring data
          motherName: 'Loading...', // Would be fetched from mother endpoint
        });
        setError(null);
      } catch (err) {
        console.error('Failed to load child profile:', err);
        setError('Unable to load child profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    if (childId) {
      loadChildProfile();
    }
  }, [childId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            <span className="ml-3 text-sm text-gray-600">Loading child profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </button>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-3 text-lg font-semibold text-red-800">Error Loading Profile</h3>
            <p className="mt-2 text-sm text-red-600">{error || 'Child not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  const healthStatusColors = {
    HEALTHY: 'bg-green-100 text-green-800 border-green-200',
    AT_RISK: 'bg-amber-100 text-amber-800 border-amber-200',
    CRITICAL: 'bg-red-100 text-red-800 border-red-200',
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
                  {child.first_name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{calculateAge(child.date_of_birth)}</p>
                <p className="text-sm text-teal-600 font-medium mt-2">
                  Gender: {child.gender === 'MALE' ? 'Male' : 'Female'}
                </p>
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
                  {formatDate(child.date_of_birth)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Type</p>
                <p className="text-sm font-semibold text-gray-900">
                  {child.delivery_type === 'NORMAL' ? 'Normal Delivery' : child.delivery_type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Weight size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Birth Weight</p>
                <p className="text-sm font-semibold text-gray-900">{child.birth_weight} kg</p>
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
            <Link
              href={`/patient/children`}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900">Back to Children</p>
                <p className="text-sm text-gray-600 mt-1">Return to children list</p>
              </div>
              <span className="text-gray-600">←</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
