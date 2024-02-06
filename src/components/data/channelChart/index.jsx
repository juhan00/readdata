import { useState, useRef, useEffect } from "react";
import { Area, Line, Bar, XAxis, YAxis, Text, Tooltip, CartesianGrid, Legend, ComposedChart, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { useRandomColor } from "@/utils/useRandomColor";
import BtnChartSave from "../button/btnChartSave";
import isEqual from "lodash/isEqual";

//styles
import styles from "./channelChart.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const ChannelChart = ({ memoizedSalesDayChartData, headersData = [] }) => {
  const [showLine, setShowLine] = useState([]);

  const chartRef = useRef(null);
  const totalWidth = memoizedSalesDayChartData.length <= 7 ? "100%" : memoizedSalesDayChartData.length * 100;
  const colorSet = ["#30BBB4", "#EE0046", "#844528", "#124994", "#FF993B", "#FDDC37"];

  useEffect(() => {
    if (headersData.length === 0) {
      return;
    }

    let newData = {};
    headersData?.map((item) => {
      newData[item.accessor] = true;
    });

    setShowLine(newData);
  }, [headersData]);

  const SaveChartImage = async () => {
    const chartImage = await html2canvas(chartRef.current);
    chartImage.toBlob((blob) => {
      saveAs(blob, "chart_image.png");
    });
  };

  const handleLegendClick = (dataKey) => {
    setShowLine((prevData) => ({
      ...prevData,
      [dataKey]: !prevData[dataKey],
    }));
  };

  const CustomLegend = () => (
    <div className={cx("custom-legend")}>
      {headersData.map((header, index) => {
        return (
          <div key={header.accessor} className={cx("label")} onClick={() => handleLegendClick(header.accessor)}>
            <span className={cx("line")} style={{ backgroundColor: colorSet[index] }}></span>
            {header.header}
          </div>
        );
      })}
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
        <div className={cx("custom-tooltip")}>
          <p className={cx("label")}>
            <strong>{`${label}`}</strong>
          </p>
          {payload.map((item, index) => {
            return (
              <p className={cx("item")} style={{ color: item.color, fontWeight: "400" }} key={index}>{`${
                item.name === "total" ? "전체" : item.name
              } : ${item.value.toLocaleString()}`}</p>
            );
          })}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cx("chart")}>
      <div className={cx("btn-wrap")}>
        <BtnChartSave onClick={() => SaveChartImage()} />
      </div>

      <div ref={chartRef}>
        <CustomLegend className={cx("custom-legend")} />
        <div className={cx("chart-container")}>
          <ResponsiveContainer width={totalWidth} height={"100%"}>
            <ComposedChart id="chart" data={memoizedSalesDayChartData}>
              <XAxis dataKey={"sale_date"} />
              <YAxis width={80} tick={<CustomYAxisTick />} />
              <Tooltip content={<CustomTooltip />} />
              <CartesianGrid stroke="#f5f5f5" />

              {headersData.map((header, index) => {
                return (
                  showLine[header.accessor] && (
                    <Line
                      key={header.accessor}
                      type="monotone"
                      dataKey={header.accessor}
                      stackId={`line-${header.accessor}`}
                      stroke={colorSet[index]}
                    />
                  )
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChannelChart;
