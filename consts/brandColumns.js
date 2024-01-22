import { TABLE_COLUMN_TYPE_NUMBER } from "./common";

export const brandColumns = [
  {
    header: "No",
    accessor: "no",
    headerStyle: {
      width: "5%",
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    type: TABLE_COLUMN_TYPE_NUMBER,
  },
  {
    header: "브랜드 코드",
    accessor: "brand_code",
    headerStyle: {
      // width: "10%",
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "브랜드명",
    accessor: "brand_name",
    headerStyle: {
      // width: "30%",
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "left",
    },
  },
  {
    header: "사용구분",
    accessor: "brand_flag",
    headerStyle: {
      // width: "10%",
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
];
