import { TABLE_COLUMN_TYPE } from "./common";

export const changeStoreAccountColumns = (t) => [
  {
    Header: "브랜드 명",
    accessor: "brand_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    noEdit: true,
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
    noEdit: true,
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
    Header: "POS구분",
    accessor: "pos_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (POS)",
    accessor: "pos_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (POS)",
    accessor: "pos_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (POS)",
    accessor: "pos_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (배민)",
    accessor: "bae_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (배민)",
    accessor: "bae_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (배민)",
    accessor: "bae_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (요기요)",
    accessor: "yogi_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (요기요)",
    accessor: "yogi_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (요기요)",
    accessor: "yogi_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (쿠팡이츠)",
    accessor: "cupang_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (쿠팡이츠)",
    accessor: "cupang_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (쿠팡이츠)",
    accessor: "cupang_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "배달앱1 구분",
    accessor: "etc1_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (배달앱1)",
    accessor: "etc1_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (배달앱1)",
    accessor: "etc1_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (배달앱1)",
    accessor: "etc1_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "배달앱2 구분",
    accessor: "etc2_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (배달앱2)",
    accessor: "etc2_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (배달앱2)",
    accessor: "etc2_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (배달앱2)",
    accessor: "etc2_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "배달앱3 구분",
    accessor: "etc3_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (배달앱3)",
    accessor: "etc3_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (배달앱3)",
    accessor: "etc3_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (배달앱3)",
    accessor: "etc3_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "배달앱4 구분",
    accessor: "etc4_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (배달앱4)",
    accessor: "etc4_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (배달앱4)",
    accessor: "etc4_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (배달앱4)",
    accessor: "etc4_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "배달앱5 구분",
    accessor: "etc5_name",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "ID (배달앱5)",
    accessor: "etc5_id",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "PW (배달앱5)",
    accessor: "etc5_pw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    Header: "STORE ID (배달앱5)",
    accessor: "etc5_sid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
];
