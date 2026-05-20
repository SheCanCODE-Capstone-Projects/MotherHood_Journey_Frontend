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
    <div className="flex items-center gap-2">
      <label className="text-xs text-[#54797C]">From</label>
      <input
        type="date"
        value={startValue}
        onChange={handleStartChange}
        className="rounded-md border px-2 py-1 text-sm"
      />
      <label className="text-xs text-[#54797C]">To</label>
      <input
        type="date"
        value={endValue}
        onChange={handleEndChange}
        className="rounded-md border px-2 py-1 text-sm"
      />
    </div>
  );
}

export default DateRangePicker;
