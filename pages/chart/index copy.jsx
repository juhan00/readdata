import React from "react";
import { Area, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ComposedChart } from "recharts";

const data = [
  {
    data: "2024-01-24",
    pos: 2400,
    delivery1: 1500,
    delivery2: 1000,
    delivery3: 2000,
    total: 6900, // pv(2400) + delivery1(1500) + delivery2(1000) + delivery3(2000)
  },
  {
    data: "2024-01-25",
    pos: 1398,
    delivery1: 1200,
    delivery2: 800,
    delivery3: 1800,
    total: 5398, // pv(1398) + delivery1(1200) + delivery2(800) + delivery3(1800)
  },
  {
    data: "2024-01-26",
    pos: 9800,
    delivery1: 1000,
    delivery2: 700,
    delivery3: 1500,
    total: 13000, // pv(9800) + delivery1(1000) + delivery2(700) + delivery3(1500)
  },
  {
    data: "2024-01-27",
    pos: 3908,
    delivery1: 1300,
    delivery2: 900,
    delivery3: 2100,
    total: 8218, // pv(3908) + delivery1(1300) + delivery2(900) + delivery3(2100)
  },
  {
    data: "2024-01-28",
    pos: 4800,
    delivery1: 1100,
    delivery2: 750,
    delivery3: 1900,
    total: 8550, // pv(4800) + delivery1(1100) + delivery2(750) + delivery3(1900)
  },
  {
    data: "2024-01-29",
    pos: 3800,
    delivery1: 1400,
    delivery2: 950,
    delivery3: 2200,
    total: 8350, // pv(3800) + delivery1(1400) + delivery2(950) + delivery3(2200)
  },
  {
    data: "2024-01-30",
    pos: 4300,
    delivery1: 1600,
    delivery2: 1100,
    delivery3: 2300,
    total: 9300, // pv(4300) + delivery1(1600) + delivery2(1100) + delivery3(2300)
  },
];

const Chart = () => (
  <ComposedChart width={730} height={250} data={data}>
    <XAxis dataKey="data" />
    <YAxis />
    <Tooltip />
    <Legend />
    <CartesianGrid stroke="#f5f5f5" />
    <Bar dataKey="pos" barSize={20} fill="#413ea0" />
    <Bar dataKey="delivery1" stackId="a" barSize={20} fill="#82ca9d" />
    <Bar dataKey="delivery2" stackId="a" barSize={20} fill="#ffc658" />
    <Bar dataKey="delivery3" stackId="a" barSize={20} fill="#ff7300" />
    <Line type="monotone" dataKey="total" stroke="red" />
    <Line type="monotone" dataKey="pos" stroke="#413ea0" />
    <Line type="monotone" dataKey="delivery1" stroke="#82ca9d" />
    <Line type="monotone" dataKey="delivery2" stroke="#ffc658" />
    <Line type="monotone" dataKey="delivery3" stroke="#ff7300" />
  </ComposedChart>
);

export default Chart;
