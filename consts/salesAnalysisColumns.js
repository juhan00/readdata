import {TABLE_COLUMN_TYPE} from "@/consts/common";

export const salesAnalysisColumns1 = (dates, headers1, startDate, endDate) => {
    const dateColumns = [{
        //조회기간
        Header: `조회기간 (${startDate} ~ ${endDate})`, columns: [
            /*{
                Header: "매출일자", rowspan: 3, columns: [{
                    Header: "", accessor: "chk_sale_date", headerStyle: {
                        display: "none", textAlign: "center",
                    }, cellStyle: {
                        textAlign: "center",
                    }, //Cell: ({ value }) => value.toLocaleString(),
                },
                ],
            },*/
            {
            Header: "가맹점명", rowspan: 2, columns: [{
                Header: "", accessor: "chk_fran_name", headerStyle: {
                    display: "none", textAlign: "center",
                }, cellStyle: {
                    textAlign: "center",
                }, Cell: ({ value }) => value.toLocaleString(),
            },


            ],
        },

            {
            Header: "매출합계", rowspan: 2, columns: [{
                Header: "", accessor: "chk_total", headerStyle: {
                    display: "none", textAlign: "center",
                }, cellStyle: {
                    textAlign: "center",
                }, Cell: ({ value }) => value.toLocaleString(),
            },],
        }, {
            Header: "일평균매출", rowspan: 2, columns: [{
                Header: "", accessor: "chk_avg", headerStyle: {
                    display: "none", textAlign: "center",
                }, cellStyle: {
                    textAlign: "center",
                }, Cell: ({ value }) => value.toLocaleString(),
            },],
        },


            ...dates.map((date) => ({
                Header: date, columns: headers1.map((header, index) => ({
                    id: `${header.accessor}${date}`, Header: header.header,

                    //accessor: `data[${index}].${header.accessor}`,
                    //원래 위에 코드이지만 salesAnalysisColumns은 rowSpan이 들어가서 이렇게 accessor을 가져옴
                    accessor: `${header.accessor}`,

                    key: header.accessor, headerStyle: {
                        textAlign: "center",
                    }, cellStyle: {
                        textAlign: "center",
                    }, Cell: ({ value }) => value.toLocaleString(),
                })),
            })),

        ],
    },

       ]
    return dateColumns;
};

export const salesAnalysisColumns2 = (dates, headers1, startDate, endDate) => {
    const dateColumns = [{
        //조회기간
        Header: `대비기간 (${startDate} ~ ${endDate})`, columns: [
            /*{
                Header: "매출일자", rowspan: 3, columns: [{
                    Header: "", accessor: "pre_sale_date", headerStyle: {
                        display: "none", textAlign: "center",
                    }, cellStyle: {
                        textAlign: "center",
                    }, //Cell: ({ value }) => value.toLocaleString(),
                },
                ],
            },*/
            {
            Header: "가맹점명", rowspan: 2, columns: [{
                Header: "", accessor: "pre_fran_name", headerStyle: {
                    display: "none", textAlign: "center",
                }, cellStyle: {
                    textAlign: "center",
                }, Cell: ({ value }) => value.toLocaleString(),
            },

            ],
        }, {
            Header: "매출합계", rowspan: 2, columns: [{
                Header: "", accessor: "pre_total", headerStyle: {
                    display: "none", textAlign: "center",
                }, cellStyle: {
                    textAlign: "center",
                }, Cell: ({ value }) => value.toLocaleString(),
            },],
        }, {
            Header: "일평균매출", rowspan: 2, columns: [{
                Header: "", accessor: "pre_avg", headerStyle: {
                    display: "none", textAlign: "center",
                }, cellStyle: {
                    textAlign: "center",
                }, Cell: ({ value }) => value.toLocaleString(),
            },],
        },

            ...dates.map((date) => ({
                Header: date, columns: headers1.map((header, index) => ({
                    id: `${header.accessor}${date}`, Header: header.header,

                    //accessor: `data[${index}].${header.accessor}`,
                    //원래 위에 코드이지만 salesAnalysisColumns은 rowSpan이 들어가서 이렇게 accessor을 가져옴
                    accessor: `${header.accessor}`,

                    key: header.accessor, headerStyle: {
                        textAlign: "center",
                    }, cellStyle: {
                        textAlign: "center",
                    }, Cell: ({ value }) => value.toLocaleString(),
                })),
            })),

        ],
    },

    ]
    return dateColumns;
};

export const salesAnalysisPopupColumns = (t) => [
    {
        Header: "브랜드명",
        accessor: "chk_fran_name",
        headerStyle: {
            textAlign: "center",
        },
        cellStyle: {
            textAlign: "center",
        },
    },

];