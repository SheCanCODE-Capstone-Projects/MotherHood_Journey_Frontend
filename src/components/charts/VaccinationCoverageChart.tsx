import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface VaccinationCoverageChartProps {
  data: { vaccineType: string; coverage: number }[];
}

export function VaccinationCoverageChart({ data }: VaccinationCoverageChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 0, left: -10, bottom: 15 }}>
          <CartesianGrid stroke="#E5F3F2" strokeDasharray="3 3" />
          <XAxis
            dataKey="vaccineType"
            tick={{ fill: "#54797C", fontSize: 12 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={70}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            tick={{ fill: "#54797C", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) =>
              value === undefined || value === null ? "" : `${Number(value).toFixed(1)}%`
            }
          />
          <Bar dataKey="coverage" fill="#1D5052" radius={[10, 10, 0, 0]}>
            <LabelList
              dataKey="coverage"
              position="top"
              formatter={(value) =>
                value === undefined || value === null ? "" : `${Number(value).toFixed(0)}%`
              }
              style={{ fill: "#1D5052", fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
