export const salesAnalysisColumns = [{
    Header: "조회기간", columns: [
        {Header: "가맹점명", accessor: "brand_name",},
        {Header: "매출합꼐", accessor: "total",Cell: ({ value }) => value.toLocaleString(),},
        {Header: "일평균매출", accessor: "avg",Cell: ({ value }) => value.toLocaleString(),},
        {Header: "매출구분", columns:[
                {Header: "POS", accessor: "pos_sales",Cell: ({ value }) => value.toLocaleString(),},
                {Header: "배달", accessor: "delivery_sales",Cell: ({ value }) => value.toLocaleString(),},
            ]},


    ],



}];
