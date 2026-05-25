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

type ChartValue = number | string | Array<number | string> | undefined;

function formatPercentage(value: ChartValue, fractionDigits: number) {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  return `${Number(normalizedValue ?? 0).toFixed(fractionDigits)}%`;
}

export function NoShowRateBar({ data }: NoShowRateBarProps) {
  return (
    <div className="h-65 w-full">
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
            tickFormatter={(value: number) => `${value.toFixed(0)}%`}
            tick={{ fill: "#54797C", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value) => formatPercentage(value, 1)} />
          <Bar dataKey="rate" fill="#25636C" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="rate" position="top" formatter={(value) => formatPercentage(value, 0)} style={{ fill: "#1D5052", fontSize: 12 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
