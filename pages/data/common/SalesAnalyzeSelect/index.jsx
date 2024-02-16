import { SEARCH_TYPE } from "@/consts/common";
import { salesAnalysisColumns1, salesAnalysisColumns2 } from "@/consts/salesAnalysisColumns";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import { getSalesAnalysisList, getSalesCompareAnalysisList } from "@/utils/api/salesAnalysis";
import { useChangeFormatDate } from "@/utils/useChangeFormatDate";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import SearchItem from "@/src/components/data/searchItem";
import DataPopupLayout from "@/layouts/dataPopupLayout";
import PopupSearchFranchise from "@/src/components/data/popup/popupSearchFranchise";

//styles
import className from "classnames/bind";
import styles from "./SalesAnalyzeSelect.module.scss";

import { POPUP_SEARCH } from "@/consts/popup";
import { useGlobalState } from "@/context/globalStateContext";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import CheckBox from "@/src/components/data/checkBox";

const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesAnalysisSelect = () => {
    const searchFieldData = {
        chk_fran_name: "",
        pre_fran_name: "",
    };

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    const { t } = useTranslation(["common", "dataAdmin"]);

    //조회기간 테이블
    const [tableState, setTableState] = useState([]);
    //대비기간 테이블
    const [compareTableState, setCompareTableState] = useState([]);

    //조회기간 검색
    const [searchData, setSearchData] = useState(searchFieldData);
    const [searchField, setSearchField] = useState(searchFieldData);
    //대비기간 검색
    const [searchCompareData, setSearchCompareData] = useState(searchFieldData);
    const [searchCompareField, setSearchCompareField] = useState(searchFieldData);

    //사용안함 여부
    const [useFlag, setUseFlag] = useState(false);

    //조회기간-달력
    const [startDate, setStartDate] = useState(oneMonthAgo);
    const [endDate, setEndDate] = useState(today);
    //대비기간-달력
    const [compareStartDate, setCompareStartDate] = useState(oneMonthAgo);
    const [compareEndDate, setCompareEndDate] = useState(today);

    //조회기간 시간
    const formatStartDate = useMemo(() => {
        return useChangeFormatDate(startDate);
    }, [startDate]);
    //조회기간 시간 포맷
    const formatEndDate = useMemo(() => {
        return useChangeFormatDate(endDate);
    }, [endDate]);
    //대비기간 시간 포맷
    const formatCompareStartDate = useMemo(() => {
        return useChangeFormatDate(compareStartDate);
    }, [compareStartDate]);
    //대비기간 시간 포맷
    const formatCompareEndDate = useMemo(() => {
        return useChangeFormatDate(compareEndDate);
    }, [compareEndDate]);

    //조회기간 날짜 변경시
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    //대비기간 날짜 변경시
    const handleCompareStartDateChange = (date) => {
        setCompareStartDate(date);
    };
    const handleCompareEndDateChange = (date) => {
        setCompareEndDate(date);
    };

/*

    const handleFieldChange = (field, e) => {
        e.preventDefault();
        setSearchField((prevData) => ({
            ...prevData,
            [field]: e.target.value,
        }));
        setSearchCompareField((prevData) => ({
            ...prevData,
            [field]: e.target.value,
        }));
    };

*/



    const [isCompanyPopupOpen, setIsCompanyPopupOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    const [checkedUseFlag, setCheckedUseFlag] = useState(false);
    const [filterChkData, setFilterChkData] = useState(null);
    const [filterPreData, setFilterPreData] = useState(null);

    const handleClickCompany = () => {
        setIsCompanyPopupOpen(true);
    };

    const handleSelectCompany = (selectedCompany) => {
        setIsCompanyPopupOpen(false);
        setSelectedStore(selectedCompany.fran_name);
    };

    const {
        data: salesDayData,
        isLoading: isLoadingSalesDayData,
        refetch: refetchSalesDayData,
    } = useQuery(
        ["getSalesDayData", formatStartDate, formatEndDate],
        () => getSalesAnalysisList(formatStartDate, formatEndDate),
        {
            enabled: formatStartDate !== undefined && formatEndDate !== undefined,
        }
    );

    const {
        data: compareSalesDayData,
        isLoading: isLoadingCompareSalesDayData,
        refetch: refetchCompareSalesDayData,
    } = useQuery(
        ["getCompareSalesDayData", formatCompareStartDate, formatCompareEndDate],
        () => getSalesCompareAnalysisList(formatCompareStartDate, formatCompareEndDate),
        {
            enabled: formatCompareStartDate !== undefined && formatCompareEndDate !== undefined,
        }
    );


    useEffect(() => {
        console.log("선택한 가맹점 명3 =", selectedStore);

        if (!isLoadingSalesDayData && !isLoadingCompareSalesDayData && salesDayData && compareSalesDayData) {
            const chkData = salesDayData?.filter((row) => {
                const chkFranName = row.chk_fran_name?.toString().toLowerCase();
                const selectedStoreName = selectedStore?.toLowerCase();

                return !selectedStoreName || (chkFranName && chkFranName === selectedStoreName);
            });

            const preData = compareSalesDayData?.filter((row) => {
                const preFranName = row.pre_fran_name?.toString().toLowerCase();
                const selectedStoreName = selectedStore?.toLowerCase();

                return !selectedStoreName || (preFranName && preFranName === selectedStoreName);
            });

            setFilterChkData(chkData);
            setFilterPreData(preData);

            console.log("FilterChkData =", chkData);
            console.log("FilterPreData =", preData);

            updateColumns();
        }
    }, [selectedStore, isLoadingSalesDayData, isLoadingCompareSalesDayData, salesDayData, compareSalesDayData]);



    const updateColumns = () => {
        const chkData = salesAnalysisColumns1(mainHeader, subHeader1, formatStartDate, formatEndDate);
        setsalesAnalysisColumnsData1(chkData);

        const preData = salesAnalysisColumns2(mainHeader, subHeader2, formatCompareStartDate, formatCompareEndDate);
        setsalesAnalysisColumnsData2(preData);
    };

/*

    useEffect(() => {
        if (!isLoadingSalesDayData && salesDayData && compareSalesDayData) {
            const chkData = salesDayData?.filter((row) => {
                const chkFranName = row.chk_fran_name?.toString().toLowerCase();
                const selectedStoreName = selectedStore?.toLowerCase();

                return !selectedStoreName || (chkFranName && chkFranName === selectedStoreName);
            });

            const preData = compareSalesDayData?.filter((row) => {
                const preFranName = row.pre_fran_name?.toString().toLowerCase();
                const selectedStoreName = selectedStore?.toLowerCase();

                return !selectedStoreName || (preFranName && preFranName === selectedStoreName);
            });

            setFilterChkData(chkData);
            setFilterPreData(preData);

            console.log("FilterChkData =", chkData);
            console.log("FilterPreData =", preData);

            updateColumns();
        }
    }, [selectedStore, isLoadingSalesDayData, salesDayData, compareSalesDayData]);
*/




    const mainHeader = ["매출구분"];
    const subHeader1 = [{header: "POS", accessor: "chk_pos_sales"}, {header: "배달", accessor: "chk_delivery_sales"},];
    const subHeader2 = [{header: "POS", accessor: "pre_pos_sales"}, {header: "배달", accessor: "pre_delivery_sales"},];

    const [salesAnalysisColumnsData1, setsalesAnalysisColumnsData1] = useState([]);
    const [salesAnalysisColumnsData2, setsalesAnalysisColumnsData2] = useState([]);

    const {
        getTableProps: table1GetTableProps,
        getTableBodyProps: table1GetTableBodyProps,
        headerGroups: table1HeaderGroups,
        prepareRow: table1PrepareRow,
        page: table1Page,
        state: {pageIndex: table1PageIndex, pageSize: table1PageSize},
        gotoPage: table1GotoPage,
        previousPage: table1PreviousPage,
        nextPage: table1NextPage,
        canPreviousPage: table1CanPreviousPage,
        canNextPage: table1CanNextPage,
        pageCount: table1PageCount,
        pageOptions: table1PageOptions,
    } = useTable({
        columns: salesAnalysisColumnsData1,
        data: useMemo(() => filterChkData, [filterChkData]),
        initialState: {pageIndex: 0, pageSize: 10},
        autoResetPage: false,
    }, useSortBy, usePagination);

    const {
        getTableProps: table2GetTableProps,
        getTableBodyProps: table2GetTableBodyProps,
        headerGroups: table2HeaderGroups,
        prepareRow: table2PrepareRow,
        page: table2Page,
        state: {pageIndex: table2PageIndex, pageSize: table2PageSize},
        gotoPage: table2GotoPage,
        previousPage: table2PreviousPage,
        nextPage: table2NextPage,
        canPreviousPage: table2CanPreviousPage,
        canNextPage: table2CanNextPage,
        pageCount: table2PageCount,
        pageOptions: table2PageOptions,
    } = useTable({
        columns: salesAnalysisColumnsData2,
        data: useMemo(() => filterPreData, [filterPreData]),
        initialState: {pageIndex: 0, pageSize: 10},
        autoResetPage: false,
    }, useSortBy, usePagination);

    const handleUseFlagChange = (e) => {
        setCheckedUseFlag((prev) => !prev);
        setSearchField((prevData) => ({
            ...prevData, [e.target.id]: e.target.checked ? "" : "1",
        }));
    };

    /*useEffect(() => {
        if (!isLoadingSalesDayData && salesDayData) {
            const filteredData = salesDayData.filter((row) => {
                if (checkedUseFlag) {
                    return true;
                } else {
                    return row.use_flag === 1;
                }
            });
            setTableState(filteredData);
        }
    }, [salesDayData, isLoadingSalesDayData, checkedUseFlag]);

    // 대비기간
    useEffect(() => {
        if (!isLoadingCompareSalesDayData && compareSalesDayData) {
            const filteredCompareData = compareSalesDayData.filter((row) => {
                if (checkedUseFlag) {
                    return true;
                } else {
                    return row.use_flag === 1;
                }
            });
            setCompareTableState(filteredCompareData);
        }
    }, [compareSalesDayData, isLoadingCompareSalesDayData, checkedUseFlag]);*/

    return (
        <>
            <div className={cx("brand")}>
                <div className={cx("row")}>
                    <h1 style={{ lineHeight: "2", fontWeight: "bold", textAlign: "center", fontSize: "30px" }}>일자별 매출 비교 (선택 가맹점)</h1>
                    <div className={cx("box", "flex", "search-wrap")}>
                        <div className={cx("item")}>
                            <SearchDateItems
                                startDate={startDate}
                                endDate={endDate}
                                handleStartDateChange={handleStartDateChange}
                                handleEndDateChange={handleEndDateChange}
                                labelText={2}
                            />
                        </div>
                        <div className={cx("item")}>
                            <SearchDateItems
                                startDate={compareStartDate}
                                endDate={compareEndDate}
                                handleStartDateChange={handleCompareStartDateChange}
                                handleEndDateChange={handleCompareEndDateChange}
                                labelText={3}
                            />
                        </div>
                        <CheckBox title={"사용안함 포함"} id={"use_flag"} checked={checkedUseFlag}
                                  onChange={handleUseFlagChange}/>
                        <div className={cx("item")}>
                            {/*<SearchItem searchType={SEARCH_TYPE.INPUT} title={"가맹점 명"}
                                    onClick={() => handlePopupOpenClick()}/>*/}
                            {isCompanyPopupOpen && (
                                <PopupSearchFranchise handleClickReturn={handleSelectCompany} setIsPopup={() => setIsCompanyPopupOpen(false)} />
                            )}

                            <input
                                value={(selectedStore ) || ""}
                                onClick={handleClickCompany}
                                readOnly
                                onFocus={(e) => {
                                    e.target.blur();
                                }}
                            />
                        </div>

                        {/*<button onClick={() => handlePopupOpenClick()}>🔍</button>*/}
                    </div>
                </div>
                {/*<div className={cx("row")}>
                <div className={cx("item")}>
                    <h1 style={{lineHeight: '2', fontWeight: 'bold', textAlign: 'center', marginTop: '3rem'}}>
                        <span>대비기간과 비교하여 조회기간의 매출은 </span>

                        <span style={directionStyle}>{titleTotal}원 {changeDirection}</span>
                    </h1>

                    <div className={cx("box", "flex")}>
                        <div style={{width: "33%"}}>
                            <PieChartComponent_Analyze data={chartData1} title="매출합계"/>
                        </div>
                        <div style={{width: "33%"}}>
                            <PieChartComponent_Analyze data={chartData2} title="POS"/>
                        </div>
                        <div style={{width: "33%"}}>
                            <PieChartComponent_Analyze data={chartData3} title="배달"/>
                        </div>
                    </div>
                </div>
            </div>*/}

                {/*<div className={cx("dashboard")} style={{marginTop: '2rem'}}>
                <div className={cx("row", "flex")} style={{alignItems: 'center'}}>
                    <div className={cx("box", "content-wrap")}>
                        <div className={cx("item")}>
                            <div className={cx("title", "brand")}>
                            매출 추이
                        </div>
                            <div className={cx("table-wrap")} style={{height: '13rem', backgroundColor: '#f2f2f2'}}>
                                {isLoadingSalesDayData ? (<div className={cx("loading-data")}>데이터를 가져오고
                                    있습니다.</div>) : !combinedCompareData.length ? (
                                    <div className={cx("no-data")}>데이터가 없습니다.</div>) : (<table>
                                    <thead>
                                    <tr>

                                        <th style={{lineHeight: '1.2'}} colSpan={5}>증감</th>
                                    </tr>
                                    <tr>
                                        <th style={{lineHeight: '1.2'}} rowSpan={3}>합계</th>
                                        <th style={{lineHeight: '1.2'}} rowSpan={2}>매출합계</th>
                                        <th style={{lineHeight: '1.2'}} rowSpan={2}>평균매출</th>
                                        <th style={{lineHeight: '1.2'}} colSpan={2}>매출구분</th>
                                    </tr>
                                    <tr>
                                        <th style={{lineHeight: '1.2'}}>POS</th>
                                        <th style={{lineHeight: '1.2'}}>배달</th>
                                    </tr>
                                    <tr>
                                        <td style={{
                                            backgroundColor: 'rgb(253, 238, 168)',
                                            lineHeight: '2',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            color: indeCreaseTotal === '0' ? 'black' : (indeCreaseTotal.includes('-') ? 'blue' : 'red')
                                        }}>
                                            {indeCreaseTotal !== '0' ? (indeCreaseTotal.includes('-') ? indeCreaseTotal : `+${indeCreaseTotal}`) : indeCreaseTotal}
                                        </td>
                                        <td style={{
                                            backgroundColor: 'rgb(253, 238, 168)',
                                            lineHeight: '2',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            color: indeCreaseAvg === '0' ? 'black' : (indeCreaseAvg.includes('-') ? 'blue' : 'red')
                                        }}>
                                            {indeCreaseAvg !== '0' ? (indeCreaseAvg.includes('-') ? indeCreaseAvg : `+${indeCreaseAvg}`) : indeCreaseAvg}
                                        </td>
                                        <td style={{
                                            backgroundColor: 'rgb(253, 238, 168)',
                                            lineHeight: '2',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            color: indeCreasePos === '0' ? 'black' : (indeCreasePos.includes('-') ? 'blue' : 'red')
                                        }}>
                                            {indeCreasePos !== '0' ? (indeCreasePos.includes('-') ? indeCreasePos : `+${indeCreasePos}`) : indeCreasePos}
                                        </td>
                                        <td style={{
                                            backgroundColor: 'rgb(253, 238, 168)',
                                            lineHeight: '2',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            color: indeCreaseDelivery === '0' ? 'black' : (indeCreaseDelivery.includes('-') ? 'blue' : 'red')
                                        }}>
                                            {indeCreaseDelivery !== '0' ? (indeCreaseDelivery.includes('-') ? indeCreaseDelivery : `+${indeCreaseDelivery}`) : indeCreaseDelivery}
                                        </td>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    </tbody>
                                </table>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>*/}

                <div className={cx("row", "flex")}>
                <div className={cx("box", "no-padding-horizontal", "content-wrap")}>
                    <div className={cx("item")}>
                        {selectedStore && selectedStore.length ? (
                            <>
                                <RenderTable
                                    tableProps={{
                                        getTableProps: table1GetTableProps,
                                        getTableBodyProps: table1GetTableBodyProps,
                                        headerGroups: table1HeaderGroups,
                                        prepareRow: table1PrepareRow,
                                        page: table1Page,
                                        pageIndex: table1PageIndex,
                                        pageSize: table1PageSize,
                                        gotoPage: table1GotoPage,
                                        previousPage: table1PreviousPage,
                                        nextPage: table1NextPage,
                                        canPreviousPage: table1CanPreviousPage,
                                        canNextPage: table1CanNextPage,
                                        pageCount: table1PageCount,
                                        pageOptions: table1PageOptions,
                                    }}
                                    editMode={false}
                                    tableState={tableState}
                                    setTableState={setTableState}
                                    rowFixHeaderValues={{
                                        // ... your rowFixHeaderValues
                                    }}
                                />
                            </>
                        ) : (
                            <div className={cx("no-data")}>
                                {selectedStore ? '데이터가 없습니다.' : '가맹점을 먼저 검색하세요.'}
                            </div>
                        )}
{/*
                        {isLoadingSalesDayData ? (
                            <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !combinedData.length ? (
                            <div className={cx("no-data")}>데이터가 없습니다.</div>) : (<>
                            <RenderTable
                                tableProps={{
                                    ...InquiryTable
                                }}
                                editMode={false}
                                tableState={tableState}
                                setTableState={setTableState}
                                rowFixHeaderValues={{
                                    sum_total: sum_chk_total,
                                    sum_avg: sum_chk_avg,
                                    sum_pos: sum_chk_pos,
                                    sum_delivery: sum_chk_delivery,
                                }}
                            ></RenderTable>

                            <RenderTable
                                tableProps={{
                                    getTableProps: table1GetTableProps,
                                    getTableBodyProps: table1GetTableBodyProps,
                                    headerGroups: table1HeaderGroups,
                                    prepareRow: table1PrepareRow,
                                    page: table1Page,
                                    pageIndex: table1PageIndex,
                                    pageSize: table1PageSize,
                                    gotoPage: table1GotoPage,
                                    previousPage: table1PreviousPage,
                                    nextPage: table1NextPage,
                                    canPreviousPage: table1CanPreviousPage,
                                    canNextPage: table1CanNextPage,
                                    pageCount: table1PageCount,
                                    pageOptions: table1PageOptions,
                                }}
                                editMode={false}
                                tableState={tableState}
                                setTableState={setTableState}
                                rowFixHeaderValues={{
                                    sum_total: sum_chk_total,
                                    sum_avg: sum_chk_avg,
                                    sum_pos: sum_chk_pos,
                                    sum_delivery: sum_chk_delivery,
                                }}
                            />
                        </>)}*/}
                    </div>
                </div>
                <div className={cx("box", "no-padding-horizontal", "content-wrap")}>
                    <div className={cx("item")}>
                        {selectedStore && selectedStore.length ? (
                            <>
                                <RenderTable
                                    tableProps={{
                                        getTableProps: table2GetTableProps,
                                        getTableBodyProps: table2GetTableBodyProps,
                                        headerGroups: table2HeaderGroups,
                                        prepareRow: table2PrepareRow,
                                        page: table2Page,
                                        pageIndex: table2PageIndex,
                                        pageSize: table2PageSize,
                                        gotoPage: table2GotoPage,
                                        previousPage: table2PreviousPage,
                                        nextPage: table2NextPage,
                                        canPreviousPage: table2CanPreviousPage,
                                        canNextPage: table2CanNextPage,
                                        pageCount: table2PageCount,
                                        pageOptions: table2PageOptions,
                                    }}
                                    editMode={false}
                                    tableState={tableState}
                                    setTableState={setTableState}
                                    rowFixHeaderValues={{
                                        //sum_total: sum_pre_total,
                                        //sum_avg: sum_pre_avg,
                                        //sum_pos: sum_pre_pos,
                                        //sum_delivery: sum_pre_delivery,
                                    }}
                                />
                            </>
                        ) : (
                            <div className={cx("no-data")}>
                                {selectedStore ? '데이터가 없습니다.' : '가맹점을 먼저 검색하세요.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default SalesAnalysisSelect;