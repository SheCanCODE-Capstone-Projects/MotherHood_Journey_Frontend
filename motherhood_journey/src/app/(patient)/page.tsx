"use client";

import { Plus, MessageSquare, X } from "lucide-react";
import Image from "next/image";

export default function PatientDashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <HeaderCard />
        </div>
        <div>
          <DoctorCard />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <QuickActions />
        </div>
        <div className="lg:col-span-2">
          <ContentCards />
        </div>
      </div>

      <StatsCards />
    </div>
  );
}

function HeaderCard() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <h1 className="text-4xl font-semibold text-gray-900 mb-2">Hello, Sarah.</h1>
      <p className="text-gray-600 text-base mb-6">
        You're in Week 34 of your pregnancy. Your baby is the size of a pineapple.
      </p>
      <div className="flex items-center gap-6">
        <div className="text-6xl font-bold text-teal-700">84</div>
        <div className="flex-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorCard() {
  return (
    <div className="bg-teal-800 rounded-3xl p-6 text-white shadow-lg relative">
      <button className="absolute top-4 right-4 text-white/60 hover:text-white">
        <X size={20} />
      </button>
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-1">Dr. Helena Smith</h3>
        <p className="text-teal-200 text-sm">Gynecologist</p>
      </div>
      <div className="pt-4 border-t border-white/20">
        <p className="text-sm">Oct 14, 2024</p>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="space-y-4">
      <ActionButton icon={<Plus size={20} />} label="Request Service" />
      <ActionButton icon={<MessageSquare size={20} />} label="Chat with CHW" />
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 text-left">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600">
        {icon}
      </div>
      <span className="text-gray-900 font-medium">{label}</span>
    </button>
  );
}

function ContentCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ContentCard image="/avocado.jpg" title="Third Trimester Essentials" />
      <ContentCard image="/bedroom.jpg" title="Managing Sleep Positions" />
    </div>
  );
}

function ContentCard({ image, title }: { image: string; title: string }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm h-48 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h4 className="font-medium text-base">{title}</h4>
      </div>
    </div>
  );
}

function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Blood Pressure" value="118/76" />
      <StatCard label="Weight" value="154 lbs" />
      <StatCard label="Heart Rate" value="72 bpm" />
      <StatCard label="Status" value="High" />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
