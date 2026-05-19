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

interface NoShowRateBarProps {
  data: { month: string; rate: number }[];
}

export function NoShowRateBar({ data }: NoShowRateBarProps) {
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 0, left: -10, bottom: 10 }}>
          <CartesianGrid stroke="#E5F3F2" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#54797C", fontSize: 12 }}
            interval={0}
            minTickGap={10}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `${value.toFixed(0)}%`}
            tick={{ fill: "#54797C", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value: number) => `${Number(value).toFixed(1)}%`} />
          <Bar dataKey="rate" fill="#25636C" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="rate" position="top" formatter={(value: number) => `${value.toFixed(0)}%`} style={{ fill: "#1D5052", fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
