import { useChangeFormatDateUTC } from "@/utils/useChangeFormatDate";
import { TABLE_COLUMN_TYPE } from "./common";

export const companyColumns = [
  {
    header: "회사코드",
    accessor: "company_code",
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
    header: "회사명",
    accessor: "company_name",
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
    header: "대표자명",
    accessor: "boss",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "이메일",
    accessor: "email",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "전화번호",
    accessor: "phone",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "회사주소",
    accessor: "addr",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    type: TABLE_COLUMN_TYPE.ADDRESS,
  },
  {
    header: "사용여부",
    accessor: "flag",
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
    header: "등록일자",
    accessor: "reg_date",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => useChangeFormatDateUTC(value),
  },
  {
    header: "수정일자",
    accessor: "update_date",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => useChangeFormatDateUTC(value),
  },
];
