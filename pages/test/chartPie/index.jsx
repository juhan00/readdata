import { useState, useRef, useEffect, useMemo } from "react";
import { PieChart, Pie, Tooltip, Cell, Label, ResponsiveContainer } from "recharts";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { useRandomColor } from "@/utils/useRandomColor";
import BtnChartSave from "../button/btnChartSave";

//styles
import styles from "./chartPie.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);
const COLORS = [
    "#C8CB30",
    "#CF567A",
    "#7140D8",
    "#E558B5",
    "#923D7F",
    "#388BEC",
    "#8CC63E",
    "#FDDC37",
    "#F66223",
    "#FF993B",
    "#30BBB4",
    "#9177F7",
    "#D19661",
    "#B5594C",
    "#384C72",
    "#864F94",
    "#B1A118",
    "#1569A6",
    "#C585DC",
    "#6BC5E1",
];

const CustomTooltip = ({ active, payload, total }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const percent = ((data.value / total) * 100).toFixed(0);
        return (
            <div className={cx("custom-tooltip")}>
                <p className={cx("label")} style={{ color: data.fill }}>
                    {data.name}
                </p>
                <p className={cx("value")}>
                    {data.value.toLocaleString()} ({percent}%)
                </p>
            </div>
        );
    }
    return null;
};

const ChartPie = ({ memoizedSalesRegionChartData }) => {
    const chartRef = useRef(null);

    const SaveChartImage = async () => {
        const chartImage = await html2canvas(chartRef.current);
        chartImage.toBlob((blob) => {
            saveAs(blob, "chart_image.png");
        });
    };

    const total = useMemo(() => {
        return memoizedSalesRegionChartData.reduce((sum, entry) => sum + entry.value, 0);
    }, [memoizedSalesRegionChartData]);

    return (
        <div className={cx("chart-wrap")}>
            <div className={cx("btn-wrap")}>
                <BtnChartSave onClick={() => SaveChartImage()} />
            </div>
            <div className={cx("chart")}>
                <ResponsiveContainer width={"100%"} height={250}>
                    <PieChart>
                        <Pie
                            data={memoizedSalesRegionChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            labelLine={false}
                            label={(entry) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                            // label={(entry) => `${entry.name}: ${entry.value},${(entry.percent * 100).toFixed(0)}%`}
                        >
                            {memoizedSalesRegionChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip total={total} />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartPie;