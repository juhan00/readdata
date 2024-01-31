import { useState, useRef } from "react";
import { Area, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ComposedChart, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

//styles
import styles from "./barChart.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const BarChart = () => {
  const data = [
    {
      date: "2024-01-24",
      pos: 2400,
      delivery1: 1500,
      delivery2: 1000,
      delivery3: 2000,
      total: 6900,
    },
    {
      date: "2024-01-25",
      pos: 1398,
      delivery1: 1200,
      delivery2: 800,
      delivery3: 1800,
      total: 5398,
    },
    {
      date: "2024-01-26",
      pos: 9800,
      delivery1: 1000,
      delivery2: 700,
      delivery3: 1500,
      total: 13000,
    },
    {
      date: "2024-01-27",
      pos: 3908,
      delivery1: 1300,
      delivery2: 900,
      delivery3: 2100,
      total: 8218,
    },
    {
      date: "2024-01-28",
      pos: 4800,
      delivery1: 1100,
      delivery2: 750,
      delivery3: 1900,
      total: 8550,
    },
    {
      date: "2024-01-29",
      pos: 3800,
      delivery1: 1400,
      delivery2: 950,
      delivery3: 2200,
      total: 8350,
    },
    {
      date: "2024-01-30",
      pos: 4300,
      delivery1: 1600,
      delivery2: 1100,
      delivery3: 2300,
      total: 9300,
    },
    {
      date: "2024-01-24",
      pos: 2400,
      delivery1: 1500,
      delivery2: 1000,
      delivery3: 2000,
      total: 6900,
    },
    {
      date: "2024-01-25",
      pos: 1398,
      delivery1: 1200,
      delivery2: 800,
      delivery3: 1800,
      total: 5398,
    },
    {
      date: "2024-01-26",
      pos: 9800,
      delivery1: 1000,
      delivery2: 700,
      delivery3: 1500,
      total: 13000,
    },
    {
      date: "2024-01-27",
      pos: 3908,
      delivery1: 1300,
      delivery2: 900,
      delivery3: 2100,
      total: 8218,
    },
    {
      date: "2024-01-28",
      pos: 4800,
      delivery1: 1100,
      delivery2: 750,
      delivery3: 1900,
      total: 8550,
    },
    {
      date: "2024-01-29",
      pos: 3800,
      delivery1: 1400,
      delivery2: 950,
      delivery3: 2200,
      total: 8350,
    },
    {
      date: "2024-01-30",
      pos: 4300,
      delivery1: 1600,
      delivery2: 1100,
      delivery3: 2300,
      total: 9300,
    },
    {
      date: "2024-01-24",
      pos: 2400,
      delivery1: 1500,
      delivery2: 1000,
      delivery3: 2000,
      total: 6900,
    },
    {
      date: "2024-01-25",
      pos: 1398,
      delivery1: 1200,
      delivery2: 800,
      delivery3: 1800,
      total: 5398,
    },
    {
      date: "2024-01-26",
      pos: 9800,
      delivery1: 1000,
      delivery2: 700,
      delivery3: 1500,
      total: 13000,
    },
    {
      date: "2024-01-27",
      pos: 3908,
      delivery1: 1300,
      delivery2: 900,
      delivery3: 2100,
      total: 8218,
    },
    {
      date: "2024-01-28",
      pos: 4800,
      delivery1: 1100,
      delivery2: 750,
      delivery3: 1900,
      total: 8550,
    },
    {
      date: "2024-01-29",
      pos: 3800,
      delivery1: 1400,
      delivery2: 950,
      delivery3: 2200,
      total: 8350,
    },
    {
      date: "2024-01-30",
      pos: 4300,
      delivery1: 1600,
      delivery2: 1100,
      delivery3: 2300,
      total: 9300,
    },
    {
      date: "2024-01-24",
      pos: 2400,
      delivery1: 1500,
      delivery2: 1000,
      delivery3: 2000,
      total: 6900,
    },
    {
      date: "2024-01-25",
      pos: 1398,
      delivery1: 1200,
      delivery2: 800,
      delivery3: 1800,
      total: 5398,
    },
    {
      date: "2024-01-26",
      pos: 9800,
      delivery1: 1000,
      delivery2: 700,
      delivery3: 1500,
      total: 13000,
    },
    {
      date: "2024-01-27",
      pos: 3908,
      delivery1: 1300,
      delivery2: 900,
      delivery3: 2100,
      total: 8218,
    },
    {
      date: "2024-01-28",
      pos: 4800,
      delivery1: 1100,
      delivery2: 750,
      delivery3: 1900,
      total: 8550,
    },
    {
      date: "2024-01-29",
      pos: 3800,
      delivery1: 1400,
      delivery2: 950,
      delivery3: 2200,
      total: 8350,
    },
    {
      date: "2024-01-30",
      pos: 4300,
      delivery1: 1600,
      delivery2: 1100,
      delivery3: 2300,
      total: 9300,
    },
    {
      date: "2024-01-24",
      pos: 2400,
      delivery1: 1500,
      delivery2: 1000,
      delivery3: 2000,
      total: 6900,
    },
    {
      date: "2024-01-25",
      pos: 1398,
      delivery1: 1200,
      delivery2: 800,
      delivery3: 1800,
      total: 5398,
    },
    {
      date: "2024-01-26",
      pos: 9800,
      delivery1: 1000,
      delivery2: 700,
      delivery3: 1500,
      total: 13000,
    },
    {
      date: "2024-01-27",
      pos: 3908,
      delivery1: 1300,
      delivery2: 900,
      delivery3: 2100,
      total: 8218,
    },
    {
      date: "2024-01-28",
      pos: 4800,
      delivery1: 1100,
      delivery2: 750,
      delivery3: 1900,
      total: 8550,
    },
    {
      date: "2024-01-29",
      pos: 3800,
      delivery1: 1400,
      delivery2: 950,
      delivery3: 2200,
      total: 8350,
    },
    {
      date: "2024-01-30",
      pos: 4300,
      delivery1: 1600,
      delivery2: 1100,
      delivery3: 2300,
      total: 9300,
    },
    {
      date: "2024-01-24",
      pos: 2400,
      delivery1: 1500,
      delivery2: 1000,
      delivery3: 2000,
      total: 6900,
    },
    {
      date: "2024-01-25",
      pos: 1398,
      delivery1: 1200,
      delivery2: 800,
      delivery3: 1800,
      total: 5398,
    },
    {
      date: "2024-01-26",
      pos: 9800,
      delivery1: 1000,
      delivery2: 700,
      delivery3: 1500,
      total: 13000,
    },
    {
      date: "2024-01-27",
      pos: 3908,
      delivery1: 1300,
      delivery2: 900,
      delivery3: 2100,
      total: 8218,
    },
    {
      date: "2024-01-28",
      pos: 4800,
      delivery1: 1100,
      delivery2: 750,
      delivery3: 1900,
      total: 8550,
    },
    {
      date: "2024-01-29",
      pos: 3800,
      delivery1: 1400,
      delivery2: 950,
      delivery3: 2200,
      total: 8350,
    },
    {
      date: "2024-01-30",
      pos: 4300,
      delivery1: 1600,
      delivery2: 1100,
      delivery3: 2300,
      total: 9300,
    },
  ];

  const [showTotal, setShowTotal] = useState(true);
  const [showPos, setShowPos] = useState(false);
  const [showDelivery1, setShowDelivery1] = useState(false);
  const [showDelivery2, setShowDelivery2] = useState(false);
  const [showDelivery3, setShowDelivery3] = useState(false);

  const chartRef = useRef(null);

  // const tableData = ["data1", "data2", "data3", "data4", "data5"];
  // const column = ["column1", "column2", "column3", "column4", "column5"];
  const totalWidth = data.length * 100;

  const SaveChartImage = async () => {
    const chartImage = await html2canvas(chartRef.current);
    chartImage.toBlob((blob) => {
      saveAs(blob, "chart_image.png");
    });
  };

  const handleLegendClick = (dataKey) => {
    switch (dataKey) {
      case "total":
        setShowTotal(!showTotal);
        break;
      case "pos":
        setShowPos(!showPos);
        break;
      case "delivery1":
        setShowDelivery1(!showDelivery1);
        break;
      case "delivery2":
        setShowDelivery2(!showDelivery2);
        break;
      case "delivery3":
        setShowDelivery3(!showDelivery3);
        break;
      default:
        break;
    }
  };

  const CustomLegend = () => (
    <div className="custom-legend">
      <span onClick={() => handleLegendClick("total")} className={showTotal ? "active" : ""}>
        Total
      </span>
      <span onClick={() => handleLegendClick("pos")} className={showPos ? "active" : ""}>
        Pos
      </span>
      <span onClick={() => handleLegendClick("delivery1")} className={showDelivery1 ? "active" : ""}>
        Delivery1
      </span>
      <span onClick={() => handleLegendClick("delivery2")} className={showDelivery2 ? "active" : ""}>
        Delivery2
      </span>
      <span onClick={() => handleLegendClick("delivery3")} className={showDelivery3 ? "active" : ""}>
        Delivery3
      </span>
    </div>
  );

  return (
    <>
      <div>
        <div ref={chartRef} style={{ overflowX: "auto", minWidth: "800px", maxWidth: "100%" }}>
          <ResponsiveContainer width={totalWidth} height={500}>
            <ComposedChart id="chart" data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CustomLegend />
              <CartesianGrid stroke="#f5f5f5" />

              <Bar dataKey="pos" stackId="bar-pos" barSize={40} fill="#413ea0" />
              <Bar dataKey="delivery1" stackId="bar-delivery" barSize={40} fill="#82ca9d" />
              <Bar dataKey="delivery2" stackId="bar-delivery" barSize={40} fill="#ffc658" />
              <Bar dataKey="delivery3" stackId="bar-delivery" barSize={40} fill="#ff7300" />

              {showTotal && <Line type="monotone" dataKey="total" stackId="line-total" stroke="red" />}
              {showPos && <Line type="monotone" dataKey="pos" stackId="line-pos" stroke="#413ea0" />}
              {showDelivery1 && <Line type="monotone" dataKey="delivery1" stackId="line-delivery1" stroke="#82ca9d" />}
              {showDelivery2 && <Line type="monotone" dataKey="delivery2" stackId="line-delivery2" stroke="#ffc658" />}
              {showDelivery3 && <Line type="monotone" dataKey="delivery3" stackId="line-delivery3" stroke="#ff7300" />}
            </ComposedChart>
          </ResponsiveContainer>
          <CustomLegend />
          <button onClick={() => SaveChartImage()}>Save Chart as Image</button>
        </div>
      </div>
    </>
  );
};

export default BarChart;
