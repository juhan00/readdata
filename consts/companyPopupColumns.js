import { TABLE_COLUMN_TYPE } from "./common";

export const changeCompanyPopupColumns = (t) => [
  {
    Header: "회사코드",
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
    Header: "회사명",
    accessor: "company_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
];
