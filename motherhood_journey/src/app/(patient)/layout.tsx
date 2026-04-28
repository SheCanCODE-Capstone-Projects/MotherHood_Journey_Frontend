"use client";

import Link from "next/link";
import { Bell, User, Home, FolderOpen, ClipboardList, MessageSquare, HelpCircle, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFA] text-slate-900 font-sans flex flex-col selection:bg-[#0D474F] selection:text-white">
      
      {/* Top Navigation */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2 text-[#0D474F] font-extrabold text-xl tracking-tight">
            <div className="w-8 h-8 bg-[#0D474F] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#0D474F]/20">
              <span className="text-lg">M</span>
            </div>
            <span className="hidden sm:inline">Maternal Sanctuary</span>
          </div>
        </div>
        
        <nav className="hidden lg:flex items-center gap-10 text-[13px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/dashboard" className="hover:text-[#0D474F] transition-all hover:scale-105">Home</Link>
          <Link href="/records" className="hover:text-[#0D474F] transition-all hover:scale-105">My Records</Link>
          <Link href="/requests" className="text-[#0D474F] border-b-2 border-[#0D474F] pb-1">Requests</Link>
          <Link href="/chat" className="hover:text-[#0D474F] transition-all hover:scale-105">Chat</Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-5">
          <button className="relative p-2.5 text-slate-400 hover:text-[#0D474F] hover:bg-slate-50 rounded-full transition-all group">
            <Bell size={20} className="group-hover:rotate-12" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>
          <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
          <button className="flex items-center gap-3 group px-1 py-1 rounded-full hover:bg-slate-50 transition-all">
            <div className="w-9 h-9 bg-[#0D474F]/5 rounded-full flex items-center justify-center overflow-hidden border border-slate-100 group-hover:border-[#0D474F]/30 transition-all">
              <User size={18} className="text-[#0D474F]" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black text-slate-800 leading-none">Elena R. Chen</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-tighter font-bold">Patient Member</p>
            </div>
          </button>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full relative">
        
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* Sidebar - Responsive Mobile & Desktop */}
        <aside className={`
          fixed lg:sticky top-[73px] h-[calc(100vh-73px)] z-[56] lg:z-40 transition-all duration-500 ease-in-out
          ${isMobileMenuOpen ? "left-0" : "-left-full lg:left-0"}
          w-[280px] lg:w-72 flex-shrink-0 p-4 lg:p-6
        `}>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl lg:shadow-sm border border-slate-50 h-full flex flex-col">
            <div className="mb-10 px-2">
              <h2 className="text-xl font-black text-[#0D474F] tracking-tight leading-none">Maternal <br />Sanctuary</h2>
              <p className="text-[9px] uppercase tracking-[0.2em] text-slate-300 mt-2 font-bold">YOUR ADVENTURE LOG 2026</p>
            </div>

            <nav className="space-y-1.5 flex-1">
              <SidebarLink onClick={() => setIsMobileMenuOpen(false)} href="/dashboard" icon={<Home size={18} />} label="HOME" active />
              <SidebarLink onClick={() => setIsMobileMenuOpen(false)} href="/records" icon={<FolderOpen size={18} />} label="MY RECORDS" />
              <SidebarLink onClick={() => setIsMobileMenuOpen(false)} href="/requests" icon={<ClipboardList size={18} />} label="REQUESTS" />
              <SidebarLink onClick={() => setIsMobileMenuOpen(false)} href="/chat" icon={<MessageSquare size={18} />} label="CHAT" />
              <SidebarLink onClick={() => setIsMobileMenuOpen(false)} href="/tips" icon={<HelpCircle size={18} />} label="TIPS" />
            </nav>

            <div className="mt-auto pt-8 border-t border-slate-50">
              <div className="flex items-center gap-3 px-2 group cursor-pointer">
                <div className="w-10 h-10 bg-[#0D474F] rounded-2xl flex items-center justify-center text-white text-xs font-bold overflow-hidden border-2 border-slate-100 group-hover:scale-105 transition-all">
                   <User size={20} />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Now</p>
                  <p className="text-xs font-extrabold text-slate-800 group-hover:text-[#0D474F] transition-colors">Elena R. Chen</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-4 md:p-10 lg:p-12 transition-all duration-500 ${isMobileMenuOpen ? "blur-sm lg:blur-none" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, icon, label, active = false, onClick }: { href: string; icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 text-[11px] font-black rounded-2xl transition-all duration-300 group ${
        active 
          ? "bg-[#0D474F]/5 text-[#0D474F]" 
          : "text-slate-300 hover:bg-slate-50 hover:text-[#0D474F]"
      }`}
    >
      <span className={`${active ? "text-[#0D474F]" : "text-slate-300 group-hover:text-[#0D474F]"} transition-colors`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}



