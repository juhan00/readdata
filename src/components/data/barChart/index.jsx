import { useState, useRef, useEffect } from "react";
import { Area, Line, Bar, XAxis, YAxis, Text, Tooltip, CartesianGrid, Legend, ComposedChart, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { useRandomColor } from "@/utils/useRandomColor";

//styles
import styles from "./barChart.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const BarChart = ({ memoizedSalesDayChartData, headersData = [] }) => {
  const [showTotal, setShowTotal] = useState(true);
  const [showPos, setShowPos] = useState(false);
  const [showDelivery1, setShowDelivery1] = useState(false);
  const [showDelivery2, setShowDelivery2] = useState(false);
  const [showDelivery3, setShowDelivery3] = useState(false);

  const chartRef = useRef(null);

  const totalWidth = "100%";
  const colorSet = ["#30BBB4", "#EE0046", "#844528", "#124994", "#FF993B", "#FDDC37"];

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

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <Text x={x} y={y} textAnchor="end" verticalAnchor="middle" angle={0} fill="#666">
        {payload.value.toLocaleString()}
      </Text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p style={{ marbinBottom: "20px" }}>
            <strong>{`${label}`}</strong>
          </p>
          {payload.map((item, index) => {
            return <p style={{ color: item.color, fontWeight: "400" }} key={index}>{`${item.name} : ${item.value}`}</p>;
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div>
        <div ref={chartRef} style={{ overflowX: "auto", minWidth: "800px", maxWidth: "100%" }}>
          <ResponsiveContainer width={totalWidth} height={500}>
            <ComposedChart id="chart" data={memoizedSalesDayChartData}>
              <XAxis dataKey={"sale_date"} />
              <YAxis width={80} tick={<CustomYAxisTick />} />
              <Tooltip content={<CustomTooltip />} />
              <CustomLegend />
              <CartesianGrid stroke="#f5f5f5" />

              {headersData.map((header, index) => {
                if (header.accessor === "pos_sales") {
                  return (
                    <Bar
                      key={header.accessor}
                      dataKey={header.accessor}
                      name={header.header}
                      stackId={`bar-${header.accessor}`}
                      barSize={40}
                      fill={"#5E5E5E"}
                    />
                  );
                }
              })}

              {headersData.map((header, index) => {
                if (header.accessor !== "pos_sales") {
                  return (
                    <Bar
                      key={header.accessor}
                      dataKey={header.accessor}
                      name={header.header}
                      stackId={"bar-delivery"}
                      barSize={40}
                      fill={colorSet[index]}
                    />
                  );
                }
              })}

              {showTotal && <Line type="monotone" dataKey="total" stackId="line-total" stroke="red" />}
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
