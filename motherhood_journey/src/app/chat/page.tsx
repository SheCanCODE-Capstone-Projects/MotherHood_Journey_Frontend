"use client";

import { Home, FileText, ClipboardList, MessageSquare, Lightbulb, Send, Paperclip, Smile, Phone, Video, MoreVertical, AlertCircle, FileIcon, MapPin, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ChatPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <ChatList />
          <ChatWindow />
          <QuickHelp />
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
    <aside className="hidden lg:flex w-[200px] bg-white flex-col py-5 px-3 border-r border-gray-100">
      <div className="px-2 mb-6">
        <h1 className="text-xs font-bold text-gray-900">Maternal Sanctuary</h1>
      </div>

      <nav className="flex-1 space-y-0.5">
        <SidebarItem icon={<Home size={15} />} label="HOME" href="/" />
        <SidebarItem icon={<FileText size={15} />} label="MY RECORDS" href="/records" />
        <SidebarItem icon={<ClipboardList size={15} />} label="REQUESTS" href="/requests" />
        <SidebarItem icon={<MessageSquare size={15} />} label="CHAT" href="/chat" active />
        <SidebarItem icon={<Lightbulb size={15} />} label="TIPS" href="/tips" />
      </nav>
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
          <span className="text-white text-[9px] font-bold">EC</span>
        </button>
      </div>
    </div>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl lg:hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-sm font-bold text-gray-900">Maternal Sanctuary</h1>
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
        <MobileMenuItem icon={<ClipboardList size={18} />} label="REQUESTS" href="/requests" onClick={onClose} />
        <MobileMenuItem icon={<MessageSquare size={18} />} label="CHAT" href="/chat" active onClick={onClose} />
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
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[10px] font-semibold transition-colors ${
        active ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function ChatList() {
  return (
    <div className="hidden md:flex w-[280px] bg-white border-r border-gray-100 flex-col">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 mb-1">Care Team</h2>
        <p className="text-[10px] text-gray-500">Your healthcare support network</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ChatListItem 
          name="Dr. Sarah Chen"
          role="Obstetrician"
          message="Your test results look great! Let's schedule..."
          time="2m"
          active
          avatar="SC"
          online
        />
        <ChatListItem 
          name="Nurse Patricia"
          role="Community Health Worker"
          message="Good morning! How are you feeling today?"
          time="1h"
          avatar="NP"
        />
        <ChatListItem 
          name="Elena Martinez"
          role="Nutritionist"
          message="Here's the meal plan we discussed..."
          time="3h"
          avatar="EM"
        />
      </div>

      <div className="p-4 border-t border-gray-100">
        <p className="text-[9px] text-gray-400 text-center">
          For emergencies, call our hotline<br />
          <span className="font-bold text-gray-600">1-800-MATERNAL</span>
        </p>
      </div>
    </div>
  );
}

function ChatListItem({ name, role, message, time, active = false, avatar, online = false }: { name: string; role: string; message: string; time: string; active?: boolean; avatar: string; online?: boolean }) {
  return (
    <div className={`p-4 border-b border-gray-50 cursor-pointer transition-colors ${active ? 'bg-teal-50' : 'hover:bg-gray-50'}`}>
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ${active ? 'bg-teal-600' : 'bg-gray-400'}`}>
            {avatar}
          </div>
          {online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-0.5">
            <h3 className="text-xs font-bold text-gray-900">{name}</h3>
            <span className="text-[9px] text-gray-400">{time}</span>
          </div>
          <p className="text-[9px] text-gray-500 mb-1">{role}</p>
          <p className="text-[10px] text-gray-600 truncate">{message}</p>
        </div>
      </div>
    </div>
  );
}

function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}

function ChatHeader() {
  return (
    <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            SC
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Dr. Sarah Chen</h3>
          <p className="text-[10px] text-green-600 font-medium">● Online</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 md:w-9 md:h-9 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors">
          <Phone size={16} className="text-gray-600" />
        </button>
        <button className="w-8 h-8 md:w-9 md:h-9 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors">
          <Video size={16} className="text-gray-600" />
        </button>
        <button className="w-8 h-8 md:w-9 md:h-9 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors">
          <MoreVertical size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function ChatMessages() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
      <div className="text-center">
        <p className="text-[9px] text-gray-400 uppercase tracking-wide">Today, 10:30 AM</p>
      </div>

      <MessageBubble 
        sender="Dr. Sarah Chen"
        message="Good morning, Elena. I've reviewed your latest blood pressure readings and they look stable. How have you been feeling this week?"
        time="10:32 AM"
        isOwn={false}
      />

      <MessageBubble 
        sender="You"
        message="Good morning, Doctor! I've been feeling much better. The swelling in my feet has reduced significantly."
        time="10:35 AM"
        isOwn={true}
      />

      <MessageBubble 
        sender="Dr. Sarah Chen"
        message="That's wonderful to hear! The new diet plan seems to be working well. Let's continue with it and I'd like to see you next week for a routine checkup. Does Wednesday at 2pm work for you?"
        time="10:36 AM"
        isOwn={false}
      />

      <ImageMessage 
        sender="You"
        imageUrl="/placeholder-ultrasound.jpg"
        caption="Here's the ultrasound from yesterday"
        time="10:38 AM"
      />

      <MessageBubble 
        sender="Dr. Sarah Chen"
        message="Perfect! The baby looks healthy and is developing beautifully. Everything is progressing as expected. Keep up the good work with your prenatal vitamins and rest."
        time="10:40 AM"
        isOwn={false}
      />

      <div className="text-center">
        <p className="text-[9px] text-gray-400">Dr. Sarah Chen is typing...</p>
      </div>
    </div>
  );
}

function MessageBubble({ sender, message, time, isOwn }: { sender: string; message: string; time: string; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && <p className="text-[9px] text-gray-500 mb-1 ml-1">{sender}</p>}
        <div className={`rounded-2xl px-4 py-3 ${isOwn ? 'bg-teal-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
          <p className="text-xs leading-relaxed">{message}</p>
        </div>
        <p className={`text-[9px] text-gray-400 mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>{time}</p>
      </div>
    </div>
  );
}

function ImageMessage({ sender, imageUrl, caption, time }: { sender: string; imageUrl: string; caption: string; time: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[70%]">
        <div className="bg-gray-100 rounded-2xl overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center">
            <p className="text-xs text-gray-600">Ultrasound Image</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-gray-900">{caption}</p>
          </div>
        </div>
        <p className="text-[9px] text-gray-400 mt-1 text-right mr-1">{time}</p>
      </div>
    </div>
  );
}

function ChatInput() {
  return (
    <div className="px-4 md:px-6 py-4 border-t border-gray-100">
      <div className="flex items-center gap-2 md:gap-3">
        <button className="w-8 h-8 md:w-9 md:h-9 rounded-lg hover:bg-gray-50 flex items-center justify-center transition-colors">
          <Paperclip size={18} className="text-gray-400" />
        </button>
        <div className="flex-1 relative">
          <input 
            type="text"
            placeholder="Type your message here..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
        <button className="hidden md:flex w-9 h-9 rounded-lg hover:bg-gray-50 items-center justify-center transition-colors">
          <Smile size={18} className="text-gray-400" />
        </button>
        <button className="px-4 md:px-5 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-2">
          <Send size={16} />
          <span className="hidden md:inline">Send</span>
        </button>
      </div>
    </div>
  );
}

function QuickHelp() {
  return (
    <div className="hidden xl:block w-[300px] bg-white border-l border-gray-100 p-5">
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Quick Help</h3>
        <p className="text-[10px] text-gray-500">Common questions and resources</p>
      </div>

      <div className="space-y-3 mb-6">
        <QuickHelpCard 
          icon={<AlertCircle size={16} />}
          title="Emergency"
          description="Need immediate assistance?"
          buttonText="CALL HOTLINE NOW"
          urgent
        />
        <QuickHelpCard 
          icon={<FileIcon size={16} />}
          title="Resources"
          description="Access health guides and tips"
          buttonText="View Resources"
        />
        <QuickHelpCard 
          icon={<MapPin size={16} />}
          title="Clinic Map"
          description="Find nearest health facility"
          buttonText="Open Map"
        />
      </div>

      <div className="pt-5 border-t border-gray-100">
        <p className="text-[9px] text-gray-400 mb-3 uppercase tracking-wide">Scheduled for Today</p>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs font-bold text-gray-900 mb-1">Prenatal Checkup</p>
          <p className="text-[10px] text-gray-600 mb-2">Dr. Sarah Chen • 2:00 PM</p>
          <button className="text-[10px] font-bold text-teal-600 hover:text-teal-700">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

function QuickHelpCard({ icon, title, description, buttonText, urgent = false }: { icon: React.ReactNode; title: string; description: string; buttonText: string; urgent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${urgent ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${urgent ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold text-gray-900 mb-0.5">{title}</h4>
          <p className="text-[10px] text-gray-600">{description}</p>
        </div>
      </div>
      <button className={`w-full py-2 rounded-lg text-[10px] font-bold transition-colors ${
        urgent 
          ? 'bg-red-600 hover:bg-red-700 text-white' 
          : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
      }`}>
        {buttonText}
      </button>
    </div>
  );
}
