import { TABLE_COLUMN_TYPE } from "./common";

export const storeColumns = [
  {
    header: "가맹점 코드",
    accessor: "fran_code",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "가맹점 명",
    accessor: "fran_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "사업자등록번호",
    accessor: "bizno",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "브랜드 코드",
    accessor: "brand_code",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "브랜드 명",
    accessor: "brand_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "사용 구분",
    accessor: "use_flag",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    type: TABLE_COLUMN_TYPE.USEFLAG,
    Cell: ({ value }) => (Number(value) === 0 ? "사용안함" : "사용"),
  },
];
