import React from "react";
import { PieChart, Pie, Tooltip, Cell, Label, ResponsiveContainer } from "recharts";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF19AF"];

const PieChartComponent = () => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div style={{ width: "500px" }}>
      <ResponsiveContainer width={"100%"} height={250}>
        <PieChart>
          <Pie
            data={data01}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {data01.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default PieChartComponent;
