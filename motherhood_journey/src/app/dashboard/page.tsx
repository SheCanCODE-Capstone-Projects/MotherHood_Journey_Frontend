"use client";

import { Home, FileText, Calendar, MessageSquare, Settings, Plus, MessageCircle, X, User } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#f5f7f9]">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HeaderCard />
            </div>
            <div>
              <DoctorCard />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <QuickActions />
            </div>
            <div className="lg:col-span-2">
              <ContentCards />
            </div>
          </div>

          <StatsCards />
        </div>
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Maternal Sanctuary</h1>
      </div>

      <nav className="flex-1 px-3">
        <SidebarItem icon={<Home size={20} />} label="Home" active />
        <SidebarItem icon={<FileText size={20} />} label="My Records" />
        <SidebarItem icon={<Calendar size={20} />} label="Appointments" />
        <SidebarItem icon={<MessageSquare size={20} />} label="Chat" />
        <SidebarItem icon={<Settings size={20} />} label="Settings" />
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
            <p className="text-xs text-gray-500">Patient</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
        active ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function HeaderCard() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      <h2 className="text-4xl font-semibold text-gray-900 mb-3">Hello, Sarah.</h2>
      <p className="text-gray-600 text-base mb-8">
        You're in Week 34 of your pregnancy. Your baby is the size of a pineapple.
      </p>
      <div className="flex items-center gap-8">
        <div className="text-6xl font-bold text-teal-700">84</div>
        <div className="flex-1">
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: "85%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorCard() {
  return (
    <div className="bg-teal-800 rounded-3xl p-6 text-white shadow-lg relative h-full">
      <button className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors">
        <X size={20} />
      </button>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">Dr. Helena Smith</h3>
        <p className="text-teal-200 text-sm">Gynecologist</p>
      </div>
      <div className="pt-4 border-t border-white/20">
        <p className="text-sm font-medium">Oct 14, 2024</p>
      </div>
    </div>
  );
}

function QuickActions() {
  return (
    <div className="space-y-4">
      <ActionButton icon={<Plus size={20} />} label="Request Service" />
      <ActionButton icon={<MessageCircle size={20} />} label="Chat with CHW" />
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 text-left">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-700">
        {icon}
      </div>
      <span className="text-gray-900 font-medium text-base">{label}</span>
    </button>
  );
}

function ContentCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ContentCard title="Third Trimester Essentials" />
      <ContentCard title="Managing Sleep Positions" />
    </div>
  );
}

function ContentCard({ title }: { title: string }) {
  return (
    <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl overflow-hidden shadow-sm h-56 relative flex items-end p-6">
      <h4 className="text-gray-900 font-medium text-lg">{title}</h4>
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
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{label}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
