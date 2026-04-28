"use client";

import { 
  Download, 
  FileText, 
  ChevronRight, 
  Activity, 
  Calendar,
  User,
  ShieldCheck,
  QrCode,
  ArrowDownToLine,
  CheckCircle2,
  PieChart
} from "lucide-react";

export default function ClinicalHistoryPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-[#0D474F] tracking-tight">Clinical History</h1>
          <p className="text-slate-500 max-w-lg text-sm leading-relaxed">
            Access your complete maternal journey, from Motherhood ID to pediatric immunization 
            records, all in one secure place.
          </p>
        </div>
        <button className="flex items-center gap-3 bg-[#0D474F] hover:bg-[#156F7A] text-white px-6 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-[#0D474F]/20 transition-all hover:-translate-y-1 group">
          <ArrowDownToLine size={20} className="group-hover:translate-y-1 transition-transform" />
          DOWNLOAD PDF SUMMARY
        </button>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Motherhood Sanctuary ID Card */}
        <div className="bg-[#0D474F] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-[#0D474F]/40 group border border-white/10 animate-in slide-in-from-left-8 duration-700">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-30"></div>
          {/* Logo/Watermark background */}
          <div className="absolute right-[-40px] top-[-40px] opacity-[0.08] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-[2000ms]">
            <ShieldCheck size={350} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
                  <ShieldCheck size={28} className="text-teal-300" />
                </div>
                <div>
                  <h3 className="font-black tracking-[0.3em] text-[9px] uppercase opacity-60">MOTHERHOOD</h3>
                  <p className="text-[11px] font-black tracking-[0.15em] uppercase text-teal-100">SANCTUARY REGISTRY</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black uppercase opacity-40 mb-1 tracking-widest">Status</p>
                <span className="text-[10px] font-black bg-teal-400/20 text-teal-300 px-3 py-1 rounded-full border border-teal-400/30 shadow-sm animate-pulse">ACTIVE</span>
              </div>
            </div>

            <div className="mb-14">
              <h2 className="text-4xl font-black tracking-tighter mb-1.5 drop-shadow-sm">Elena Rodriguez-Chen</h2>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-400 rounded-full"></div>
                <p className="text-teal-200 text-[10px] font-black tracking-[0.25em] uppercase">Maternal Health Record</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-50 mb-1 tracking-wider">ID NUMBER</p>
                <p className="text-lg font-mono font-bold tracking-widest">MS-842-9410</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase opacity-50 mb-1 tracking-wider">BLOOD TYPE</p>
                <p className="text-lg font-bold">O Positive</p>
              </div>
            </div>

            <div className="mt-auto flex items-end justify-between">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <QrCode size={48} className="opacity-90" />
              </div>
              <div className="text-right">
                <h4 className="text-2xl font-black tracking-tighter opacity-20 select-none">SANCTUARY</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Child's Vaccination Card */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Child's Vaccination Card</h3>
              <p className="text-xs text-slate-400 font-medium">Mateo's Immunization Status</p>
            </div>
            <span className="text-[10px] font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 uppercase tracking-widest">
              UP TO DATE
            </span>
          </div>

          <div className="space-y-5 flex-1">
            <VaccinationItem 
              name="Hepatitis B (HepB)" 
              date="Dose 1: Oct 20, 2024" 
              completed={true} 
            />
            <VaccinationItem 
              name="Rotavirus (RV)" 
              date="Dose 1: Oct 20, 2024" 
              completed={true} 
            />
            <VaccinationItem 
              name="Diphtheria, Tetanus (DTaP)" 
              date="Due in: 12 Days" 
              completed={false} 
            />
          </div>

          <button className="w-full mt-10 py-4 text-xs font-bold text-slate-400 hover:text-[#0D474F] border-t border-slate-50 transition-colors">
            VIEW FULL IMMUNIZATION RECORD
          </button>
        </div>

      </div>

      {/* Past Visits Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Past Visits & Clinical Summaries</h2>
          <button className="text-xs font-bold text-[#0D474F] hover:underline flex items-center gap-1">
            VIEW ALL <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <ClinicalVisitRow 
            date="OCT 24, 2024" 
            title="Postnatal Check" 
            summary="Second journey is progressing excellently. Vitals are stable. Discussed transition to solid foods for Mateo. No concerns regarding postpartum emotional well-being at this stage."
            doctor="Dr. Sarah Chen"
          />
          <ClinicalVisitRow 
            date="SEP 12, 2024" 
            title="Newborn Well-Visit" 
            summary="Mateo's weight gain is in the 75th percentile. Skin reflex normal. Recommended starting vitamin D drops. Breastfeeding technique continues to improve with minimal discomfort reported."
            doctor="Dr. Michael Bloom"
          />
          <ClinicalVisitRow 
            date="JULY 22, 2024" 
            title="Final Prenatal" 
            summary="Final 38-week visit. Fetal presentation is cephalic. Delivery team briefed. Birth plan reviewed and confirmed. Mother advised on early labor signs. Emergency contact verified."
            doctor="Obstetrics Dept."
          />
        </div>
      </div>

      {/* Health Insights Section */}
      <div className="bg-[#0D474F] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-[#0D474F]/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Consolidated Health Insights</h2>
              <p className="text-teal-100/70 text-sm max-w-md leading-relaxed">
                Our algorithmic engine analyze your prenatal and last 3 weeks data. Your recovery 
                trajectory is 12% faster than average for your demographic.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black tracking-tight mb-1">98%</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">RECOVERY PROGRESS</p>
              </div>
              <div>
                <p className="text-4xl font-black tracking-tight mb-1">04</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">UPCOMING TESTS</p>
              </div>
            </div>
          </div>

          <div className="w-48 h-48 relative flex items-center justify-center">
            <div className="absolute inset-0 border-[12px] border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-[12px] border-teal-400 rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'rotate(45deg)' }}></div>
            <div className="text-center">
              <p className="text-4xl font-black">85%</p>
              <p className="text-[10px] font-bold uppercase opacity-60">VITALITY</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function VaccinationItem({ name, date, completed }: { name: string; date: string; completed: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-teal-200 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
          {completed ? <CheckCircle2 size={20} /> : <Calendar size={20} />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{name}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{date}</p>
        </div>
      </div>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${completed ? "bg-green-500 text-white" : "border-2 border-slate-200"}`}>
        {completed && <CheckCircle2 size={14} />}
      </div>
    </div>
  );
}

function ClinicalVisitRow({ date, title, summary, doctor }: { date: string; title: string; summary: string; doctor: string }) {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 group hover:shadow-lg transition-all hover:border-[#0D474F]/20">
      <div className="md:w-32 flex-shrink-0">
        <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-1">{date}</p>
        <h4 className="text-lg font-bold text-[#0D474F]">{title}</h4>
      </div>
      
      <div className="flex-1 space-y-2">
        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CLINICAL SUMMARY</h5>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
          {summary}
        </p>
      </div>

      <div className="md:w-48 flex flex-col items-start md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 pl-0 md:pl-8">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <User size={14} className="text-slate-500" />
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Provider</p>
            <p className="text-xs font-bold text-slate-700">{doctor}</p>
          </div>
        </div>
        <button className="text-[10px] font-black text-[#0D474F] hover:tracking-widest transition-all uppercase tracking-[0.2em] group-hover:text-teal-700">
          READ DETAILS
        </button>
      </div>
    </div>
  );
}
