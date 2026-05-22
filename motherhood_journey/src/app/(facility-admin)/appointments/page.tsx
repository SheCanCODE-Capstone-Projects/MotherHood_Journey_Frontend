'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { WeekCalendarGrid, CalendarAppointment } from '../../../shared/components/charts/WeekCalendarGrid';
import { CapacityBar } from '../../../shared/components/charts/CapacityBar';

// Mock data
const MOCK_APPOINTMENTS: CalendarAppointment[] = [
  {
    id: '1',
    patientName: 'Divine Uwase',
    appointmentType: 'ANTENATAL',
    startTime: '09:00',
    endTime: '09:30',
    date: '2024-02-12',
  },
  {
    id: '2',
    patientName: 'Grace Mukamana',
    appointmentType: 'VACCINATION',
    startTime: '10:00',
    endTime: '10:30',
    date: '2024-02-12',
  },
  {
    id: '3',
    patientName: 'Hope Ingabire',
    appointmentType: 'POSTNATAL',
    startTime: '14:00',
    endTime: '14:45',
    date: '2024-02-13',
  },
  {
    id: '4',
    patientName: 'Emmanuel Nkusi',
    appointmentType: 'CONSULTATION',
    startTime: '11:00',
    endTime: '11:30',
    date: '2024-02-14',
  },
];

const MOCK_CAPACITIES = [
  { day: 'Mon', booked: 8, available: 12 },
  { day: 'Tue', booked: 12, available: 8 },
  { day: 'Wed', booked: 15, available: 5 },
  { day: 'Thu', booked: 10, available: 10 },
  { day: 'Fri', booked: 18, available: 2 },
  { day: 'Sat', booked: 5, available: 15 },
  { day: 'Sun', booked: 3, available: 17 },
];

export default function AppointmentsPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<CalendarAppointment | null>(null);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getWeekRange = () => {
    const start = new Date(currentWeek);
    start.setDate(currentWeek.getDate() - currentWeek.getDay() + 1);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Appointment Calendar</h1>
          <p className="text-sm text-gray-600 mt-1">Manage facility appointments and schedules</p>
        </div>

        {/* Week Navigation */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{getWeekRange()}</p>
            <p className="text-xs text-gray-500">Week View</p>
          </div>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <CapacityBar capacities={MOCK_CAPACITIES} />
        </div>

        {/* Calendar Grid */}
        <div className="mb-6">
          <WeekCalendarGrid
            appointments={MOCK_APPOINTMENTS}
            onAppointmentClick={setSelectedAppointment}
          />
        </div>

        {/* Legend */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Appointment Types</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span className="text-sm text-gray-600">Antenatal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded" />
              <span className="text-sm text-gray-600">Postnatal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">Vaccination</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded" />
              <span className="text-sm text-gray-600">Consultation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Side Panel */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="w-96 bg-white h-full shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Patient Name</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedAppointment.patientName}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Appointment Type</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">{selectedAppointment.appointmentType}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Date</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Time</label>
                  <p className="text-sm font-semibold text-gray-900 mt-1">
                    {selectedAppointment.startTime} - {selectedAppointment.endTime}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
