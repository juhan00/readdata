import React, { useState } from "react";
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const salesData = [
  {
    date: "2022-01-01",
    posSales: 8000,
    delivery1: 2000,
    delivery2: 2500,
    delivery3: 3000,
  },
  {
    date: "2022-01-02",
    posSales: 8500,
    delivery1: 2200,
    delivery2: 2700,
    delivery3: 3200,
  },
  {
    date: "2022-01-03",
    posSales: 9000,
    delivery1: 2400,
    delivery2: 2900,
    delivery3: 3400,
  },
  {
    date: "2022-01-04",
    posSales: 9500,
    delivery1: 2600,
    delivery2: 3100,
    delivery3: 3600,
  },
  {
    date: "2022-01-05",
    posSales: 10000,
    delivery1: 2800,
    delivery2: 3300,
    delivery3: 3800,
  },
  {
    date: "2022-01-06",
    posSales: 10500,
    delivery1: 3000,
    delivery2: 3500,
    delivery3: 4000,
  },
  {
    date: "2022-01-07",
    posSales: 11000,
    delivery1: 3200,
    delivery2: 3700,
    delivery3: 4200,
  },
];

const calculateTotalDeliverySales = (entry) => entry.delivery1 + entry.delivery2 + entry.delivery3;

const Chart = () => {
  const [hiddenLines, setHiddenLines] = useState([]);

  const barChartData = salesData.map((entry) => ({
    date: entry.date,
    posSales: entry.posSales,
    delivery1: entry.delivery1,
    delivery2: entry.delivery2,
    delivery3: entry.delivery3,
  }));

  const lineChartData = salesData.map((entry) => ({
    date: entry.date,
    totalSales: entry.posSales + calculateTotalDeliverySales(entry),
  }));

  const handleLegendClick = (dataKey) => {
    if (hiddenLines.includes(dataKey)) {
      setHiddenLines(hiddenLines.filter((key) => key !== dataKey));
    } else {
      setHiddenLines([...hiddenLines, dataKey]);
    }
  };

  return (
    <div className="wrap" style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend onClick={handleLegendClick} />

          <Bar dataKey="posSales" stackId="a" fill="#8884d8" name="포스매출" />
          <Bar dataKey="delivery1" stackId="b" fill="#82ca9d" name="배달1" />
          <Bar dataKey="delivery2" stackId="b" fill="#ffc658" name="배달2" />
          <Bar dataKey="delivery3" stackId="b" fill="#ff7300" name="배달3" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={lineChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend onClick={handleLegendClick} />

          {!hiddenLines.includes("posSales") && <Line type="monotone" dataKey="posSales" stroke="#8884d8" name="포스매출 합계" />}
          {!hiddenLines.includes("delivery1") && <Line type="monotone" dataKey="delivery1" stroke="#82ca9d" name="배달1 합계" />}
          {!hiddenLines.includes("delivery2") && <Line type="monotone" dataKey="delivery2" stroke="#ffc658" name="배달2 합계" />}
          {!hiddenLines.includes("delivery3") && <Line type="monotone" dataKey="delivery3" stroke="#ff7300" name="배달3 합계" />}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
