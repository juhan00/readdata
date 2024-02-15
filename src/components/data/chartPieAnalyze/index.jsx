import React from "react";
import { PieChart, Pie, Tooltip, Cell, Label, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF19AF"];

const ChartPieAnalyze = ({ data, title }) => (
    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
        {data.some(entry => entry.value == 0) ? (
            <>
                <h1>{title}</h1>
                <h2 style={{marginTop:'8rem'}}>데이터가 없습니다.</h2>
            </>
        ) : (
            <>
                <h1>{title}</h1>
                <ResponsiveContainer width={"100%"} height={180}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            startAngle={90} // 시작 각도
                            endAngle={450} // 시작 각도 + 360
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={({ payload }) => renderTooltipContent(payload)} />
                    </PieChart>
                </ResponsiveContainer>
                <div style={{ marginTop: "10px", fontSize: "16px", fontWeight: "bold" }}>
                    {data.map((entry, index) => (
                        <span key={`label-${index}`} style={{ color: COLORS[index % COLORS.length] }}>
              {`${entry.name} ■`}
            </span>
                    ))}
                </div>
            </>
        )}
    </div>
);
const renderTooltipContent = (payload) => {
    return (
        <div style={{ backgroundColor: "#fff", padding: "5px", border: "1px solid #ccc" }}>
            {payload.map((entry, index) => (
                <p
                    key={`tooltip-${index}`}
                    style={{ color: "black", margin: 0, padding: "5px", cursor: "default" }}
                >
                    {`${entry.name}: ${entry.value.toLocaleString()}`}
                </p>
            ))}
        </div>
    );
};

export default ChartPieAnalyze;
