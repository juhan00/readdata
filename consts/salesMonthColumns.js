import { useChangeFormatDateUTC } from "@/utils/useChangeFormatDate";

export const salesMonthColumns = [
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
    Header: "매출일자",
    accessor: "sale_month",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "물류매출액",
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
    Header: "기타배달매출액",
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
    Header: "배달의민족 매출액",
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
    Header: "요기요 매출액",
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
    Header: "쿠팡이츠 매출액",
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
    Header: "포스 매출액",
    accessor: "pos_sales",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => value.toLocaleString(),
  },
  {
    Header: "영업일 수",
    accessor: "work_day",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    Cell: ({ value }) => value.toLocaleString(),
  },
];
