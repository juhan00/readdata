export const userColumns = [
  {
    header: "사용자 ID",
    accessor: "uid",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "사용자 PW",
    accessor: "upw",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
  },
  {
    header: "사용자명",
    accessor: "uname",
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
    header: "사용권한",
    accessor: "authority",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    type: "authority",
    Cell: ({ value }) => (Number(value) === 0 ? "사용자" : "관리자"),
  },
  {
    header: "사용여부",
    accessor: "use_flag",
    headerStyle: {
      textAlign: "center",
    },
    cellStyle: {
      textAlign: "center",
    },
    type: "useflag",
    Cell: ({ value }) => (Number(value) === 0 ? "사용안함" : "사용"),
  },
];