import {SEARCH_TYPE} from "@/consts/common";
import {salesAnalysisColumns1, salesAnalysisColumns2, salesAnalysisColumns3} from "@/consts/salesAnalysisColumns";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import SearchItem from "@/src/components/data/searchItem";
// import { getSalesDayList } from "@/utils/api/sales";
import {getSalesAnalysisList, getSalesCompareAnalysisList} from "@/utils/api/salesAnalysis";
import {useChangeFormatDate} from "@/utils/useChangeFormatDate";
import {useTranslation} from "next-i18next";
import {useEffect, useMemo, useState} from "react";
import {QueryClient, useQuery} from "react-query";
import {usePagination, useSortBy, useTable} from "react-table";

//styles
import className from "classnames/bind";
import styles from "./salesAnalyze.module.scss";
import ScrapingSearch from "@/src/components/data/scrapingSearch";
import {dashDayMonthColumns} from "@/consts/dashboardColumns";
import PieChartComponent from "@/pages/test/chartPie";

const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesAnalysis = () => {
    const searchFieldData1 = {
        chk_fran_name: "", pre_fran_name: "",
    };

    const searchFieldData2 = {};

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 2);

    const {t} = useTranslation(["common", "dataAdmin"]);

    //조회기간 테이블
    const [tableState, setTableState] = useState([]);
    //대비기간 테이블
    const [compareTableState, setCompareTableState] = useState([]);

    //조회기간 검색
    const [searchData, setSearchData] = useState(searchFieldData1);
    const [searchField, setSearchField] = useState(searchFieldData1);
    //대비기간 검색
    const [searchCompareData, setSearchCompareData] = useState(searchFieldData1);
    const [searchCompareField, setSearchCompareField] = useState(searchFieldData1);


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
        setCompareStartDate(date)
    };
    const handleCompareEndDateChange = (date) => {
        setCompareEndDate(date)
    };

    //조회기간 API
    const {
        data: salesDayData, isLoading: isLoadingSalesDayData, refetch: refetchSalesDayData,
    } = useQuery(["getSalesDayData", formatEndDate], () => getSalesAnalysisList(formatStartDate, formatEndDate), {
        enabled: formatStartDate !== undefined && formatEndDate !== undefined,
    });
    //대비기간 API
    const {
        data: compareSalesDayData, isLoading: isLoadingCompareSalesDayData, refetch: refetchCompareSalesDayData,
    } = useQuery(["getCompareSalesDayData", formatCompareEndDate], () => getSalesCompareAnalysisList(formatCompareStartDate, formatCompareEndDate), {
        enabled: formatCompareStartDate !== undefined && formatCompareEndDate !== undefined,
    });

    // console.log("조회기간=", formatStartDate, " ~ ", formatEndDate, " = ", salesDayData);
    // console.log("대비기간=", formatCompareStartDate, " ~ ", formatCompareEndDate, " = ", compareSalesDayData);

    let effectTarget = "1"
    //조회기간
    useEffect(() => {
        if (!isLoadingSalesDayData && salesDayData) {
            setTableState(salesDayData);
            effectTarget = "1";
            console.log("조회기간 누르면 1로 바껴야돼 = ", effectTarget);
        }
    }, [salesDayData, isLoadingSalesDayData]);

    //대비기간
    useEffect(() => {
        if (!isLoadingCompareSalesDayData && compareSalesDayData) {
            setCompareTableState(compareSalesDayData);
            effectTarget = "2"
            console.log("대비기간 누르면 2로 바껴야돼 = ", effectTarget);
        }
    }, [compareSalesDayData, isLoadingCompareSalesDayData]);


    const mainHeader = ["매출구분"];

    const headers1 = [{header: "POS", accessor: "chk_pos_sales"}, {header: "배달", accessor: "chk_delivery_sales"},];
    const headers2 = [{header: "POS", accessor: "pre_pos_sales"}, {header: "배달", accessor: "pre_delivery_sales"},];

    const [salesAnalysisColumnsData1, setsalesAnalysisColumnsData1] = useState([]);
    const [salesAnalysisColumnsData2, setsalesAnalysisColumnsData2] = useState([]);
    const [salesAnalysisColumnsData3, setsalesAnalysisColumnsData3] = useState([]);


    //조회기간
    const memoizedData = useMemo(() => {
        return tableState?.filter((row) => (!searchData.chk_fran_name || row.chk_fran_name?.toString().toLowerCase().includes(searchData.chk_fran_name.toLowerCase())));
    }, [tableState, searchData]);

    //대비기간
    const memoizedCompareData = useMemo(() => {
        return compareTableState?.filter((row) => (!searchCompareData.pre_fran_name || row.pre_fran_name?.toString().toLowerCase().includes(searchCompareData.pre_fran_name.toLowerCase())));
    }, [compareTableState, searchCompareData]);

    const getUseTable = (options, columns) => {
        return useTable({
            columns: columns || [], ...options, initialState: {pageIndex: 0, pageSize: 10}, autoResetPage: false,
        }, useSortBy, usePagination,);
    }

    // const {
    //     getTableProps,
    //     getTableBodyProps,
    //     headerGroups,
    //     prepareRow,
    //     page,
    //     state: {pageIndex, pageSize},
    //     gotoPage,
    //     previousPage,
    //     nextPage,
    //     canPreviousPage,
    //     canNextPage,
    //     pageCount,
    //     pageOptions,
    // } = useTable(
    //     {
    //         columns: salesAnalysisColumns,
    //         data: useMemo(() => memoizedData, [memoizedData]),
    //
    //         initialState: {pageIndex: 0, pageSize: 10},
    //         autoResetPage: false,
    //     },
    //     useSortBy,
    //     usePagination
    // );

    //처음 진입 시 조회기간,대비기간 동시 출력 및 달력클릭 시 검색기능 구현
    const InquiryTable = getUseTable({
        data: useMemo(() => memoizedData, [memoizedData]),
    }, salesAnalysisColumnsData1);

    const preparationTable = getUseTable({
        data: useMemo(() => memoizedCompareData, [memoizedCompareData]),
    }, salesAnalysisColumnsData2);

    const indeCreaseTable = getUseTable({
        data: useMemo(() => memoizedCompareData, [memoizedCompareData]),
    }, salesAnalysisColumnsData3);


    const handleFieldChange = (field, e) => {
        console.log("검색어 번경하면");

        e.preventDefault();
        setSearchField((prevData) => ({
            ...prevData, [field]: e.target.value,
        }));
        setSearchCompareField((prevData) => ({
            ...prevData, [field]: e.target.value,
        }));
    };

    const handleSearchSubmit = (e) => {
        setSearchData((prevData) => ({
            ...prevData, ...searchField,
        }));
        setSearchCompareData((prevData) => ({
            ...prevData, ...searchCompareField,
        }));
        // gotoPage(0);
    };

    // const [indeCreaseTotal, setIndeCreaseTotal] = useState(0);
    // const [indeCreaseAvg, setIndeCreaseAvg] = useState(0);
    // const [indeCreasePos, setIndeCreasePos] = useState(0);
    // const [indeCreaseDelivery, setIndeCreaseDelivery] = useState(0);

    //조회기간, 대비기간 데이터 나열
    const salesDayDataArray = useMemo(() => memoizedData?.map((item) => ({
        total: Number(item.chk_total),
        avg: Number(item.chk_avg),
        pos: Number(item.chk_pos_sales),
        delivery: Number(item.chk_delivery_sales)
    })) || [], [memoizedData]);

    //조회기간, 대비기간 데이터 나열
    const compareSalesDayDataArray = useMemo(() => memoizedCompareData?.map((item) => ({
        total: Number(item.pre_total),
        avg: Number(item.pre_avg),
        pos: Number(item.pre_pos_sales),
        delivery: Number(item.pre_delivery_sales)
    })) || [], [memoizedCompareData]);

    //조회기간, 대비기간 데이터 합산 sum_~
    const sum_chk_total = useMemo(() => salesDayDataArray.reduce((sum, {total}) => sum + total, 0), [salesDayDataArray]);
    const sum_chk_pos = useMemo(() => salesDayDataArray.reduce((sum, {pos}) => sum + pos, 0), [salesDayDataArray]);
    const sum_chk_delivery = useMemo(() => salesDayDataArray.reduce((sum, {delivery}) => sum + delivery, 0), [salesDayDataArray]);

    const sum_pre_total = useMemo(() => compareSalesDayDataArray.reduce((sum, {total}) => sum + total, 0), [compareSalesDayDataArray]);
    const sum_pre_pos = useMemo(() => compareSalesDayDataArray.reduce((sum, {pos}) => sum + pos, 0), [compareSalesDayDataArray]);
    const sum_pre_delivery = useMemo(() => compareSalesDayDataArray.reduce((sum, {delivery}) => sum + delivery, 0), [compareSalesDayDataArray]);

    //조회기간, 대비기간 avg / row.length 나누는 로직
    const sum_chk_avg = useMemo(() => {
        const totalAvg = salesDayDataArray.reduce((sum, {avg}) => sum + avg, 0);
        const numberOfItems = salesDayDataArray.length;
        const average = numberOfItems > 0 ? totalAvg / numberOfItems : 0;
        return Math.round(average);
    }, [salesDayDataArray]);

    const sum_pre_avg = useMemo(() => {
        const totalAvg = compareSalesDayDataArray.reduce((sum, {avg}) => sum + avg, 0);
        const numberOfItems = compareSalesDayDataArray.length;
        const average = numberOfItems > 0 ? totalAvg / numberOfItems : 0;
        return Math.round(average);
    }, [compareSalesDayDataArray]);


    const indeCreaseTotal = (sum_chk_total - sum_pre_total).toLocaleString();
    const indeCreaseAvg = (sum_chk_avg - sum_pre_avg).toLocaleString();
    const indeCreasePos = (sum_chk_pos - sum_pre_pos).toLocaleString();
    const indeCreaseDelivery = (sum_chk_delivery - sum_pre_delivery).toLocaleString();

    console.log("증감 매출 합산:", indeCreaseTotal);
    console.log("증감 평균 매출:", indeCreaseAvg);
    console.log("증감 POS 매출:", indeCreasePos);
    console.log("증감 배달 매출:", indeCreaseDelivery);

    // const getCellStyle = (value) => {
    //     const colorStyle = {
    //         fontWeight: 'bold',
    //     };
    //     console.log("@@@여기나오니",value);
    //
    //     if (value >= 0) {
    //         colorStyle.color = 'blue';
    //     } else if (value < 0) {
    //         colorStyle.color = 'red';
    //     }
    //
    //     return colorStyle;
    // };


    useEffect(() => {
        const chkData = salesAnalysisColumns1(mainHeader, headers1);
        setsalesAnalysisColumnsData1(chkData);

        const preData = salesAnalysisColumns2(mainHeader, headers2);
        setsalesAnalysisColumnsData2(preData);

        // const indeCrease = salesAnalysisColumns3(mainHeader, headers2);
        // setsalesAnalysisColumnsData3(indeCrease);

        console.log("chkData=", chkData);
        console.log("preData=", preData);
        //console.log("indeCrease=", indeCrease);
    }, []);

    return (<>
        <div className={cx("brand")}>
            <div className={cx("row")}>
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
                    <div className={cx("item")}/>

                    <SearchItem searchType={SEARCH_TYPE.INPUT} value={searchField.chk_fran_name} title={"조회 가맹점 명"}
                                id={"chk_fran_name"} onChange={handleFieldChange}/>
                    <div className={cx("item")}/>
                    <div className={cx("item")}/>
                    <div className={cx("item")}/>
                    <div className={cx("item")}>
                        <SearchDateItems
                            startDate={compareStartDate}
                            endDate={compareEndDate}
                            handleStartDateChange={handleCompareStartDateChange}
                            handleEndDateChange={handleCompareEndDateChange}
                            labelText={3}
                        />
                    </div>
                    <div className={cx("item")}>
                        <SearchItem searchType={SEARCH_TYPE.INPUT}
                                    value={searchField.pre_fran_name}
                                    title={"대비 가맹점 명"}
                                    id={"pre_fran_name"} onChange={handleFieldChange}/>
                    </div>
                    <div className={cx("btn-submit")}>
                        <BtnSearch onClick={handleSearchSubmit}/>
                    </div>
                </div>
            </div>
            <div className={cx("row")}>
                <div className={cx("item")}>
                    <PieChartComponent/>
                </div>
            </div>

            <div className={cx("row", "flex")}>
                <div className={cx("box", "content-wrap")}>
                    <div className={cx("item")}>
                        {isLoadingSalesDayData ? (
                            <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !memoizedData.length ? (
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
                            {/*<DayTable columns={dashDayMonthColumns} data={typeByDashYesterdayData}/>*/}
                        </>)}
                    </div>
                </div>
                <div className={cx("box", "content-wrap")}>
                    <div className={cx("item")}>
                        {isLoadingCompareSalesDayData ? (
                            <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !memoizedCompareData.length ? (
                            <div className={cx("no-data")}>데이터가 없습니다.</div>) : (<RenderTable
                            tableProps={{
                                ...preparationTable
                            }}
                            editMode={false}
                            compareTableState={compareTableState}
                            setCompareTableState={setCompareTableState}
                            rowFixHeaderValues={{
                                sum_total: sum_pre_total,
                                sum_avg: sum_pre_avg,
                                sum_pos: sum_pre_pos,
                                sum_delivery: sum_pre_delivery,
                            }}
                        ></RenderTable>)}
                    </div>
                </div>

                <div className={cx("box", "content-wrap")}>
                    <div className={cx("item")}>
                        <div className={cx("table-wrap")}>
                            {isLoadingSalesDayData ? (
                                <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !memoizedData.length ? (
                                <div className={cx("no-data")}>데이터가 없습니다.</div>) : (<table>
                                <thead>
                                <tr>

                                    <th colSpan={5}>증감</th>
                                </tr>
                                <tr>
                                    <th rowSpan={5}>합계</th>
                                    <th rowSpan={2}>매출합계</th>
                                    <th rowSpan={2}>평균매출</th>
                                    <th colSpan={2}>매출구분</th>
                                </tr>
                                <tr>
                                    <th>POS</th>
                                    <th>배달</th>
                                </tr>
                                <tr>
                                    <td style={{
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: indeCreaseTotal.includes('-') ? 'blue' : 'red'
                                    }}>
                                                 {indeCreaseTotal !== '0' ? (indeCreaseTotal.includes('-') ? indeCreaseTotal : `+${indeCreaseTotal}`) : indeCreaseTotal}
                                    </td>
                                    <td style={{
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: indeCreaseAvg.includes('-') ? 'blue' : 'red'
                                    }}>
                                                 {indeCreaseAvg !== '0' ? (indeCreaseAvg.includes('-') ? indeCreaseAvg : `+${indeCreaseAvg}`) : indeCreaseAvg}
                                    </td>
                                    <td style={{
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: indeCreasePos.includes('-') ? 'blue' : 'red'
                                    }}>
                                                 {indeCreasePos !== '0' ? (indeCreasePos.includes('-') ? indeCreasePos : `+${indeCreasePos}`) : indeCreasePos}
                                    </td>
                                    <td style={{
                                        fontWeight: 'bold', textAlign: 'center',
                                        color: indeCreaseDelivery.includes('-') ? 'blue' : 'red'
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

                {/*<div className={cx("box", "content-wrap")}>
                    <div className={cx("item")}>

                        {isLoadingSalesDayData ? (
                            <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !memoizedData.length ? (
                            <div className={cx("no-data")}>데이터가 없습니다.</div>) : (

                            <div className={cx("box", "table-wrap")}>
                                <thead>
                                <tr>
                                    <th colSpan={6}>조회 기간</th>
                                </tr>
                                <tr>
                                    <th rowSpan={2}>가맹점명</th>
                                    <th rowSpan={2}>총 판매액</th>
                                    <th rowSpan={2}>평균 일일 판매액</th>
                                    <th colSpan={2}>판매 분류</th>
                                </tr>
                                <tr>
                                    <th>POS</th>
                                    <th>배송</th>
                                </tr>
                                </thead>

                            </div>
                        )}

                    </div>
                </div>*/}
            </div>
        </div>
    </>);
};

export default SalesAnalysis;

