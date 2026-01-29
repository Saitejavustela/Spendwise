import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MonthlyChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white p-4 shadow rounded h-80">
      <h2 className="font-semibold mb-2">Monthly Chart</h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
