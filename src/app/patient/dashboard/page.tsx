"use client";

import { Plus, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function PatientDashboardPage() {
  return (
    <div className="space-y-4 md:space-y-5">
      <TopSection />
      <MiddleSection />
      <BottomSection />
    </div>
  );
}

function TopSection() {
  const [showDoctor, setShowDoctor] = useState(true);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-[9px] font-bold text-teal-600 uppercase tracking-widest mb-3 border border-teal-200 bg-teal-50 inline-block px-2 py-0.5 rounded-full">
        Pregnancy Status
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        {/* Left */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Hello, Sarah.</h2>
          <p className="text-xs text-gray-500 mb-5">
            You're in <span className="font-semibold text-gray-700">Week 28</span> of your pregnancy. Your baby is the size of an eggplant!
          </p>

          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-5xl font-bold text-gray-900 leading-none">84</p>
              <p className="text-[9px] text-gray-400 uppercase tracking-wider mt-1">Days Until EDD</p>
            </div>
          </div>

          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full max-w-xs">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: "70%" }} />
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5">Week 28 of 40 • Trimester 3</p>
        </div>

        {/* Doctor card */}
        {showDoctor && (
          <div className="bg-teal-800 rounded-2xl p-4 text-white relative">
            <button
              onClick={() => setShowDoctor(false)}
              className="absolute top-3 right-3 w-6 h-6 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={12} />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-[9px] text-white/60 uppercase tracking-wider">Prenatal Check-up</p>
                <h4 className="text-sm font-bold">Dr. Helena Smith</h4>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 space-y-1">
              <div className="flex items-center gap-2">
                <svg className="w-3 h-3 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-teal-100">Oct 14, 2024</span>
              </div>
              <p className="text-[10px] text-teal-200">2:00 PM • On-Site Exam</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MiddleSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 md:gap-5">
      <QuickActions />
      <ContentCards />
    </div>
  );
}

function QuickActions() {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Quick Actions</p>
      <div className="space-y-2.5">
        <Link href="/patient/appointments/request">
          <ActionButton icon={<Plus size={16} />} label="Request Service" sublabel="Submit new request" />
        </Link>
        <Link href="/patient/chat">
          <ActionButton icon={<MessageCircle size={16} />} label="Chat with CHW" sublabel="Get instant support" />
        </Link>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, sublabel }: { icon: React.ReactNode; label: string; sublabel: string }) {
  return (
    <div className="w-full bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group">
      <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-900">{label}</p>
        <p className="text-[9px] text-gray-500">{sublabel}</p>
      </div>
      <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function ContentCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Daily Health Tips</p>
        <div className="flex gap-1.5">
          <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <svg className="w-2.5 h-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ContentCard title="Third Trimester Essentials" imagePath="/imagefood.webp" />
        <ContentCard title="Managing Sleep Positions" imagePath="/sleepPosition.png" />
      </div>
    </div>
  );
}

function ContentCard({ title, imagePath }: { title: string; imagePath: string }) {
  return (
    <Link href="/tips" className="rounded-2xl overflow-hidden h-40 relative group cursor-pointer hover:shadow-xl transition-shadow block bg-teal-700">
      <img src={imagePath} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-white font-semibold text-sm group-hover:translate-x-1 transition-transform">{title}</h4>
      </div>
    </Link>
  );
}

function BottomSection() {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Health Metrics</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Blood Pressure" value="118/76" unit="mmHg" status="Normal" />
        <StatCard label="Weight" value="154" unit="Lbs" status="+2 this week" />
        <StatCard label="Heart Rate" value="72" unit="BPM" status="Normal" />
        <StatCard label="Baby Height" value="High" unit="" status="35 cm" />
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, status }: { label: string; value: string; unit: string; status: string }) {
  return (
    <Link href="/patient/documents" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-400 transition-all block group">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <div className="mb-1">
        <span className="text-2xl font-bold text-teal-700 group-hover:text-teal-800 transition-colors">{value}</span>
        {unit && <span className="text-xs font-semibold text-gray-500 ml-1">{unit}</span>}
      </div>
      <p className="text-[9px] font-semibold text-gray-500">{status}</p>
    </Link>
  );
}


