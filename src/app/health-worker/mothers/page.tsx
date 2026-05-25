"use client";

import { PageHeader } from "@/shared/components/layout";
import { ROLE_THEMES } from "@/shared/config/rbac";
import { Users, Search } from "lucide-react";
import Link from "next/link";

export default function MothersListPage() {
  const roleTheme = ROLE_THEMES.health_worker;

  // Mock data for testing
  const mothers = [
    { id: "123", name: "Sarah Uwera", phone: "+250 788 123 456", status: "Active", week: 28 },
    { id: "456", name: "Grace Mukamana", phone: "+250 788 234 567", status: "Active", week: 32 },
    { id: "789", name: "Diane Habimana", phone: "+250 788 345 678", status: "Active", week: 20 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mothers"
        subtitle="View and manage mothers under your care"
      />

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, phone, or ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8" style={{ color: roleTheme.accent }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Total Mothers</p>
              <p className="text-2xl font-bold" style={{ color: roleTheme.text }}>{mothers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Active Pregnancies</p>
              <p className="text-2xl font-bold text-green-600">{mothers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border-2" style={{ borderColor: roleTheme.border }}>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Due This Month</p>
              <p className="text-2xl font-bold text-amber-600">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mothers List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Active Mothers</h2>
        {mothers.map((mother) => (
          <Link key={mother.id} href={`/health-worker/mothers/${mother.id}`}>
            <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center text-white font-bold text-lg">
                    {mother.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{mother.name}</h3>
                    <p className="text-sm text-gray-500">{mother.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mb-2">
                    {mother.status}
                  </span>
                  <p className="text-sm text-gray-600">Week {mother.week}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
