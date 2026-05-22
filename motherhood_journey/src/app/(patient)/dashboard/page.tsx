"use client";

import { Plus, MessageCircle, Calendar, User, Phone, Mail, Baby, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useActivePregnancy, useMotherChildren, useNextAppointment } from "../../../hooks/useDashboard";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  return (
    <div className="space-y-4 md:space-y-6">
      <TopSection />
      <MiddleSection />
      <BottomSection />
      <Footer />
    </div>
  );
}

function TopSection() {
  return (
    <div className="space-y-4 md:space-y-5">
      <ActivePregnancyCard />
      <ChildrenListSummary />
      <NextAppointmentCard />
    </div>
  );
}

function ActivePregnancyCard() {
  const router = useRouter();
  const { data: pregnancy, isLoading, error } = useActivePregnancy();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl md:rounded-[28px] p-6 md:p-8 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-32 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
        <div className="flex gap-4">
          <div className="h-16 bg-gray-200 rounded w-24"></div>
          <div className="flex-1 h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !pregnancy) {
    return (
      <div className="bg-white rounded-2xl md:rounded-[28px] p-6 md:p-8 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">No active pregnancy found</p>
      </div>
    );
  }

  const calculateDaysLeft = (edd: string) => {
    const today = new Date();
    const dueDate = new Date(edd);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysLeft = calculateDaysLeft(pregnancy.edd);
  const progressPercentage = ((40 - (daysLeft / 7)) / 40) * 100;

  const handleContactCHW = () => {
    router.push(`/chat?chw=${pregnancy.assignedCHW.id}`);
  };

  const handleAddToCalendar = () => {
    const eddDate = new Date(pregnancy.edd);
    const title = 'Expected Delivery Date';
    const details = `Your baby is expected to arrive on ${eddDate.toLocaleDateString()}`;
    
    const startDate = eddDate.toISOString().replace(/-|:|\.\d+/g, '');
    const endDate = new Date(eddDate.getTime() + 24 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}`;
    
    window.open(calendarUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl md:rounded-[28px] p-6 md:p-8 shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div>
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Active Pregnancy</p>
            <button
              onClick={handleAddToCalendar}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-[10px] font-bold transition-colors"
            >
              <Calendar size={12} />
              <span>Add to Calendar</span>
            </button>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Hello, {pregnancy.motherName || 'Divine'}</h3>
          <p className="text-base font-semibold text-teal-700 mb-2">Week {pregnancy.weekNumber}</p>
          <p className="text-xs md:text-sm text-gray-600 mb-6 md:mb-8 leading-relaxed">
            You're in <span className="font-semibold text-gray-900">Trimester {pregnancy.trimester}</span> of your pregnancy journey.
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-teal-700 mb-1">{daysLeft}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Days Until EDD</p>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600 rounded-full transition-all" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="text-[9px] text-gray-500 mt-2">EDD: {new Date(pregnancy.edd).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-teal-700 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-white/60 uppercase tracking-wider">Assigned CHW</p>
              <h4 className="text-base font-bold">{pregnancy.assignedCHW.name}</h4>
            </div>
          </div>
          <div className="space-y-2.5 pt-3 border-t border-white/10">
            <a 
              href={`tel:${pregnancy.assignedCHW.phone}`}
              className="flex items-center gap-2.5 hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <Phone size={14} className="text-teal-200" />
              <span className="text-xs text-teal-100">{pregnancy.assignedCHW.phone}</span>
            </a>
            <a 
              href={`mailto:${pregnancy.assignedCHW.email}`}
              className="flex items-center gap-2.5 hover:bg-white/5 p-2 rounded-lg transition-colors"
            >
              <Mail size={14} className="text-teal-200" />
              <span className="text-xs text-teal-100">{pregnancy.assignedCHW.email}</span>
            </a>
          </div>
          <button 
            onClick={handleContactCHW}
            className="w-full mt-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors"
          >
            Contact CHW
          </button>
        </div>
      </div>
    </div>
  );
}

function ChildrenListSummary() {
  const { data: children, isLoading, error } = useMotherChildren();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !children || children.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-2">Children</h3>
        <p className="text-sm text-gray-500">No children registered yet</p>
      </div>
    );
  }

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''}`;
  };

  const vaccinationStatusColors = {
    UP_TO_DATE: 'bg-green-100 text-green-800',
    PENDING: 'bg-amber-100 text-amber-800',
    OVERDUE: 'bg-red-100 text-red-800',
  };

  const vaccinationStatusLabels = {
    UP_TO_DATE: 'Up to Date',
    PENDING: 'Pending',
    OVERDUE: 'Overdue',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Children</h3>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {children.length} {children.length === 1 ? 'Child' : 'Children'}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {children.map((child) => (
          <Link
            key={child.id}
            href={`/children/${child.id}`}
            className="border border-gray-200 rounded-xl p-4 hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Baby size={18} className="text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-teal-700 transition-colors">
                  {child.firstName} {child.lastName}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{calculateAge(child.dateOfBirth)}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${vaccinationStatusColors[child.vaccinationStatus]}`}>
                  {vaccinationStatusLabels[child.vaccinationStatus]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NextAppointmentCard() {
  const router = useRouter();
  const { data: appointment, isLoading, error } = useNextAppointment();

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-base font-bold text-gray-900 mb-2">Next Appointment</h3>
        <p className="text-sm text-gray-500">No upcoming appointments scheduled</p>
      </div>
    );
  }

  const handleViewDetails = () => {
    router.push(`/appointments/${appointment.id}`);
  };

  return (
    <div className="bg-gradient-to-br from-teal-700 to-teal-800 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-2">Next Appointment</p>
          <h3 className="text-xl font-bold mb-1">{appointment.appointmentType}</h3>
          <p className="text-sm text-teal-100">with {appointment.doctorName}</p>
        </div>
        <button 
          onClick={handleViewDetails}
          className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Calendar size={20} className="text-white" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2.5">
          <Calendar size={16} className="text-teal-200" />
          <div>
            <p className="text-[9px] text-teal-200 uppercase tracking-wide">Date</p>
            <p className="text-sm font-bold">{new Date(appointment.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock size={16} className="text-teal-200" />
          <div>
            <p className="text-[9px] text-teal-200 uppercase tracking-wide">Time</p>
            <p className="text-sm font-bold">{appointment.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <MapPin size={16} className="text-teal-200" />
          <div>
            <p className="text-[9px] text-teal-200 uppercase tracking-wide">Facility</p>
            <p className="text-sm font-bold">{appointment.facilityName}</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleViewDetails}
        className="w-full mt-5 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors"
      >
        View Details
      </button>
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
  const router = useRouter();
  
  return (
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4 px-1">Quick Actions</p>
      <div className="space-y-3">
        <Link href="/requests">
          <ActionButton 
            icon={<Plus size={18} />} 
            label="Request Service" 
            sublabel="Submit new request"
            color="teal"
          />
        </Link>
        <Link href="/chat">
          <ActionButton 
            icon={<MessageCircle size={18} />} 
            label="Chat with CHW" 
            sublabel="Get instant support"
            color="teal"
          />
        </Link>
        <Link href="/mothers/mother-1">
          <ActionButton 
            icon={<User size={18} />} 
            label="View Profile" 
            sublabel="Mother profile"
            color="teal"
          />
        </Link>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, sublabel, color }: { icon: React.ReactNode; label: string; sublabel: string; color: string }) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-3 text-left group cursor-pointer">
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
    </div>
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
          imagePath="/imagefood.webp"
        />
        <ContentCard 
          title="Managing Sleep Positions" 
          imagePath="/sleepPosition.png"
        />
      </div>
    </div>
  );
}

function ContentCard({ title, imagePath }: { title: string; imagePath: string }) {
  return (
    <Link href="/tips" className="bg-teal-700 rounded-2xl overflow-hidden shadow-lg h-44 relative group cursor-pointer hover:shadow-xl transition-shadow block">
      <img 
        src={imagePath} 
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h4 className="text-white font-semibold text-base relative z-10 group-hover:translate-x-1 transition-transform">{title}</h4>
      </div>
    </Link>
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
    <Link href="/records" className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-500 transition-all block group">
      <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 md:mb-3">{label}</p>
      <div className="mb-1 md:mb-2">
        <span className="text-2xl md:text-3xl font-bold text-teal-700 group-hover:text-teal-800 transition-colors">{value}</span>
        {unit && <span className="text-xs md:text-sm font-semibold text-gray-500 ml-1">{unit}</span>}
      </div>
      <p className="text-[9px] md:text-[10px] font-semibold text-gray-500">{status}</p>
    </Link>
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
