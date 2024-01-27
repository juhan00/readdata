export const salesTestMonthColumns = (dates, headers) => {
  const dateColumns = [
    {
      Header: "매출일자",
      columns: [
        {
          Header: "가맹점명",
          accessor: "store",
          headerStyle: {
            textAlign: "center",
          },
          cellStyle: {
            textAlign: "center",
          },
        },
      ],
    },
    ...dates.map((date) => ({
      Header: date,
      columns: headers.map((header, index) => ({
        id: `${header.accessor}${date}`,
        Header: header.header,
        accessor: `data[${index}].${header.accessor}`,
        key: header.accessor,
        headerStyle: {
          textAlign: "center",
        },
        cellStyle: {
          textAlign: "center",
        },
        Cell: ({ value }) => value.toLocaleString(),
      })),
    })),
  ];

  return dateColumns;
};

// export const salesTestMonthColumns = (dates, headers) => {
//   const dateColumns = [
//     {
//       Header: "매출일자",
//       columns: [
//         {
//           Header: "가맹점명",
//           accessor: "store",
//           headerStyle: {
//             textAlign: "center",
//           },
//           cellStyle: {
//             textAlign: "center",
//           },
//         },
//       ],
//     },
//     ...dates.map((date) => ({
//       Header: date,
//       columns: headers.map((header) => ({
//         id: `${header.accessor}_${date}`,
//         Header: header.header,
//         accessor: header.accessor,
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       })),
//     })),
//   ];

//   return dateColumns;
// };

// export const salesMonthColumns = [
//   {
//     Header: "매출일자",
//     columns: [
//       {
//         Header: "가맹점명",
//         accessor: "store",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//     ],
//   },
//   {
//     Header: "2024-01-01",
//     accessor: "2024-01-01",
//     columns: [
//       {
//         Header: "배달의민족 매출",
//         accessor: "baemin_sales_20240101",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "요기요 매출",
//         accessor: "yogiyo_sales_20240101",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//     ],
//   },
//   {
//     Header: "2024-01-02",
//     accessor: "2024-01-02",
//     columns: [
//       {
//         Header: "배달의민족 매출",
//         accessor: "baemin_sales_20240102",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "요기요 매출",
//         accessor: "yogiyo_sales_20240102",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//     ],
//   },
//   {
//     Header: "2024-01-03",
//     accessor: "2024-01-03",
//     columns: [
//       {
//         Header: "배달의민족 매출",
//         accessor: "baemin_sales_20240103",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "요기요 매출",
//         accessor: "yogiyo_sales_20240103",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//     ],
//   },
// ];

// export const salesMonthColumns = [
//   {
//     Header: "매출일자",
//     columns: [
//       {
//         Header: "가맹점명",
//         accessor: "store",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//     ],
//   },
//   {
//     Header: "2024-01-01",
//     columns: [
//       {
//         Header: "배달의민족 매출",
//         id: "baemin_sales_20240101",
//         key: "baemin_sales",
//         accessor: "group.baemin_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "요기요 매출",
//         id: "yogiyo_sales_20240101",
//         key: "yogiyo_sales",
//         accessor: "group.yogiyo_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "POS 매출",
//         id: "pos_sales_20240101",
//         key: "pos_sales",
//         accessor: "group.pos_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//     ],
//   },
//   {
//     Header: "2024-01-02",
//     columns: [
//       {
//         Header: "배달의민족 매출",
//         id: "baemin_sales_20240102",
//         key: "baemin_sales",
//         accessor: "group.baemin_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "요기요 매출",
//         id: "yogiyo_sales_20240102",
//         key: "yogiyo_sales",
//         accessor: "group.yogiyo_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "POS 매출",
//         id: "pos_sales_20240102",
//         key: "pos_sales",
//         accessor: "group.pos_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//     ],
//   },
//   {
//     Header: "2024-01-03",
//     columns: [
//       {
//         Header: "배달의민족 매출",
//         id: "baemin_sales_20240103",
//         key: "baemin_sales",
//         accessor: "group.baemin_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "요기요 매출",
//         id: "yogiyo_sales_20240103",
//         key: "yogiyo_sales",
//         accessor: "group.yogiyo_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//       {
//         Header: "POS 매출",
//         id: "pos_sales_20240103",
//         key: "pos_sales",
//         accessor: "group[2].pos_sales",
//         headerStyle: {
//           textAlign: "center",
//         },
//         cellStyle: {
//           textAlign: "center",
//         },
//       },
//     ],
//   },
// ];
