"use client";

import { Home, FileText, ClipboardList, MessageSquare, Lightbulb, Download, Calendar, User as UserIcon, Activity, ChevronRight, CheckCircle, MapPin } from "lucide-react";
import Link from "next/link";

export default function RecordsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1">
        <TopBar />
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 md:gap-6">
            <div>
              <Header />
              <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 md:gap-5 mt-4 md:mt-6">
                <HealthCard />
                <VaccinationCard />
              </div>
              <PastVisits />
              <ConsolidatedInsights />
            </div>
            <DownloadButton />
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[200px] bg-white flex-col py-5 px-3 border-r border-gray-100">
      <div className="px-2 mb-6">
        <h1 className="text-xs font-bold text-gray-900">Maternal Sanctuary</h1>
      </div>

      <nav className="flex-1 space-y-0.5">
        <SidebarItem icon={<Home size={15} />} label="HOME" href="/" />
        <SidebarItem icon={<FileText size={15} />} label="MY RECORDS" href="/records" active />
        <SidebarItem icon={<ClipboardList size={15} />} label="REQUESTS" href="/requests" />
        <SidebarItem icon={<MessageSquare size={15} />} label="CHAT" href="/chat" />
        <SidebarItem icon={<Lightbulb size={15} />} label="TIPS" href="/tips" />
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label, href, active = false }: { icon: React.ReactNode; label: string; href: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[10px] font-semibold transition-colors ${
        active ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function TopBar() {
  return (
    <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-6 overflow-x-auto">
          <Link href="/" className="text-xs font-medium text-gray-500 whitespace-nowrap">Home</Link>
          <Link href="/records" className="text-xs font-semibold text-gray-900 border-b-2 border-teal-600 pb-2.5 whitespace-nowrap">My Records</Link>
          <Link href="/requests" className="text-xs font-medium text-gray-500 whitespace-nowrap">Requests</Link>
          <Link href="/chat" className="text-xs font-medium text-gray-500 whitespace-nowrap">Chat</Link>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-xs">🔔</span>
          </button>
          <button className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-[9px] font-bold">EC</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div>
      <p className="text-[9px] text-gray-500 mb-1">Welcome back</p>
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1.5">Clinical History</h1>
      <p className="text-[10px] md:text-[11px] text-gray-600 leading-relaxed">
        Access your complete medical history, from prenatal checkups to pediatric immunizations.<br className="hidden md:block" />
        Download official documents and track your family's health journey.
      </p>
    </div>
  );
}

function HealthCard() {
  return (
    <div className="bg-gradient-to-br from-teal-800 to-teal-900 rounded-2xl p-5 text-white shadow-sm relative overflow-hidden h-[260px]">
      <div className="absolute top-3 left-3 w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
        <Activity size={18} />
      </div>
      
      <div className="absolute top-4 right-4 text-right opacity-30">
        <div className="text-[8px] font-bold tracking-wide">MOTHERHOOD</div>
        <div className="text-[10px] font-bold tracking-wide">SANCTUARY</div>
      </div>

      <div className="absolute bottom-16 left-5">
        <p className="text-sm font-bold mb-0.5">Elena Rodriguez-Chan</p>
        <p className="text-[9px] text-teal-200 mb-2">Patient ID</p>
        <p className="text-xs font-medium">925-882-9418</p>
        <p className="text-[9px] text-teal-200 mt-3">01 Position</p>
      </div>

      <div className="absolute bottom-4 left-5 flex items-center gap-2">
        <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <FileText size={13} />
        </div>
        <div className="text-[9px] leading-tight opacity-70">
          <div className="font-bold">SANCTUARY</div>
        </div>
      </div>
    </div>
  );
}

function VaccinationCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-0.5">Child's Vaccination Card</h3>
          <p className="text-[9px] text-gray-500">Track immunization records and upcoming shots</p>
        </div>
        <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[8px] font-bold rounded-full uppercase">Verified</span>
      </div>

      <div className="space-y-2.5">
        <VaccineItem 
          name="Hepatitis B (HepB)"
          subtitle="Protects against liver infection"
          completed
        />
        <VaccineItem 
          name="Rotavirus (RV)"
          subtitle="Prevents severe diarrhea"
          completed
        />
        <VaccineItem 
          name="Diphtheria, Tetanus (DTaP)"
          subtitle="Combo vaccine"
          date="Mar 18"
        />
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center">
        <p className="text-[8px] text-gray-400">Updated for Week 4 • January 2024</p>
      </div>
    </div>
  );
}

