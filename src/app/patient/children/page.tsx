"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Baby, CheckCircle, AlertCircle, Calendar, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { useAuth } from "@/shared/hooks/useAuth";
import Link from "next/link";

interface ChildRecord {
  id: string;
  mother_id: string;
  first_name: string;
  gender: "MALE" | "FEMALE";
  date_of_birth: string;
  birth_weight: number;
  delivery_type: "NORMAL" | "CAESAREAN" | "ASSISTED";
  birth_certificate_number?: string;
  created_at: string;
}

interface VaccinationRecord {
  id: string;
  vaccine_name: string;
  due_date: string;
  status: "pending" | "administered" | "missed";
}

interface ChildWithVaccinations {
  child: ChildRecord;
  vaccinations: VaccinationRecord[];
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function calculateAge(dob: string): string {
  const today = new Date();
  const birthDate = new Date(dob);
  const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""}`;
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths > 0) {
    return `${years}y ${remainingMonths}m`;
  }
  return `${years} year${years > 1 ? "s" : ""}`;
}

export default function ChildrenPage() {
  const roleTheme = ROLE_THEMES.patient;
  const [children, setChildren] = useState<ChildWithVaccinations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function loadChildren() {
      try {
        // Try to fetch children from the backend API
        // For now, we'll use the vaccination session search to find children
        // In a real implementation, there should be a dedicated endpoint to list children for a mother
        const response = await apiClient.get<ChildRecord[]>("/api/v1/children");
        
        // For each child, fetch their vaccination records
        const childrenWithVaccinations = await Promise.all(
          response.map(async (child) => {
            try {
              const vaccinations = await apiClient.get<VaccinationRecord[]>(
                `/api/v1/children/${child.id}/vaccinations`
              );
              return { child, vaccinations };
            } catch {
              return { child, vaccinations: [] };
            }
          })
        );
        
        setChildren(childrenWithVaccinations);
        setError(null);
      } catch (err) {
        console.error("Failed to load children:", err);
        setError("Unable to load children records. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadChildren();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Children"
          subtitle="Track immunization records and health follow-ups."
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#2C6F73]" />
          <span className="ml-3 text-sm text-gray-600">Loading children records...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Children"
          subtitle="Track immunization records and health follow-ups."
        />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-3 text-lg font-semibold text-red-800">Error Loading Records</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Children"
          subtitle="Track immunization records and health follow-ups."
        />
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <Baby className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">No Children Records</h3>
          <p className="mt-2 text-sm text-gray-600">No children have been registered yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Children"
        subtitle="Track immunization records and health follow-ups."
      />

      {/* Children Profiles */}
      {children.map(({ child, vaccinations }) => {
        const completedVaccinations = vaccinations.filter(v => v.status === "administered").length;
        const totalVaccinations = vaccinations.length;
        const nextDue = vaccinations.find(v => v.status === "pending");
        
        return (
        <div key={child.id}>
          <Link href={`/patient/children/${child.id}`} className="block">
            <section className="rounded-3xl border-2 bg-white p-6 transition-all hover:shadow-lg" style={{ borderColor: roleTheme.border }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <Baby className="size-6" style={{ color: roleTheme.accent }} />
                    <h2 className="text-2xl font-bold" style={{ color: roleTheme.text }}>{child.first_name}</h2>
                  </div>
                  <p className="mt-2 text-sm" style={{ color: roleTheme.text }}>
                    Born: {formatDate(child.date_of_birth)} • Age: {calculateAge(child.date_of_birth)}
                  </p>
                </div>
                <span className="rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor: roleTheme.accentSoft, color: roleTheme.text }}>
                  {child.gender === "MALE" ? "Male" : "Female"}
                </span>
              </div>

              {/* Progress Stats */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl p-4" style={{ backgroundColor: roleTheme.accentSoft }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Immunizations</p>
                  <p className="mt-2 text-2xl font-bold" style={{ color: roleTheme.text }}>
                    {completedVaccinations}/{totalVaccinations}
                  </p>
                  <div className="mt-3 h-2 rounded-full bg-white/30">
                    <div 
                      className="h-full rounded-full" 
                      style={{ width: `${totalVaccinations > 0 ? (completedVaccinations / totalVaccinations) * 100 : 0}%`, backgroundColor: roleTheme.accent }} 
                    />
                  </div>
                </div>
                <div className="rounded-2xl p-4" style={{ backgroundColor: roleTheme.accentSoft }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Next Due</p>
                  <p className="mt-2 text-lg font-bold" style={{ color: roleTheme.text }}>
                    {nextDue ? nextDue.vaccine_name : "All clear"}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>
                    {nextDue ? `Due: ${formatDate(nextDue.due_date)}` : "No pending vaccines"}
                  </p>
                </div>
                <div className="rounded-2xl p-4" style={{ backgroundColor: roleTheme.accentSoft }}>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: roleTheme.text }}>Birth Weight</p>
                  <p className="mt-2 text-lg font-bold" style={{ color: roleTheme.text }}>{child.birth_weight} kg</p>
                  <p className="mt-1 text-sm" style={{ color: roleTheme.text }}>
                    {child.delivery_type === "NORMAL" ? "Normal delivery" : child.delivery_type}
                  </p>
                </div>
              </div>
            </section>
          </Link>

          {/* Vaccination Records */}
          {vaccinations.length > 0 && (
            <section className="mt-6">
              <h3 className="mb-4 text-lg font-semibold" style={{ color: roleTheme.text }}>Vaccination Records</h3>
              <div className="space-y-3">
                {vaccinations.map((vax) => (
                  <div key={vax.id} className="flex items-center justify-between rounded-2xl border p-4" style={{ borderColor: roleTheme.border }}>
                    <div className="flex items-center gap-3">
                      {vax.status === 'administered' ? (
                        <CheckCircle className="size-6" style={{ color: '#10B981' }} />
                      ) : vax.status === 'missed' ? (
                        <AlertCircle className="size-6" style={{ color: '#F59E0B' }} />
                      ) : (
                        <Calendar className="size-6" style={{ color: '#D1D5DB' }} />
                      )}
                      <div>
                        <p className="font-semibold" style={{ color: roleTheme.text }}>{vax.vaccine_name}</p>
                        <p className="text-sm" style={{ color: roleTheme.text }}>Due: {formatDate(vax.due_date)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        vax.status === 'administered' ? 'bg-green-100 text-green-700' :
                        vax.status === 'missed' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {vax.status === 'administered' ? 'Completed' : vax.status === 'missed' ? 'Missed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        );
      })}
    </div>
  );
}
