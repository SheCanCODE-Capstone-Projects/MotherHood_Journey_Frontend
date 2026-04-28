"use client";

import { Home, FileText, ClipboardList, MessageSquare, Lightbulb, Plus, MessageCircle, X, User, Bell, Calendar, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-[1100px] mx-auto">
          <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
          <TopBar />
          <div className="mt-4 md:mt-6 space-y-4 md:space-y-6">
            <TopSection />
            <MiddleSection />
            <BottomSection />
            <Footer />
          </div>
        </div>
      </main>
      
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />
        </>
      )}
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[240px] bg-white flex-col py-6 px-4 border-r border-gray-100">
      <div className="px-3 mb-8">
        <h1 className="text-sm font-bold text-gray-900 leading-tight">Maternal<br />Sanctuary</h1>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarItem icon={<Home size={18} />} label="HOME" active />
        <SidebarItem icon={<FileText size={18} />} label="MY RECORDS" />
        <SidebarItem icon={<ClipboardList size={18} />} label="REQUESTS" />
        <SidebarItem icon={<MessageSquare size={18} />} label="CHAT" />
        <SidebarItem icon={<Lightbulb size={18} />} label="TIPS" />
      </nav>

      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">SJ</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">Samantha Josh</p>
            <p className="text-[10px] text-gray-500">Head of Birth Clinic</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="lg:hidden bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="w-9 h-9 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <h1 className="text-sm font-bold text-gray-900">Maternal Sanctuary</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Bell size={14} className="text-gray-600" />
        </button>
        <button className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">SJ</span>
        </button>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl lg:hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-sm font-bold text-gray-900 leading-tight">Maternal<br />Sanctuary</h1>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors"
        >
          <X size={18} className="text-gray-600" />
        </button>
      </div>
      
      <nav className="p-4 space-y-1">
        <MobileMenuItem icon={<Home size={18} />} label="HOME" href="/" active onClick={onClose} />
        <MobileMenuItem icon={<FileText size={18} />} label="MY RECORDS" href="/records" onClick={onClose} />
        <MobileMenuItem icon={<ClipboardList size={18} />} label="REQUESTS" href="/requests" onClick={onClose} />
        <MobileMenuItem icon={<MessageSquare size={18} />} label="CHAT" href="/chat" onClick={onClose} />
        <MobileMenuItem icon={<Lightbulb size={18} />} label="TIPS" href="/tips" onClick={onClose} />
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">SJ</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900">Samantha Josh</p>
            <p className="text-[10px] text-gray-500">Head of Birth Clinic</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileMenuItem({ icon, label, href, active = false, onClick }: { icon: React.ReactNode; label: string; href: string; active?: boolean; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-semibold transition-colors ${
        active ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  const href = label === "HOME" ? "/" : label === "MY RECORDS" ? "/records" : label === "REQUESTS" ? "/requests" : label === "CHAT" ? "/chat" : "/tips";
  
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[11px] font-semibold tracking-wide transition-colors ${
        active ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function TopBar() {
  return (
    <div className="hidden lg:flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-1">Pregnancy Journey</p>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Welcome Back, Sarah</h2>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <Bell size={16} className="text-gray-600" />
        </button>
        <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50">
          <User size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function TopSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 md:gap-5">
      <GreetingCard />
      <DoctorCard />
    </div>
  );
}

function GreetingCard() {
  return (
    <div className="bg-white rounded-2xl md:rounded-[28px] p-6 md:p-8 shadow-sm border border-gray-100">
      <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-2 md:mb-3">Pregnancy Progress</p>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Hello, Sarah.</h3>
      <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 leading-relaxed">
        You're in <span className="font-semibold text-gray-900">Week 34</span> of your pregnancy. Your baby is the size of a pineapple.
      </p>
      <div className="flex items-center gap-4 md:gap-6">
        <div>
          <p className="text-4xl md:text-5xl font-bold text-teal-700 mb-1">84</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Days Left</p>
        </div>
        <div className="flex-1">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-600 rounded-full" style={{ width: "85%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DoctorCard() {
  return (
    <div className="bg-teal-700 rounded-2xl md:rounded-[28px] p-6 text-white shadow-lg relative">
      <button className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
        <X size={16} className="text-white" />
      </button>
      <div className="mb-6">
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
          <Calendar size={20} className="text-white" />
        </div>
        <h4 className="text-lg font-bold mb-1">Dr. Helena Smith</h4>
        <p className="text-xs text-teal-100 font-medium">Gynecologist</p>
      </div>
      <div className="pt-4 border-t border-white/10">
        <p className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1">Next Appointment</p>
        <p className="text-sm font-bold">Oct 24, 2024</p>
        <p className="text-xs text-teal-100 mt-1">10:00 AM • Virtual Consult</p>
      </div>
    </div>
  );
}

function MiddleSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 md:gap-5">
      <QuickActions />
      <ContentCards />
    </div>
  );
}

function QuickActions() {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Quick Actions</p>
      <div className="space-y-3">
        <ActionButton 
          icon={<Plus size={18} />} 
          label="Request Service" 
          sublabel="Submit new request"
          color="teal"
        />
        <ActionButton 
          icon={<MessageCircle size={18} />} 
          label="Chat with CHW" 
          sublabel="Get instant support"
          color="teal"
        />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, sublabel, color }: { icon: React.ReactNode; label: string; sublabel: string; color: string }) {
  return (
    <button className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-3 text-left group">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-600'} group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-[10px] text-gray-500 font-medium">{sublabel}</p>
      </div>
      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function ContentCards() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1">Daily Health Tips</p>
        <div className="flex gap-2">
          <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50">
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ContentCard 
          title="Third Trimester Essentials" 
          gradient="from-emerald-400 to-teal-500"
          hasImage={true}
          imagePath="/imagefood.webp"
        />
        <ContentCard 
          title="Managing Sleep Positions" 
          gradient="from-blue-300 to-cyan-400"
          hasImage={true}
          imagePath="/sleepPosition.png"
        />
      </div>
    </div>
  );
}

function ContentCard({ title, gradient, hasImage = false, imagePath }: { title: string; gradient: string; hasImage?: boolean; imagePath?: string }) {
  if (hasImage && imagePath) {
    return (
      <div className="bg-teal-700 rounded-2xl overflow-hidden shadow-lg h-44 relative group cursor-pointer hover:shadow-xl transition-shadow">
        <img 
          src={imagePath} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h4 className="text-white font-semibold text-base relative z-10 group-hover:translate-x-1 transition-transform">{title}</h4>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-teal-700 rounded-2xl overflow-hidden shadow-lg h-44 relative flex items-end p-5 group cursor-pointer hover:shadow-xl transition-shadow">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      <h4 className="text-white font-semibold text-base relative z-10 group-hover:translate-x-1 transition-transform">{title}</h4>
    </div>
  );
}

function BottomSection() {
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 md:mb-4 px-1">Health Metrics</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 md:mb-3">{label}</p>
      <div className="mb-1 md:mb-2">
        <span className="text-2xl md:text-3xl font-bold text-teal-700">{value}</span>
        {unit && <span className="text-xs md:text-sm font-semibold text-gray-500 ml-1">{unit}</span>}
      </div>
      <p className="text-[9px] md:text-[10px] font-semibold text-gray-500">{status}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pt-8 mt-4 border-t border-gray-200">
      <div className="flex flex-wrap justify-center gap-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        <a href="#" className="hover:text-gray-600">Support</a>
        <a href="#" className="hover:text-gray-600">Privacy Policy</a>
        <a href="#" className="hover:text-gray-600">Terms of Service</a>
        <a href="#" className="hover:text-gray-600">Emergency Contacts</a>
      </div>
      <p className="text-center text-[9px] text-gray-300 uppercase tracking-widest font-bold mt-4">
        © 2026 Maternal Sanctuary Health System
      </p>
    </footer>
  );
}
