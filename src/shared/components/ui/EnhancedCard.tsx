import React from "react";

interface EnhancedCardProps {
  label: string;
  title: string;
  description: string;
  icon?: string | React.ReactNode;
  borderColor: string;
  textColor: string;
  accentColor: string;
  backgroundColor?: string;
  onClick?: () => void;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  label,
  title,
  description,
  icon,
  borderColor,
  textColor,
  accentColor,
  backgroundColor = "#FFFFFF",
  onClick,
}) => {
  return (
    <article
      onClick={onClick}
      className="group relative rounded-2xl border-2 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer overflow-hidden"
      style={{ borderColor, backgroundColor }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity"
        style={{ backgroundColor: accentColor }}
      ></div>
      <div className="relative z-10">
        {icon && (
          <div className="mb-3 text-3xl">
            {typeof icon === "string" ? icon : icon}
          </div>
        )}
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {label}
        </p>
        <h2
          className="mt-3 text-2xl font-bold leading-tight"
          style={{ color: textColor }}
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
        <div
          className="mt-4 inline-flex items-center gap-2 font-semibold transition-all group-hover:gap-3"
          style={{ color: accentColor }}
        >
          <span>View More</span>
          <span>→</span>
        </div>
      </div>
    </article>
  );
};

export default EnhancedCard;
