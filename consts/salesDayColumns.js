import { useChangeFormatDateUTC } from "@/utils/useChangeFormatDate";

export const salesDayColumns = [
  {
    header: "가맹점명",
    accessor: "store",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "가맹점코드",
    accessor: "fran_code",
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
    header: "매출일자",
    accessor: "sale_date",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => useChangeFormatDateUTC(value.toLocaleString()),
  },
  {
    header: "물류매출액",
    accessor: "logi_sales",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => value.toLocaleString(),
  },
  {
    header: "기타배달매출액",
    accessor: "etc_sales",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => value.toLocaleString(),
  },
  {
    header: "배달의민족 매출액",
    accessor: "baemin_sales",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => value.toLocaleString(),
  },
  {
    header: "요기요 매출액",
    accessor: "yogiyo_sales",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => value.toLocaleString(),
  },
  {
    header: "쿠팡이츠 매출액",
    accessor: "coupang_sales",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => value.toLocaleString(),
  },
  {
    header: "포스 매출액",
    accessor: "pos_sales",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => value.toLocaleString(),
  },
];
