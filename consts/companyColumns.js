import { TABLE_COLUMN_TYPE } from "./common";

export const companyColumns = [
  {
    header: "회사코드",
    accessor: "company_code",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
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
];
