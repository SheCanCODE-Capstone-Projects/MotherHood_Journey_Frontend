import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AncAttendanceTrendProps {
  data: { month: string; attendance: number }[];
}

type ChartValue = number | string | Array<number | string> | undefined;

function formatPercentage(value: ChartValue, fractionDigits: number) {
  const normalizedValue = Array.isArray(value) ? value[0] : value;
  return `${Number(normalizedValue ?? 0).toFixed(fractionDigits)}%`;
}

export function AncAttendanceTrend({ data }: AncAttendanceTrendProps) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#E5F3F2" strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#54797C", fontSize: 12 }}
            interval={0}
            minTickGap={15}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => `${value.toFixed(0)}%`}
            tick={{ fill: "#54797C", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value) => formatPercentage(value, 1)} />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#1D5052"
            strokeWidth={3}
            dot={{ r: 4, fill: "#1D5052" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
