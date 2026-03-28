import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Urgent", value: 4 },
  { name: "Support", value: 3 },
  { name: "Spam", value: 2 },
];

const COLORS = ["#ff4d4f", "#1890ff", "#52c41a"];

const Charts = () => {
  return (
    <PieChart width={300} height={300}>
      <Pie data={data} dataKey="value" outerRadius={100}>
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default Charts;