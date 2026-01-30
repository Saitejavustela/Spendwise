import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CategoryChartProps {
  data: Array<{ categoryName: string; amount: number }>;
}

const COLORS = [
  "#6366f1", // indigo
  "#f43f5e", // rose
  "#22c55e", // green
  "#eab308", // yellow
  "#0ea5e9", // sky
  "#ec4899", // pink
  "#8b5cf6", // violet
  "#f97316", // orange
];

const CategoryChart = ({ data }: CategoryChartProps) => {
  const totalAmount = data.reduce((sum, item) => sum + Number(item.amount), 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.amount / totalAmount) * 100).toFixed(1);
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
          <p className="font-medium">{item.categoryName}</p>
          <p className="text-emerald-400">
            ₹{Number(item.amount).toLocaleString("en-IN")}
          </p>
          <p className="text-gray-400 text-xs">{percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="amount"
            nameKey="categoryName"
            animationDuration={800}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="transition-all duration-200 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderCustomLegend} />
          
          {/* Center text */}
          <text
            x="50%"
            y="42%"
            textAnchor="middle"
            className="fill-gray-400 text-xs"
          >
            Total
          </text>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            className="fill-gray-900 dark:fill-white text-lg font-bold"
          >
            ₹{totalAmount.toLocaleString("en-IN")}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
