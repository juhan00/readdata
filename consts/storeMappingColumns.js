import { useChangeFormatDateUTC } from "@/utils/useChangeFormatDate";

export const storeMappingColumns = [
  {
    Header: "가맹점명(리드데이타)",
    accessor: "fran_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    noEdit: true,
  },
  {
    Header: "가맹점명(POS)",
    accessor: "scrap_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    noEdit: true,
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
    noEdit: true,
  },
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
    Header: "가맹점코드",
    accessor: "fran_code",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
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
    Cell: ({ value }) => useChangeFormatDateUTC(value),
  },
];
