import { TABLE_COLUMN_TYPE } from "./common";

export const dashboardColumns = (yesterday, thisMonthData) => {
  const dateColumns = [
    {
      Header: "브랜드명",
      rowspan: 2,
      columns: [
        {
          Header: "",
          accessor: "brand_name",
          headerStyle: {
            display: "none",
            textAlign: "center",
          },
          cellStyle: {
            textAlign: "center",
          },
        },
      ],
    },
    {
      Header: "가맹점수(사용)",
      rowspan: 2,
      columns: [
        {
          Header: "",
          accessor: "Mon.cnt",
          headerStyle: {
            display: "none",
            textAlign: "center",
          },
          cellStyle: {
            textAlign: "center",
          },
        },
      ],
    },
    {
      Header: `당월(${thisMonthData})`,
      columns: [
        {
          Header: "합게매출",
          accessor: "Mon.total",
          headerStyle: {
            textAlign: "center",
          },
          cellStyle: {
            textAlign: "center",
          },
          Cell: ({ value }) => value.toLocaleString(),
        },
      ],
    },
    {
      Header: `전일(${yesterday})`,
      columns: [
        {
          Header: "매출발생가맹점수",
          accessor: "Day.cnt",
          headerStyle: {
            textAlign: "center",
          },
          cellStyle: {
            textAlign: "center",
          },
        },
        {
          Header: "합계매출",
          accessor: "Day.total",
          headerStyle: {
            textAlign: "center",
          },
          cellStyle: {
            textAlign: "center",
          },
          Cell: ({ value }) => value.toLocaleString(),
        },
        {
          Header: "점평균매출",
          accessor: "Day.avg",
          headerStyle: {
            textAlign: "center",
          },
          cellStyle: {
            textAlign: "center",
          },
          Cell: ({ value }) => value.toLocaleString(),
        },
      ],
    },
  ];

  return dateColumns;
};
