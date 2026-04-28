"use client";

import { 
  Plus, 
  Stethoscope, 
  Building2, 
  Users2, 
  ChevronRight, 
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function ServiceRequestsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const openRequestForm = (providerId: string | null = null) => {
    setSelectedProvider(providerId);
    setIsModalOpen(true);
  };

  const serviceProviders = [
    {
      id: "hospital",
      title: "Hospital Services",
      description: "Clinical appointments, scans, and emergency checkups.",
      icon: <Stethoscope size={24} />,
      color: "bg-blue-50 text-blue-600",
      stats: "12 Services available"
    },
    {
      id: "government",
      title: "Government Programs",
      description: "Maternity benefits, birth registration, and food support.",
      icon: <Building2 size={24} />,
      color: "bg-amber-50 text-amber-600",
      stats: "8 Programs active"
    },
    {
      id: "chw",
      title: "CHW Support",
      description: "Home visits, breastfeeding support, and health education.",
      icon: <Users2 size={24} />,
      color: "bg-[#0D474F]/10 text-[#0D474F]",
      stats: "Your local CHW is Online"
    }
  ];

  const recentRequests = [
    {
      id: "REQ-001",
      service: "Home Visit for Prenatal Checkup",
      provider: "CHW Support",
      date: "Oct 28, 2024",
      status: "Pending",
      icon: <Users2 size={18} />
    },
    {
      id: "REQ-002",
      service: "Maternity Benefit Application",
      provider: "Government",
      date: "Oct 25, 2024",
      status: "Approved",
      icon: <Building2 size={18} />
    },
    {
      id: "REQ-003",
      service: "Ultrasound Appointment",
      provider: "City Hospital",
      date: "Oct 20, 2024",
      status: "Completed",
      icon: <Stethoscope size={18} />
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative">
      
      {/* Request Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#0D474F]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-[#0D474F] tracking-tight">New Service Request</h2>
                  <p className="text-slate-400 text-sm mt-1 font-medium">Please select a provider and service details.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-300 hover:text-slate-600"
                >
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Provider Selection */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">1. SELECT PROVIDER</p>
                  <div className="grid grid-cols-3 gap-3">
                    {["hospital", "government", "chw"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setSelectedProvider(p)}
                        className={`py-4 rounded-2xl border-2 transition-all font-bold text-xs uppercase tracking-wider ${
                          selectedProvider === p 
                            ? "border-[#0D474F] bg-[#0D474F]/5 text-[#0D474F]" 
                            : "border-slate-50 text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Form Fields based on provider */}
                {selectedProvider && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">2. SERVICE DETAILS</p>
                      
                      {selectedProvider === "hospital" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormSelect label="Appointment Type" options={["Ultrasound", "Consultation", "Lab Test", "Vaccination"]} />
                          <FormInput label="Preferred Date" type="date" />
                          <div className="md:col-span-2">
                            <FormTextarea label="Describe your symptoms or reason for visit" />
                          </div>
                        </div>
                      )}

                      {selectedProvider === "government" && (
                        <div className="grid grid-cols-1 gap-4">
                          <FormSelect label="Select Program" options={["Maternity Benefits", "Insurance Registration", "Child Birth Certificate", "Nutrition Support"]} />
                          <FormInput label="National ID / Member ID" placeholder="Enter identification number" />
                          <FormTextarea label="Additional details (optional)" />
                        </div>
                      )}

                      {selectedProvider === "chw" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormSelect label="Reason for Visit" options={["Home Checkup", "Breastfeeding Support", "Vaccination Advice", "Mental Health"]} />
                          <FormSelect label="Urgency" options={["Routine", "High Priority", "Urgent"]} />
                          <div className="md:col-span-2">
                            <FormTextarea label="Message for your CHW" />
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="w-full bg-[#0D474F] text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-[#156F7A] transition-all shadow-xl shadow-[#0D474F]/20 active:scale-[0.98]"
                    >
                      SUBMIT REQUEST
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-[#0D474F] tracking-tight">Service Requests</h1>
          <p className="text-slate-500 max-w-lg text-sm leading-relaxed">
            Connect with your healthcare ecosystem. Request support from hospitals, 
            government programs, or your community health worker.
          </p>
        </div>
        <button 
          onClick={() => openRequestForm()}
          className="flex items-center gap-3 bg-[#0D474F] hover:bg-[#156F7A] text-white px-8 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-[#0D474F]/20 transition-all hover:-translate-y-1 active:translate-y-0 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          CREATE NEW REQUEST
        </button>
      </div>

      {/* Service Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {serviceProviders.map((provider) => (
          <div 
            key={provider.id}
            onClick={() => openRequestForm(provider.id)}
            className="group bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#0D474F]/20 transition-all cursor-pointer flex flex-col relative overflow-hidden"
          >
            <div className={`w-14 h-14 ${provider.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {provider.icon}
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">{provider.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
              {provider.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {provider.stats}
              </span>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#0D474F] group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </div>
            </div>

            {/* Decorative background circle */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#0D474F]/5 rounded-full blur-2xl group-hover:bg-[#0D474F]/10 transition-colors"></div>
          </div>
        ))}
      </div>

      {/* Main Section: Tracking & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Active Tracking */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Clock className="text-[#0D474F]" />
                Recent Requests
              </h2>
              <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
                <button 
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "all" ? "bg-white text-[#0D474F] shadow-sm" : "text-slate-400"}`}
                >
                  ALL
                </button>
                <button 
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "pending" ? "bg-white text-[#0D474F] shadow-sm" : "text-slate-400"}`}
                >
                  PENDING
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {recentRequests.map((req) => (
                <div key={req.id} className="flex items-center gap-4 p-5 hover:bg-slate-50 rounded-[1.5rem] transition-all group border border-transparent hover:border-slate-100">
                  <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center ${
                    req.status === "Pending" ? "bg-amber-50 text-amber-600" : 
                    req.status === "Approved" ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
                  }`}>
                    {req.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{req.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        req.status === "Pending" ? "bg-amber-100 text-amber-700" : 
                        req.status === "Approved" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 truncate">{req.service}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{req.provider} • {req.date}</p>
                  </div>
                  <button className="hidden md:flex items-center gap-2 text-xs font-bold text-[#0D474F] hover:underline">
                    VIEW DETAILS <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-4 text-xs font-bold text-slate-400 hover:text-[#0D474F] transition-colors border-t border-slate-50">
              VIEW FULL REQUEST HISTORY
            </button>
          </div>
        </div>

        {/* Right: Quick Resources & Help */}
        <div className="lg:col-span-4 space-y-6">
          {/* Emergency Card */}
          <div className="bg-[#0D474F] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-[#0D474F]/30 group">
            <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
              <AlertCircle size={150} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Emergency Help</h3>
              <p className="text-sm text-teal-100 leading-relaxed mb-8">
                If you are experiencing severe pain or bleeding, please contact 
                the hospital emergency line immediately.
              </p>
              <button className="w-full bg-white text-[#0D474F] py-4 rounded-2xl text-sm font-extrabold hover:bg-teal-50 transition-all active:scale-95 shadow-lg">
                CALL NOW: +250 112
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Need Guidance?</h3>
            <div className="space-y-4">
              <HelpItem 
                title="How to request benefits" 
                subtitle="Government support guide" 
                icon={<MapPin size={18} />} 
              />
              <HelpItem 
                title="When to call a CHW" 
                subtitle="Community support rules" 
                icon={<Users2 size={18} />} 
              />
              <HelpItem 
                title="Hospital Map" 
                subtitle="Locate nearest facilities" 
                icon={<MapPin size={18} />} 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function HelpItem({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-[#0D474F]/10 group-hover:text-[#0D474F] transition-all">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{subtitle}</p>
      </div>
    </div>
  );
}

/* Form Helper Components */

function FormInput({ label, type = "text", placeholder }: { label: string; type?: string; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D474F]/20 focus:border-[#0D474F] transition-all"
      />
    </div>
  );
}

function FormSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D474F]/20 focus:border-[#0D474F] transition-all appearance-none cursor-pointer">
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function FormTextarea({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <textarea 
        rows={4}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D474F]/20 focus:border-[#0D474F] transition-all resize-none"
        placeholder="Type here..."
      />
    </div>
  );
}

