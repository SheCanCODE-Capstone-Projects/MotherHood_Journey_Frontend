"use client";

import { useState, useCallback, useMemo } from "react";
import { geoMercator, geoPath } from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { ProvinceId, ProvinceMetricData } from "@/lib/api/government";

import rwandaGeoJson from "@/data/rwanda-provinces";

interface RwandaChoroplethProps {
  provinces: ProvinceMetricData[];
  metricLabel: string;
  selectedProvince: ProvinceId | null;
  onProvinceClick: (provinceId: ProvinceId | null) => void;
  drillDown: boolean;
}


const NAME_TO_ID: Record<string, ProvinceId> = {
  Amajyaruguru: "northern",
  Amajyepfo: "southern",
  Iburasirazuba: "eastern",
  Iburengerazuba: "western",
  UmujyiwaKigali: "kigali",
};

const WIDTH = 500;
const HEIGHT = 460;

function getLightColor(value: number, min: number, max: number): string {
  const clamped = Math.max(0, (value - min) / (max - min || 1));
  const r = Math.round(213 - clamped * 63);
  const g = Math.round(233 - clamped * 0);
  const b = Math.round(230 - clamped * 4);
  return `rgb(${r}, ${g}, ${b})`;
}

function getDarkColor(value: number, min: number, max: number): string {
  const clamped = Math.max(0, (value - min) / (max - min || 1));
  const r = Math.round(80 - clamped * 51);
  const g = Math.round(114 - clamped * 34);
  const b = Math.round(118 - clamped * 36);
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

  const provinceMap = useMemo(
    () => new Map(provinces.map((p) => [p.provinceId, p])),
    [provinces],
  );

  const values = provinces.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const { pathGenerator, features } = useMemo(() => {
    const geo = rwandaGeoJson as FeatureCollection;
    const proj = geoMercator().fitSize([WIDTH, HEIGHT], geo);
    const path = geoPath().projection(proj);
    const feats = geo.features.map((f: Feature) => {
      const name = f.properties?.NAME_1 as string;
      const id = NAME_TO_ID[name] ?? null;
      return { feature: f, id, name };
    });
    return { projection: proj, pathGenerator: path, features: feats };
  }, []);

  const centroids = useMemo(() => {
    return features.map(({ feature, id }) => {
      const centroid = pathGenerator.centroid(feature as Feature<Geometry>);
      return { id, cx: centroid[0], cy: centroid[1] };
    });
  }, [features, pathGenerator]);

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

  const selectedData = selectedProvince ? provinceMap.get(selectedProvince) : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto max-h-[500px] drop-shadow-sm"
        role="img"
        aria-label={`Rwanda choropleth map showing ${metricLabel} by province`}
      >
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#F8FCFB" rx="8" />

        {features.map(({ feature, id, name }) => {
          if (!id) return null;
          const data = provinceMap.get(id);
          const value = data?.value ?? 50;
          const isSelected = selectedProvince === id;
          const isHovered = hoveredId === id;
          const isDimmed = selectedProvince !== null && !isSelected && drillDown;
          const d = pathGenerator(feature as Feature<Geometry>) ?? "";

          return (
            <path
              key={id}
              d={d}
              fill={
                isDimmed
                  ? "#E8EEED"
                  : isSelected || isHovered
                    ? getDarkColor(value, min, max)
                    : getLightColor(value, min, max)
              }
              stroke={isSelected ? "#1D5052" : "#FFFFFF"}
              strokeWidth={isSelected ? 2 : 1}
              strokeLinejoin="round"
              className="transition-colors duration-150 cursor-pointer"
              onMouseMove={(e) => handleMouseMove(e, id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onProvinceClick(drillDown && isSelected ? null : id)}
              role="button"
              aria-label={`${name}: ${value}% ${metricLabel}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onProvinceClick(drillDown && isSelected ? null : id);
                }
              }}
            />
          );
        })}

        {centroids.map(({ id, cx, cy }) => {
          if (!id) return null;
          const data = provinceMap.get(id);
          const value = data?.value ?? 50;
          const isSelected = selectedProvince === id;
          const isHovered = hoveredId === id;
          const isDimmed = selectedProvince !== null && !isSelected && drillDown;
          if (isDimmed) return null;
          const label = id === "kigali" ? "Kigali" : id.charAt(0).toUpperCase() + id.slice(1);

          return (
            <g key={`label-${id}`} className="pointer-events-none select-none">
              <text
                x={cx}
                y={cy - 7}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected || isHovered ? "#FFFFFF" : "#1D5052"}
                fontSize={id === "kigali" ? "9" : "11"}
                fontWeight="600"
              >
                {label}
              </text>
              <text
                x={cx}
                y={cy + 9}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isSelected || isHovered ? "#E2F2F5" : "#54797C"}
                fontSize={id === "kigali" ? "8" : "10"}
                fontWeight="500"
              >
                {value}%
              </text>
            </g>
          );
        })}
      </svg>

      {hoveredId && !drillDown && (
        <div
          className="absolute pointer-events-none z-10 bg-white border border-[#D5E9E6] rounded-lg shadow-lg px-3 py-2 text-sm"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 10 }}
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
                <div key={d.districtId} className="flex items-center gap-2 rounded-lg border border-[#E5F3F2] px-3 py-2">
                  <span
                    className="w-3 h-3 rounded shrink-0"
                    style={{ backgroundColor: getLightColor(d.value, districtMin, districtMax) }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-[#1D5052] truncate">{d.districtName}</div>
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
                style={{ backgroundColor: getLightColor(min + (max - min) * ((i + 0.5) / 10), min, max) }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-[#54797C]">High</span>
        </div>
      )}
    </div>
  );
}