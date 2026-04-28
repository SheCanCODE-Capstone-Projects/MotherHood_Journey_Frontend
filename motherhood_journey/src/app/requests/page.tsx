"use client";

import { Home, FileText, ClipboardList, MessageSquare, Lightbulb, Upload, FileCheck, Calendar, MoreVertical, Eye, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function RequestsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <TopBar />
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 md:py-8">
          <Header />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-6 mt-6 md:mt-8">
            <div>
              <NewRequestForm />
              <RequestHistory />
            </div>
            <QuickTipCard />
          </div>
          <Footer />
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
    <aside className="hidden lg:flex w-[240px] bg-white flex-col py-6 px-4 border-r border-gray-200">
      <div className="px-3 mb-8">
        <h1 className="text-sm font-bold text-gray-900 leading-tight">Maternal<br />Sanctuary</h1>
      </div>

      <nav className="flex-1 space-y-1">
        <SidebarItem icon={<Home size={18} />} label="HOME" href="/" />
        <SidebarItem icon={<FileText size={18} />} label="MY RECORDS" href="/records" />
        <SidebarItem icon={<ClipboardList size={18} />} label="REQUESTS" href="/requests" active />
        <SidebarItem icon={<MessageSquare size={18} />} label="CHAT" href="/chat" />
        <SidebarItem icon={<Lightbulb size={18} />} label="TIPS" href="/tips" />
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
    <div className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
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
          <span className="text-xs">🔔</span>
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
        <MobileMenuItem icon={<Home size={18} />} label="HOME" href="/" onClick={onClose} />
        <MobileMenuItem icon={<FileText size={18} />} label="MY RECORDS" href="/records" onClick={onClose} />
        <MobileMenuItem icon={<ClipboardList size={18} />} label="REQUESTS" href="/requests" active onClick={onClose} />
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

function SidebarItem({ icon, label, href, active = false }: { icon: React.ReactNode; label: string; href: string; active?: boolean }) {
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
    <div className="hidden lg:block bg-white border-b border-gray-200 px-4 md:px-8 py-4">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-8 overflow-x-auto">
          <Link href="/" className="text-xs md:text-sm font-semibold text-gray-600 hover:text-gray-900 whitespace-nowrap">HOME</Link>
          <Link href="/requests" className="text-xs md:text-sm font-semibold text-gray-900 border-b-2 border-teal-600 pb-1 whitespace-nowrap">Requests</Link>
          <Link href="/records" className="text-xs md:text-sm font-semibold text-gray-600 hover:text-gray-900 whitespace-nowrap">My Records</Link>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <span className="text-sm">🔔</span>
          </button>
          <button className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">SJ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">Welcome back</p>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Service Requests</h1>
      <p className="text-xs md:text-sm text-gray-600 leading-relaxed max-w-2xl">
        Request official documents and health summaries for you and your baby. Simply upload, verify, and download digitally.
      </p>
    </div>
  );
}

function NewRequestForm() {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="mb-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Step 01/03</p>
        <h2 className="text-lg md:text-xl font-bold text-gray-900">Start New Request</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Service</label>
          <div className="relative">
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option>Select a service...</option>
              <option>Birth Certificate</option>
              <option>Health Summary</option>
              <option>Immunization Record</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Upload ID Copy</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 md:p-8 text-center hover:border-teal-300 transition-colors cursor-pointer">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-3">
                <Upload size={20} className="text-teal-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Drag and drop <span className="text-teal-600 underline">or click</span> to upload</p>
              <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG</p>
            </div>
          </div>
        </div>

        <button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3.5 rounded-xl transition-colors">
          Submit Request
        </button>
      </div>
    </div>
  );
}

function RequestHistory() {
  return (
    <div className="mt-6 md:mt-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">Request History</h3>
          <p className="text-xs text-gray-500 mt-1">Track all your submitted requests</p>
        </div>
        <button className="text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-wider">
          View All →
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 md:px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Service</th>
              <th className="text-left px-4 md:px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Request ID</th>
              <th className="text-left px-4 md:px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
              <th className="text-left px-4 md:px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 md:px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            <RequestRow 
              service="Birth Certificate"
              requestId="REQ-2023-001"
              date="Oct 12, 2023"
              status="Approved"
              statusColor="green"
            />
            <RequestRow 
              service="Health Summary"
              requestId="REQ-2023-002"
              date="Nov 02, 2023"
              status="Pending"
              statusColor="blue"
            />
            <RequestRow 
              service="Immunization Record"
              requestId="REQ-2023-003"
              date="Nov 08, 2023"
              status="Rejected"
              statusColor="red"
            />
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        <RequestCard 
          service="Birth Certificate"
          requestId="REQ-2023-001"
          date="Oct 12, 2023"
          status="Approved"
          statusColor="green"
        />
        <RequestCard 
          service="Health Summary"
          requestId="REQ-2023-002"
          date="Nov 02, 2023"
          status="Pending"
          statusColor="blue"
        />
        <RequestCard 
          service="Immunization Record"
          requestId="REQ-2023-003"
          date="Nov 08, 2023"
          status="Rejected"
          statusColor="red"
        />
      </div>
    </div>
  );
}

function RequestRow({ service, requestId, date, status, statusColor }: { service: string; requestId: string; date: string; status: string; statusColor: string }) {
  const statusColors = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700"
  };

  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <FileCheck size={18} className="text-gray-600" />
          </div>
          <span className="text-sm font-semibold text-gray-900">{service}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{requestId}</td>
      <td className="px-6 py-4 text-sm text-gray-600">{date}</td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColors[statusColor as keyof typeof statusColors]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
          <Eye size={16} className="text-gray-600" />
        </button>
      </td>
    </tr>
  );
}

function RequestCard({ service, requestId, date, status, statusColor }: { service: string; requestId: string; date: string; status: string; statusColor: string }) {
  const statusColors = {
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700"
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileCheck size={18} className="text-gray-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{service}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{requestId}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[statusColor as keyof typeof statusColors]}`}>
          {status}
        </span>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-600">{date}</span>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
          <Eye size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function QuickTipCard() {
  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl p-6 text-white shadow-lg h-fit lg:sticky lg:top-6">
      <h3 className="text-lg font-bold mb-3">Quick Tip</h3>
      <p className="text-sm text-teal-100 leading-relaxed mb-6">
        Make sure your uploaded documents are clear and all 4 corners are visible. This ensures faster processing and approval.
      </p>
      <div className="space-y-3">
        <TipItem icon={<FileCheck size={16} />} text="Upload ID Card" />
        <TipItem icon={<Calendar size={16} />} text="Provide Booking Summary" />
        <TipItem icon={<FileText size={16} />} text="Maintain Certificate Readiness" />
      </div>
    </div>
  );
}

function TipItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <span className="text-teal-100">{text}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pt-12 mt-12 border-t border-gray-200">
      <div className="flex flex-wrap justify-center gap-6 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
        <a href="#" className="hover:text-gray-600">Support</a>
        <a href="#" className="hover:text-gray-600">Privacy Policy</a>
        <a href="#" className="hover:text-gray-600">Terms of Service</a>
        <a href="#" className="hover:text-gray-600">Emergency Contacts</a>
      </div>
      <p className="text-center text-[9px] text-gray-300 uppercase tracking-widest font-bold mt-4">
        © 2024 Maternal Sanctuary Health System
      </p>
    </footer>
  );
}
