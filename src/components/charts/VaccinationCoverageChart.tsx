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
    <div className="h-[320px] w-full rounded-[8px] bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 0, left: -10, bottom: 15 }}>
          <defs>
            <linearGradient id="vaccinationBar" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#226D68" />
              <stop offset="100%" stopColor="#5DCAA5" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E3EFED" strokeDasharray="4 6" vertical={false} />
          <XAxis
            dataKey="vaccineType"
            tick={{ fill: "#648386", fontSize: 12 }}
            interval={0}
            angle={-30}
            textAnchor="end"
            height={70}
            tickLine={false}
            axisLine={{ stroke: "#D5E7E4" }}
          />
          <YAxis
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            tick={{ fill: "#648386", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, "Coverage"]}
            contentStyle={{
              border: "1px solid #D5E7E4",
              borderRadius: 8,
              boxShadow: "0 18px 36px -24px rgba(22,63,66,0.45)",
            }}
            labelStyle={{ color: "#163F42", fontWeight: 600 }}
          />
          <Bar dataKey="coverage" fill="url(#vaccinationBar)" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="coverage" position="top" formatter={(value) => `${Number(value ?? 0).toFixed(0)}%`} style={{ fill: "#163F42", fontSize: 12, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
