'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface ChartsProps {
  data: ChartData[];
  type: 'bar' | 'pie' | 'line' | 'area';
  title: string;
  height?: number;
  colors?: string[];
}

const defaultColors = [
  '#9333EA', // Purple-600
  '#7C3AED', // Purple-700
  '#6B21A8', // Purple-800
  '#A855F7', // Purple-500
  '#C084FC', // Purple-400
  '#D8B4FE', // Purple-300
];

export default function Charts({ 
  data, 
  type, 
  title, 
  height = 300, 
  colors = defaultColors 
}: ChartsProps) {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={colors[0]} />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} />
          </LineChart>
        );
      
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={colors[0]} fill={colors[0]} fillOpacity={0.3} />
          </AreaChart>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

// Specific chart components for common use cases
export function UserRoleChart({ data }: { data: ChartData[] }) {
  return (
    <Charts
      data={data}
      type="pie"
      title="Users by Role"
      height={250}
    />
  );
}

export function RevenueChart({ data }: { data: ChartData[] }) {
  return (
    <Charts
      data={data}
      type="bar"
      title="Monthly Revenue"
      height={300}
    />
  );
}

export function AttendanceChart({ data }: { data: ChartData[] }) {
  return (
    <Charts
      data={data}
      type="line"
      title="Attendance Trends"
      height={250}
    />
  );
}

export function FeeStatusChart({ data }: { data: ChartData[] }) {
  return (
    <Charts
      data={data}
      type="pie"
      title="Fee Payment Status"
      height={250}
    />
  );
}
