import { useChangeFormatDateUTC } from "@/utils/useChangeFormatDate";
import { TABLE_COLUMN_TYPE } from "./common";

export const storeColumns = [
  {
    Header: "브랜드 코드",
    accessor: "brand_code",
    headerStyle: {
      display: "none",
      textAlign: "center",
    },
    cellStyle: {
      display: "none",
      textAlign: "center",
    },
  },
  {
    Header: "브랜드 명",
    accessor: "brand_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "가맹점 코드",
    accessor: "fran_code",
    headerStyle: {
      display: "none",
      textAlign: "center",
    },
    cellStyle: {
      display: "none",
      textAlign: "center",
    },
  },
  {
    Header: "가맹점 명",
    accessor: "fran_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "사업자등록번호",
    accessor: "bizno",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },

  {
    Header: "사용 구분",
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
  {
    Header: "등록일자",
    accessor: "reg_date",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    noEdit: true,
    Cell: ({ value }) => useChangeFormatDateUTC(value),
  },
  {
    Header: "수정일자",
    accessor: "update_date",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    noEdit: true,
    Cell: ({ value }) => useChangeFormatDateUTC(value),
  },
];
