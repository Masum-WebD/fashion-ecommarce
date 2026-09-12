'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const ChartCard = ({ title, subtitle, children, action }: ChartCardProps) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5">
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

interface AreaChartData {
  name: string;
  value: number;
  value2?: number;
}

interface SimpleAreaChartProps {
  data: AreaChartData[];
  color?: string;
  color2?: string;
  height?: number;
  showSecondLine?: boolean;
}

export const SimpleAreaChart = ({
  data,
  color = "#0d7a3f",
  color2 = "#f59e0b",
  height = 250,
  showSecondLine = false,
}: SimpleAreaChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={color} stopOpacity={0.15} />
          <stop offset="95%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        {showSecondLine && (
          <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color2} stopOpacity={0.15} />
            <stop offset="95%" stopColor={color2} stopOpacity={0} />
          </linearGradient>
        )}
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      />
      <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill="url(#colorValue)" />
      {showSecondLine && (
        <Area type="monotone" dataKey="value2" stroke={color2} strokeWidth={2} fill="url(#colorValue2)" />
      )}
    </AreaChart>
  </ResponsiveContainer>
);

interface BarChartData {
  name: string;
  value: number;
}

interface SimpleBarChartProps {
  data: BarChartData[];
  color?: string;
  height?: number;
}

export const SimpleBarChart = ({ data, color = "#0d7a3f", height = 250 }: SimpleBarChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
      <Tooltip
        contentStyle={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      />
      <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  data: PieChartData[];
  height?: number;
}

export const SimplePieChart = ({ data, height = 250 }: SimplePieChartProps) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={55}
        outerRadius={85}
        paddingAngle={4}
        dataKey="value"
        stroke="none"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Tooltip
        contentStyle={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      />
    </PieChart>
  </ResponsiveContainer>
);

