import { startOfMonth, endOfMonth } from "date-fns";
import React from "react";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onRangeChange: (start: Date, end: Date) => void;
}

export function DateRangePicker({ startDate, endDate, onRangeChange }: DateRangePickerProps) {
  const startValue = startDate.toISOString().slice(0, 10);
  const endValue = endDate.toISOString().slice(0, 10);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    onRangeChange(startOfMonth(d), endOfMonth(endDate));
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const d = new Date(e.target.value);
    onRangeChange(startOfMonth(startDate), endOfMonth(d));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#648386]">From</label>
      <input
        type="date"
        value={startValue}
        onChange={handleStartChange}
        className="h-10 rounded-[8px] border border-[#C9DFDC] bg-white px-3 text-sm text-[#163F42] outline-none transition focus:border-[#5DCAA5] focus:ring-3 focus:ring-[#5DCAA5]/20"
      />
      <label className="text-xs font-semibold uppercase tracking-[0.14em] text-[#648386]">To</label>
      <input
        type="date"
        value={endValue}
        onChange={handleEndChange}
        className="h-10 rounded-[8px] border border-[#C9DFDC] bg-white px-3 text-sm text-[#163F42] outline-none transition focus:border-[#5DCAA5] focus:ring-3 focus:ring-[#5DCAA5]/20"
      />
    </div>
  );
}

export default DateRangePicker;
