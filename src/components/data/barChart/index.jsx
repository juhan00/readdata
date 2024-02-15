import { useState, useRef, useEffect } from "react";
import { Area, Line, Bar, XAxis, YAxis, Text, Tooltip, CartesianGrid, Legend, ComposedChart, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { useRandomColor } from "@/utils/useRandomColor";
import BtnChartSave from "../button/btnChartSave";

//styles
import styles from "./barChart.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const BarChart = ({ memoizedSalesDayChartData, headersData = [], storeCountData, dataKey = "sale_date" }) => {
  console.log("차트에서구분1 2 갯수=",storeCountData);
  console.log("차트에서구분1 2 갯수=",storeCountData.gubun1Data);
  console.log("차트에서memoizedSalesDayChartData=",memoizedSalesDayChartData);
  const chartRef = useRef(null);
  const totalWidth = memoizedSalesDayChartData.length <= 7 ? "100%" : memoizedSalesDayChartData.length * 100;
  const colorSet = ["#30BBB4", "#EE0046", "#844528", "#124994", "#FF993B", "#FDDC37"];
  const SaveChartImage = async () => {
    if (!chartRef.current) return;

    const chartImage = await html2canvas(chartRef.current);
    chartImage.toBlob((blob) => {
      saveAs(blob, "chart_image.png");
    });
  };

  const CustomLegend = () => (
    <div className={cx("custom-legend")}>
      {headersData.map((header, index) => {
        return (
          <div key={header.accessor} className={cx("label")}>
            <span className={cx("box")} style={{ backgroundColor: colorSet[index] }}></span>
            {header.header}
          </div>
        );
      })}
      <div className={cx("label")}>
        <span className={cx("line")} style={{ backgroundColor: "#FC2534" }}></span>
        전체
      </div>
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
              } : ${item.value.toLocaleString()}`} </p>
            );
          })}

          {storeCountData.gubun1Data.map((item, index) => {
            return (
                <p className={cx("item")} style={{ color: item.color, fontWeight: "400" }} key={index}>
                  가맹점 개수{item.count.toLocaleString()}</p>
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

      <CustomLegend className={cx("custom-legend")} />
      <div className={cx("chart-container")}>
        <div className={cx("chart-ref")} ref={chartRef}>
          <ResponsiveContainer width={totalWidth} height={"100%"}>
            <ComposedChart id="chart" data={memoizedSalesDayChartData}>
              <XAxis dataKey={dataKey} />
              <YAxis width={80} tick={<CustomYAxisTick />} />
              <Tooltip content={<CustomTooltip />} />
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

              <Line type="monotone" dataKey="total" stackId="line-total" stroke="#FC2534" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
