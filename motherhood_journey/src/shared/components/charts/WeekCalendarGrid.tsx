'use client';

import React, { useState } from 'react';

export type AppointmentType = 'ANTENATAL' | 'POSTNATAL' | 'VACCINATION' | 'CONSULTATION';

export interface CalendarAppointment {
  id: string;
  patientName: string;
  appointmentType: AppointmentType;
  startTime: string;
  endTime: string;
  date: string;
}

interface WeekCalendarGridProps {
  appointments: CalendarAppointment[];
  onAppointmentClick: (appointment: CalendarAppointment) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const APPOINTMENT_COLORS: Record<AppointmentType, string> = {
  ANTENATAL: 'bg-blue-500 hover:bg-blue-600',
  POSTNATAL: 'bg-purple-500 hover:bg-purple-600',
  VACCINATION: 'bg-green-500 hover:bg-green-600',
  CONSULTATION: 'bg-amber-500 hover:bg-amber-600',
};

export function WeekCalendarGrid({ appointments, onAppointmentClick }: WeekCalendarGridProps) {
  const [hoveredAppointment, setHoveredAppointment] = useState<string | null>(null);

  const getAppointmentPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const top = ((startHour - 7) * 60 + startMin) / 60;
    const height = ((endHour - startHour) * 60 + (endMin - startMin)) / 60;
    
    return { top: `${top * 4}rem`, height: `${height * 4}rem` };
  };

  const getDayAppointments = (dayIndex: number, weekStart: Date) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + dayIndex);
    const dateStr = dayDate.toISOString().split('T')[0];
    
    return appointments.filter(apt => apt.date === dateStr);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-3 bg-gray-50 border-r border-gray-200">
          <span className="text-xs font-medium text-gray-500">TIME</span>
        </div>
        {DAYS.map(day => (
          <div key={day} className="p-3 bg-gray-50 border-r border-gray-200 last:border-r-0">
            <span className="text-sm font-semibold text-gray-700">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-8">
        {/* Time Column */}
        <div className="border-r border-gray-200">
          {HOURS.map(hour => (
            <div key={hour} className="h-16 border-b border-gray-100 px-2 py-1">
              <span className="text-xs text-gray-500">{`${hour.toString().padStart(2, '0')}:00`}</span>
            </div>
          ))}
        </div>

        {/* Day Columns */}
        {DAYS.map((day, dayIndex) => (
          <div key={day} className="border-r border-gray-200 last:border-r-0 relative">
            {HOURS.map(hour => (
              <div key={hour} className="h-16 border-b border-gray-100" />
            ))}
            
            {/* Appointments */}
            <div className="absolute inset-0 pointer-events-none">
              {getDayAppointments(dayIndex, new Date()).map(apt => {
                const { top, height } = getAppointmentPosition(apt.startTime, apt.endTime);
                const colorClass = APPOINTMENT_COLORS[apt.appointmentType];
                
                return (
                  <div
                    key={apt.id}
                    className={`absolute left-1 right-1 ${colorClass} rounded px-2 py-1 cursor-pointer pointer-events-auto transition-colors`}
                    style={{ top, height }}
                    onClick={() => onAppointmentClick(apt)}
                    onMouseEnter={() => setHoveredAppointment(apt.id)}
                    onMouseLeave={() => setHoveredAppointment(null)}
                  >
                    <p className="text-xs font-medium text-white truncate">
                      {apt.patientName}
                    </p>
                    <p className="text-xs text-white/90 truncate">
                      {apt.appointmentType}
                    </p>
                    
                    {/* Tooltip */}
                    {hoveredAppointment === apt.id && (
                      <div className="absolute z-10 left-full ml-2 top-0 bg-gray-900 text-white px-3 py-2 rounded shadow-lg whitespace-nowrap">
                        <p className="font-medium">{apt.patientName}</p>
                        <p className="text-sm">{apt.appointmentType}</p>
                        <p className="text-xs text-gray-300">{apt.startTime} - {apt.endTime}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
