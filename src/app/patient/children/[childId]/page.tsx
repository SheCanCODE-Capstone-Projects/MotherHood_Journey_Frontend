"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Baby, Calendar, Weight, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { getChildProfile } from "@/lib/api/children";

export default function ChildProfilePage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.childId as string;

  const { data: child, isLoading, isError } = useQuery({
    queryKey: ["child", childId],
    queryFn: () => getChildProfile(childId),
    enabled: !!childId,
  });

  const healthStatusColors: Record<string, string> = {
    HEALTHY: "bg-green-100 text-green-800 border-green-200",
    AT_RISK: "bg-amber-100 text-amber-800 border-amber-200",
    CRITICAL: "bg-red-100 text-red-800 border-red-200",
  };

  const calculateAge = (dob: string) => {
    const months = Math.floor(
      (Date.now() - new Date(dob).getTime()) / (30.44 * 24 * 60 * 60 * 1000),
    );
    if (months < 12) return `${months} months old`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? "s" : ""} old`;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError || !child) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <Baby className="size-10 text-gray-300" />
        <p className="text-sm text-gray-500">Child profile not found.</p>
        <button onClick={() => router.back()} className="text-sm font-medium text-teal-600 hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Child Profile</h1>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center">
                <Baby size={28} className="text-teal-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{child.first_name}</h2>
                <p className="text-sm text-gray-600 mt-1">{calculateAge(child.date_of_birth)}</p>
                {child.mother_name && (
                  <button
                    onClick={() => router.push(`/mothers/${child.mother_id}`)}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-2"
                  >
                    Mother: {child.mother_name} →
                  </button>
                )}
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold border ${healthStatusColors[child.health_status] ?? "bg-gray-100 text-gray-800 border-gray-200"}`}
            >
              {child.health_status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date of Birth</p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(child.date_of_birth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {child.delivery_type && (
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Type</p>
                  <p className="text-sm font-semibold text-gray-900">{child.delivery_type}</p>
                </div>
              </div>
            )}

            {child.birth_weight && (
              <div className="flex items-center gap-3">
                <Weight size={20} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Birth Weight</p>
                  <p className="text-sm font-semibold text-gray-900">{child.birth_weight} kg</p>
                </div>
              </div>
            )}
          </div>
        </div>

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
