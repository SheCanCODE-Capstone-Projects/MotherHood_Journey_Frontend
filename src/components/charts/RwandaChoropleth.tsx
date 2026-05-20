"use client";

import { useState, useCallback } from "react";
import type { ProvinceId, ProvinceMetricData } from "@/lib/api/government";

interface RwandaChoroplethProps {
  provinces: ProvinceMetricData[];
  metricLabel: string;
  selectedProvince: ProvinceId | null;
  onProvinceClick: (provinceId: ProvinceId | null) => void;
  drillDown: boolean;
}

interface ProvincePath {
  id: ProvinceId;
  label: string;
  path: string;
}

const PATHS: ProvincePath[] = [
  {
    id: "northern",
    label: "Northern",
    path: "M50,28 L310,22 L340,30 Q360,55 345,88 L325,100 Q280,115 240,118 L195,108 Q160,105 140,110 L120,105 Q80,100 60,90 L50,65 Q45,45 50,28 Z",
  },
  {
    id: "eastern",
    label: "Eastern",
    path: "M345,88 Q360,55 340,30 L310,22 L240,118 L195,108 L185,145 Q188,175 200,205 L210,230 Q225,260 240,275 L260,290 Q295,325 320,340 Q355,360 365,370 L370,360 Q380,320 378,265 Q375,200 370,140 Q365,110 345,88 Z",
  },
  {
    id: "kigali",
    label: "Kigali",
    path: "M195,108 L140,110 L120,105 L115,135 Q118,160 125,185 Q130,205 140,215 L155,218 L170,212 Q182,205 190,195 L200,175 Q205,155 200,135 L198,118 Z",
  },
  {
    id: "southern",
    label: "Southern",
    path: "M140,215 Q130,205 125,185 Q118,160 115,135 L95,130 Q70,128 55,140 Q40,160 38,195 Q35,245 42,290 Q48,335 58,360 Q70,385 90,400 L120,415 Q150,425 175,415 Q200,405 220,390 Q245,370 260,355 L240,275 Q225,260 210,230 L200,205 Q188,175 185,145 L195,108 L198,118 Q200,135 200,155 L190,195 L180,212 L170,212 Q155,218 140,215 Z",
  },
  {
    id: "western",
    label: "Western",
    path: "M120,105 L55,140 Q40,160 38,195 Q35,245 42,290 Q48,335 58,360 Q70,385 90,400 L120,415 Q150,425 175,415 Q200,405 220,390 L240,275 L260,290 Q210,280 155,260 Q130,245 130,200 Q128,175 115,135 L120,105 Z",
  },
];

const PROVINCE_CENTERS: Record<ProvinceId, { x: number; y: number }> = {
  northern: { x: 180, y: 65 },
  eastern: { x: 310, y: 230 },
  kigali: { x: 158, y: 165 },
  southern: { x: 150, y: 320 },
  western: { x: 95, y: 250 },
};

function getColor(value: number, min: number, max: number): string {
  const clamped = Math.max(0, (value - min) / (max - min || 1));
  const r = Math.round(80 + clamped * (29 - 80));
  const g = Math.round(114 + clamped * (80 - 114));
  const b = Math.round(118 + clamped * (82 - 118));
  return `rgb(${r}, ${g}, ${b})`;
}

function getLightColor(value: number, min: number, max: number): string {
  const clamped = Math.max(0, (value - min) / (max - min || 1));
  const r = Math.round(213 + clamped * (150 - 213));
  const g = Math.round(233 + clamped * (233 - 233));
  const b = Math.round(230 + clamped * (226 - 230));
  return `rgb(${r}, ${g}, ${b})`;
}

