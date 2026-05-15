import React from 'react';

interface DayCapacity {
  day: string;
  booked: number;
  available: number;
}

interface CapacityBarProps {
  capacities: DayCapacity[];
}

export function CapacityBar({ capacities }: CapacityBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Daily Capacity</h3>
      <div className="grid grid-cols-7 gap-3">
        {capacities.map(({ day, booked, available }) => {
          const total = booked + available;
          const percentage = total > 0 ? (booked / total) * 100 : 0;
          
          return (
            <div key={day} className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-600 mb-2">{day}</span>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                <div
                  className="bg-teal-600 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {booked}/{total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
