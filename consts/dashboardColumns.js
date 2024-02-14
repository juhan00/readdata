import { TABLE_COLUMN_TYPE } from "./common";

export const changeDashBrandColumns = (t, yesterday, thisMonthData) => {
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

export const changeDashDayMonthColumns = (t) => [
  {
    Header: "상위 5개점",
    headerStyle: {
      textAlign: "center",
      backgroundColor: "#FFC2BF",
    },
    columns: [
      {
        Header: "가맹점명",
        accessor: "high5.fran_name",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#FFC2BF",
        },
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        Header: "매출액(POS+배달)",
        accessor: "high5.high5",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#FFC2BF",
        },
        cellStyle: {
          textAlign: "center",
        },
        Cell: ({ value }) => value?.toLocaleString(),
      },
    ],
  },
  {
    Header: "하위 5개점",
    headerStyle: {
      textAlign: "center",
      backgroundColor: "#CBDFFD",
    },
    columns: [
      {
        Header: "가맹점명",
        accessor: "low5.fran_name",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#CBDFFD",
        },
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        Header: "매출액(POS+배달)",
        accessor: "low5.low5",
        headerStyle: {
          textAlign: "center",
          backgroundColor: "#CBDFFD",
        },
        cellStyle: {
          textAlign: "center",
        },
        Cell: ({ value }) => value?.toLocaleString(),
      },
    ],
  },
];