export function RwandaChoropleth({
  provinces,
  metricLabel,
  selectedProvince,
  onProvinceClick,
  drillDown,
}: RwandaChoroplethProps) {
  const [hoveredId, setHoveredId] = useState<ProvinceId | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const values = provinces.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGPathElement>, provinceId: ProvinceId) => {
      const rect = e.currentTarget.closest("svg")?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
      setHoveredId(provinceId);
    },
    [],
  );

  const provinceMap = new Map(provinces.map((p) => [p.provinceId, p]));
  const selectedData = selectedProvince ? provinceMap.get(selectedProvince) : null;

  return (
    <div className="relative">
      <svg
        viewBox="0 0 400 440"
        className="w-full h-auto max-h-[500px] drop-shadow-sm"
        role="img"
        aria-label={`Rwanda choropleth map showing ${metricLabel} by province`}
      >
        <rect x="0" y="0" width="400" height="440" fill="#F8FCFB" rx="8" />

        {PATHS.map((p) => {
          const data = provinceMap.get(p.id);
          const value = data?.value ?? 50;
          const isSelected = selectedProvince === p.id;
          const isHovered = hoveredId === p.id;
          const isDimmed = selectedProvince !== null && !isSelected && drillDown;

          return (
            <g key={p.id}>
              <path
                d={p.path}
                fill={
                  isDimmed
                    ? "#E8EEED"
                    : isSelected || isHovered
                      ? getColor(value, min, max)
                      : getLightColor(value, min, max)
                }
                stroke={isSelected ? "#1D5052" : "#FFFFFF"}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="transition-colors duration-150 cursor-pointer"
                onMouseMove={(e) => handleMouseMove(e, p.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() =>
                  onProvinceClick(drillDown && isSelected ? null : p.id)
                }
                role="button"
                aria-label={`${p.label}: ${value}% ${metricLabel}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onProvinceClick(drillDown && isSelected ? null : p.id);
                  }
                }}
              />

              {(!drillDown || selectedProvince === null || isSelected) && (
                <text
                  x={PROVINCE_CENTERS[p.id].x}
                  y={PROVINCE_CENTERS[p.id].y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none select-none"
                  fill={isSelected || isHovered ? "#FFFFFF" : "#1D5052"}
                  fontSize={p.id === "kigali" ? "10" : "11"}
                  fontWeight="600"
                >
                  {p.label}
                </text>
              )}

              {(!drillDown || selectedProvince === null || isSelected) && (
                <text
                  x={PROVINCE_CENTERS[p.id].x}
                  y={PROVINCE_CENTERS[p.id].y + 15}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none select-none"
                  fill={isSelected || isHovered ? "#E2F2F5" : "#54797C"}
                  fontSize="10"
                  fontWeight="500"
                >
                  {value}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {hoveredId && !drillDown && (
        <div
          className="absolute pointer-events-none z-10 bg-white border border-[#D5E9E6] rounded-lg shadow-lg px-3 py-2 text-sm"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 10,
          }}
        >
          <div className="font-semibold text-[#1D5052]">
            {hoveredId.charAt(0).toUpperCase() + hoveredId.slice(1)}
          </div>
          <div className="text-[#54797C] text-xs">
            {metricLabel}: {provinceMap.get(hoveredId)?.value}%
          </div>
        </div>
      )}

      {selectedData && drillDown && (
        <div className="mt-4 rounded-xl border border-[#D5E9E6] bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-[#1D5052] text-sm">
              {selectedData.provinceName} Province — Districts
            </h4>
            <button
              onClick={() => onProvinceClick(null)}
              className="text-xs text-[#1F7280] font-medium hover:underline"
            >
              ← Back to provinces
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {selectedData.districts.map((d) => {
              const districtMin = Math.min(...selectedData.districts.map((x) => x.value));
              const districtMax = Math.max(...selectedData.districts.map((x) => x.value));
              return (
                <div
                  key={d.districtId}
                  className="flex items-center gap-2 rounded-lg border border-[#E5F3F2] px-3 py-2"
                >
                  <span
                    className="w-3 h-3 rounded shrink-0"
                    style={{
                      backgroundColor: getLightColor(d.value, districtMin, districtMax),
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#1D5052] truncate">
                      {d.districtName}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#54797C]">{d.value}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!drillDown && (
        <div className="mt-4 flex items-center gap-2 px-1">
          <span className="text-xs font-medium text-[#54797C]">Low</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden flex">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  backgroundColor: getLightColor(
                    min + (max - min) * ((i + 0.5) / 10),
                    min,
                    max,
                  ),
                }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-[#54797C]">High</span>
        </div>
      )}
    </div>
  );
}
