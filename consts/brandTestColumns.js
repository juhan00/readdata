import { TABLE_COLUMN_TYPE, TABLE_COLUMN_TYPE_USEFLAG } from "./common";

export const brandTestColumns = [
  {
    Header: "No",
    accessor: "no",
    HeaderStyle: {
      width: "5%",
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    type: TABLE_COLUMN_TYPE.NUMBER,
  },
  {
    Header: "브랜드 코드 제목",
    columns: [
      {
        Header: "브랜드 코드",
        accessor: "brand_code",
        HeaderStyle: {
          textAlign: "center",
        },
        cellStyle: {
          textAlign: "center",
        },
      },
      {
        Header: "브랜드명",
        accessor: "brand_name",
        HeaderStyle: {
          textAlign: "center",
        },
        cellStyle: {
          textAlign: "center",
        },
      },
    ],
  },
  {
    Header: "회사 정보 제목",
    columns: [
      {
        Header: "회사코드",
        accessor: "company_code",
        HeaderStyle: {
          textAlign: "center",
        },
        cellStyle: {
          textAlign: "center",
        },
      },

      {
        Header: "회사명",
        accessor: "company_name",
        HeaderStyle: {
          textAlign: "center",
        },
        cellStyle: {
          textAlign: "center",
        },
      },
    ],
  },
  {
    Header: "사용구분",
    accessor: "use_flag",
    HeaderStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    type: TABLE_COLUMN_TYPE_USEFLAG,
    rowspan: 2,
    Cell: ({ value }) => (Number(value) === 0 ? "사용안함" : "사용"),
  },
];