function VaccineItem({ name, subtitle, completed = false, date }: { name: string; subtitle: string; completed?: boolean; date?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${completed ? 'bg-green-50' : 'bg-blue-50'}`}>
          {completed ? (
            <CheckCircle size={14} className="text-green-600" />
          ) : (
            <Calendar size={12} className="text-blue-600" />
          )}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-gray-900">{name}</p>
          <p className="text-[9px] text-gray-500">{subtitle}</p>
        </div>
      </div>
      <button className="w-6 h-6 rounded-lg hover:bg-gray-50 flex items-center justify-center">
        <ChevronRight size={13} className="text-gray-400" />
      </button>
    </div>
  );
}

function PastVisits() {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Past Visits & Clinical Summaries</h3>
        <button className="text-[9px] font-bold text-teal-600 uppercase tracking-wide">
          View All →
        </button>
      </div>

      <div className="space-y-3">
        <VisitCard 
          title="Postnatal Check"
          type="Clinical Summary"
          description="Routine postnatal checkup confirmed. Vitals are stable. Discussed nutrition as outlined for postpartum recovery including 2 key steps."
          date="Oct 10, 2023"
          doctor="Dr. Sarah Chen"
          location="On-Site Exam"
        />
        <VisitCard 
          title="Newborn Well-Visit"
          type="Clinical Summary"
          description="Newborn assessment for 2-week old. Baby vitals and feeding status are strong and consistent. Immunization and parental briefing completed."
          date="Sep 28, 2023"
          doctor="Dr. Michael Torres"
          location="On-Site Exam"
        />
        <VisitCard 
          title="Final Prenatal"
          type="Clinical Summary"
          description="Final prenatal checkup before delivery is scheduled. All test results indicate healthy delivery. Prep. emergency contact updated."
          date="Sep 15, 2023"
          doctor="Dr. Helena Smith"
          location="On-Site Exam"
        />
      </div>
    </div>
  );
}

function VisitCard({ title, type, description, date, doctor, location }: { title: string; type: string; description: string; date: string; doctor: string; location: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="text-xs font-bold text-gray-900 mb-0.5">{title}</h4>
          <p className="text-[9px] text-gray-500 font-medium">{type}</p>
        </div>
        <div className="text-right ml-4">
          <div className="flex items-center gap-1 text-[9px] text-gray-500 mb-0.5">
            <MapPin size={9} />
            <span>{location}</span>
          </div>
          <div className="text-[10px] font-bold text-gray-900">{date}</div>
        </div>
      </div>
      <p className="text-[10px] text-gray-600 leading-relaxed mb-3">{description}</p>
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
            <UserIcon size={11} className="text-gray-600" />
          </div>
          <span className="text-[9px] text-gray-600 font-medium">{doctor}</span>
        </div>
        <button className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 text-[9px] font-bold text-gray-700 rounded-md transition-colors">
          ACCESS
        </button>
      </div>
    </div>
  );
}

function ConsolidatedInsights() {
  return (
    <div className="mt-6 bg-gradient-to-br from-teal-800 to-teal-900 rounded-2xl p-6 text-white shadow-sm">
      <h3 className="text-lg font-bold mb-1.5">Consolidated Health Insights</h3>
      <p className="text-[10px] text-teal-100 mb-6 leading-relaxed">
        See your complete insights data generated in real-time. Your personal<br />
        checkups to 100% health and wellness tracking.
      </p>

      <div className="flex items-center justify-between">
        <div className="space-y-5">
          <div>
            <p className="text-3xl font-bold mb-0.5">98%</p>
            <p className="text-[9px] text-teal-200">Health Score</p>
          </div>
          <div>
            <p className="text-3xl font-bold mb-0.5">04</p>
            <p className="text-[9px] text-teal-200">Visits This Year</p>
          </div>
        </div>

        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.15)" strokeWidth="9" fill="none" />
            <circle cx="64" cy="64" r="54" stroke="white" strokeWidth="9" fill="none" strokeDasharray="339.3" strokeDashoffset="51" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold">85%</p>
              <p className="text-[9px] text-teal-200 mt-0.5">Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadButton() {
  return (
    <div className="lg:sticky lg:top-6 h-fit">
      <button className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 px-5 rounded-2xl transition-colors shadow-md text-xs leading-tight">
        Download Full<br />Summary
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="pt-10 mt-10 border-t border-gray-200">
      <div className="flex flex-wrap justify-center gap-5 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
        <a href="#" className="hover:text-gray-600">Support</a>
        <a href="#" className="hover:text-gray-600">Privacy Policy</a>
        <a href="#" className="hover:text-gray-600">Terms of Service</a>
        <a href="#" className="hover:text-gray-600">Emergency Contacts</a>
      </div>
      <p className="text-center text-[8px] text-gray-300 uppercase tracking-widest font-bold mt-3">
        © 2024 Maternal Sanctuary Health System
      </p>
    </footer>
  );
}
