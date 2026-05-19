import React from "react";

interface StatsCardProps {
  icon: string | React.ReactNode;
  label: string;
  value: string | number;
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  accentColor,
  backgroundColor,
  borderColor,
  textColor,
}) => {
  return (
    <div
      className="rounded-xl p-5 shadow-sm border-2 transition-all duration-300 hover:shadow-md hover:scale-105"
      style={{ backgroundColor, borderColor }}
    >
      <div className="text-4xl mb-3">{typeof icon === "string" ? icon : icon}</div>
      <p
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: accentColor }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-bold mt-2"
        style={{ color: textColor }}
      >
        {value}
      </p>
    </div>
  );
};

export default StatsCard;
