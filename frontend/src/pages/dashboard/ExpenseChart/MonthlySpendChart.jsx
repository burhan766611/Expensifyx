import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlySpendChart = ({ data = [] }) => {

  if (!data || data.length === 0) {
  return <p className="text-gray-500">No monthly data</p>;
}
  // data format:
  // [{ month_key: "2025-12", monthly_sum: 12000 }, ...]

  const formatted = data.map(item => ({
    month: item.month_key,
    amount: item.monthly_sum,
  }));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Monthly Spend</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySpendChart;
