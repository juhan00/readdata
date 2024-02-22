import {SEARCH_TYPE} from "@/consts/common";
import {salesAnalysisColumns3, salesAnalysisColumns4} from "@/consts/salesAnalysisColumns";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import {getSalesAnalysisList, getSalesCompareAnalysisList} from "@/utils/api/salesAnalysis";
import {useChangeFormatDate} from "@/utils/useChangeFormatDate";
import {useTranslation} from "next-i18next";
import React, {useEffect, useMemo, useState} from "react";
import {QueryClient, useQuery} from "react-query";
import {usePagination, useSortBy, useTable} from "react-table";
import PopupSearchFranchise from "@/src/components/data/popup/popupSearchFranchise";
import ChartPieAnalyze from "@/src/components/data/chartPieAnalyze";
import {useGlobalState} from "@/context/globalStateContext";
import CheckBox from "@/src/components/data/checkBox";

//styles
import className from "classnames/bind";
import styles from "./SalesAnalyzeStore.module.scss";



const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesAnalyzeStore = () =>{

    const searchFieldData = {
        use_flag: "", chk_fran_name: "", pre_fran_name: "",
    };

    const [{popupState, userInfo}, setGlobalState] = useGlobalState();
    const [companyCode, setCompanyCode] = useState(userInfo.companyCode);

    //진입 시 날짜 포맷
    const today = new Date();
    const oneMonthAgo = new Date(today);

    //-1달 하고 -1일
    oneMonthAgo.setMonth(today.getMonth() - 1);
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 1);

    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(today.getDate() - 1);

    const {t} = useTranslation(["common", "dataAdmin"]);

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
    const [endDate, setEndDate] = useState(oneDayAgo);
    //대비기간-달력
    const [compareStartDate, setCompareStartDate] = useState(oneMonthAgo);
    const [compareEndDate, setCompareEndDate] = useState(oneDayAgo);

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
        data: salesDayData, isLoading: isLoadingSalesDayData, refetch: refetchSalesDayData,
    } = useQuery(["getSalesDayData", formatStartDate, formatEndDate], () => getSalesAnalysisList(companyCode, formatStartDate, formatEndDate), {
        enabled: formatStartDate !== undefined && formatEndDate !== undefined,
    });

    const {
        data: compareSalesDayData, isLoading: isLoadingCompareSalesDayData, refetch: refetchCompareSalesDayData,
    } = useQuery(["getCompareSalesDayData", formatStartDate, formatEndDate], () => getSalesCompareAnalysisList(companyCode, formatStartDate, formatEndDate), {
        enabled: formatStartDate !== undefined && formatEndDate !== undefined,
    });

    console.log("1",salesDayData);
    console.log("2",compareSalesDayData);

    const handleUseFlagChange = (e) => {
        setCheckedUseFlag((prev) => !prev);
        setSearchField((prevData) => ({
            ...prevData, [e.target.id]: e.target.checked ? "" : "1",
        }));
    };

    return (<>
        <div className={cx("analyze-store")}>
            <div className={cx("row")}>
                <h1 style={{lineHeight: "2", fontWeight: "bold", textAlign: "center", fontSize: "30px"}}>
                    가맹점 매출비교</h1>
                <div className={cx("box", "flex", "search-wrap")}>
                    <div className={cx("search-item")}>
                        <div className={cx("item-wrap")}>
                            <div className={cx("item")}>
                                <SearchDateItems
                                    startDate={startDate}
                                    endDate={endDate}
                                    handleStartDateChange={handleStartDateChange}
                                    handleEndDateChange={handleEndDateChange}
                                />
                            </div>
                            {/*<div className={cx("item")}>
                                <SearchDateItems
                                    startDate={compareStartDate}
                                    endDate={compareEndDate}
                                    handleStartDateChange={handleCompareStartDateChange}
                                    handleEndDateChange={handleCompareEndDateChange}
                                    labelText={3}
                                />
                            </div>*/}


                            <div className={cx("item")}>
                                <label className={cx("")} style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "700",
                                    lineHeight: "1.5rem",
                                    marginLeft: "1.5rem",
                                }}>조회 가맹점</label>
                            </div>


                            <div className={cx("item")}>
                                {isCompanyPopupOpen && (<PopupSearchFranchise handleClickReturn={handleSelectCompany}
                                                                              setIsPopup={() => setIsCompanyPopupOpen(false)}/>)}
                                <input
                                    style={{
                                        width: '15rem',
                                        height: '3.8rem',
                                        backgroundColor: '#fddc37',
                                        fontSize: '1.5rem',
                                        fontWeight: "bolder",
                                        marginLeft: "-1.2rem"
                                    }}
                                    value={(selectedStore) || ""}
                                    onClick={handleClickCompany}
                                    readOnly
                                    onFocus={(e) => {
                                        e.target.blur();
                                    }}
                                    placeholder="  가맹점 검색하기 🔍"
                                />
                            </div>

                            <div className={cx("item")}>
                                <label className={cx("")} style={{
                                    fontSize: "1.6rem",
                                    fontWeight: "700",
                                    lineHeight: "1.5rem",
                                    marginLeft: "1.5rem",
                                }}>비교 가맹점</label>
                            </div>


                            <div className={cx("item")}>
                                {isCompanyPopupOpen && (<PopupSearchFranchise handleClickReturn={handleSelectCompany}
                                                                              setIsPopup={() => setIsCompanyPopupOpen(false)}/>)}
                                <input
                                    style={{
                                        width: '15rem',
                                        height: '3.8rem',
                                        backgroundColor: '#fddc37',
                                        fontSize: '1.5rem',
                                        fontWeight: "bolder",
                                        marginLeft: "-1.2rem"
                                    }}
                                    value={(selectedStore) || ""}
                                    onClick={handleClickCompany}
                                    readOnly
                                    onFocus={(e) => {
                                        e.target.blur();
                                    }}
                                    placeholder="  가맹점 검색하기 🔍"
                                />
                            </div>
                            <div className={cx("item")}>
                            </div>
                            <div className={cx("item")}>
                                <div className={cx("checkbox-wrap")}>
                                    <div className={cx("checkbox")}>
                                        <CheckBox title={"사용안함 포함"} id={"use_flag"} checked={checkedUseFlag}
                                                  onChange={handleUseFlagChange}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div className={cx("row")}>

                <div className={cx("item")}>
                    <h1 style={{lineHeight: '2', fontWeight: 'bold', textAlign: 'center', marginTop: '3rem'}}>
                        {selectedStore ? (
                            <>
                                <span>대비기간과 비교하여 조회기간의 매출은 </span>
                                <span style={directionStyle}>{titleTotal}원 {changeDirection}</span>
                            </>
                        ) : null}
                    </h1>
                    <div className={cx("box", "flex")}>
                        {selectedStore ? (
                            <>
                                <div style={{width: "33%"}}>
                                    <ChartPieAnalyze data={chartData1} title="매출합계"/>
                                </div>
                                <div style={{width: "33%"}}>
                                    <ChartPieAnalyze data={chartData2} title="POS"/>
                                </div>
                                <div style={{width: "33%"}}>
                                    <ChartPieAnalyze data={chartData3} title="배달"/>
                                </div>
                            </>
                        ) : <h2 className={cx("no-data")}
                                style={{fontSize: "2.5rem", marginTop: '8rem', marginBottom: "8rem"}}>가맹점을 선택해주세요</h2>}
                    </div>
                </div>
            </div>*/}

            {/*<div className={cx("dashboard")} style={{marginTop: '2rem'}}>
                <div className={cx("row", "flex")} style={{alignItems: 'center'}}>
                    <div className={cx("box", "content-wrap")}>
                        <div className={cx("table-wrap")} style={{height: '13rem', backgroundColor: '#f2f2f2'}}>
                            {selectedStore && filterChkData.length ? (
                                <>
                                    <table>
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
                                    </table>
                                </>
                            ) : (<div className={cx("no-data")}>
                                {selectedStore ? '데이터가 없습니다.' : '가맹점을 선택해주세요'}
                            </div>)}
                        </div>
                    </div>
                </div>
            </div>*/}

            {/*<div className={cx("row", "flex")}>
                <div className={cx("box", "no-padding-horizontal", "content-wrap")}>
                    <div className={cx("item")}>
                        {selectedStore && filterChkData.length ? (<>
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
                                    sum_total: selectedStore,
                                    sum_avg: sum_chk_total,
                                    sum_pos: sum_chk_pos,
                                    sum_delivery: sum_chk_delivery,
                                }}
                            />
                        </>) : (<div className={cx("no-data")}>
                            {selectedStore ? '데이터가 없습니다.' : '가맹점을 선택해주세요'}
                        </div>)}
                    </div>
                </div>
                <div className={cx("box", "no-padding-horizontal", "content-wrap")}>
                    <div className={cx("item")}>
                        {selectedStore && filterPreData.length ? (<>
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
                                    sum_total: selectedStore,
                                    sum_avg: sum_chk_total,
                                    sum_pos: sum_pre_pos,
                                    sum_delivery: sum_pre_delivery,
                                }}
                            />
                        </>) : (<div className={cx("no-data")}>
                            {selectedStore ? '데이터가 없습니다.' : '가맹점을 선택해주세요'}
                        </div>)}
                    </div>
                </div>
            </div>*/}
        </div>
    </>);

}

export default SalesAnalyzeStore;