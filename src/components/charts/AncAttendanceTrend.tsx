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

export function AncAttendanceTrend({ data }: AncAttendanceTrendProps) {
  return (
    <div className="h-[320px] w-full rounded-[8px] bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 20, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="ancAttendanceLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#226D68" />
              <stop offset="100%" stopColor="#5DCAA5" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E3EFED" strokeDasharray="4 6" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#648386", fontSize: 12 }}
            interval={0}
            minTickGap={15}
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
            formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, "Attendance"]}
            contentStyle={{
              border: "1px solid #D5E7E4",
              borderRadius: 8,
              boxShadow: "0 18px 36px -24px rgba(22,63,66,0.45)",
            }}
            labelStyle={{ color: "#163F42", fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="url(#ancAttendanceLine)"
            strokeWidth={3}
            dot={{ r: 4, fill: "#FFFFFF", stroke: "#226D68", strokeWidth: 2 }}
            activeDot={{ r: 6, fill: "#5DCAA5", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
