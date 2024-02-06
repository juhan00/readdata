import {SEARCH_TYPE} from "@/consts/common";
import {salesAnalysisColumns1, salesAnalysisColumns2} from "@/consts/salesAnalysisColumns";
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

    useEffect(() => {
        const chkData = salesAnalysisColumns1(mainHeader, headers1);
        setsalesAnalysisColumnsData1(chkData);

        const preData = salesAnalysisColumns2(mainHeader, headers2);
        setsalesAnalysisColumnsData2(preData);

        console.log("chkData=", chkData);
        console.log("preData=", preData);
    }, []);


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
            //처음 진입 시 조회기간, 대비기간 출력 및 달력클릭 시 검색기능 구현
            columns: columns || [], ...options, initialState: {pageIndex: 0, pageSize: 10}, autoResetPage: false,
        }, useSortBy, usePagination);
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

    //console.log("InquiryTable",InquiryTable);

    const preparationTable = getUseTable({
        data: useMemo(() => memoizedCompareData, [memoizedCompareData]),
    }, salesAnalysisColumnsData2);

    //console.log("preparationTable",preparationTable);

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
        console.log("검색버튼 누르면");
        console.log("searchField==", searchField);
        console.log("setSearchData==", setSearchData);
        console.log("setSearchCompareData==", setSearchCompareData);
        setSearchData((prevData) => ({
            ...prevData, ...searchField,
        }));

        setSearchCompareData((prevData) => ({
            ...prevData, ...searchCompareField,
        }));
        gotoPage(0);
    };


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

            <div className={cx("row", "flex")}>
                <div className={cx("box", "content-wrap")}>
                    <div className={cx("item")}>
                        {isLoadingSalesDayData ? (
                            <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !memoizedData.length ? (
                            <div className={cx("no-data")}>데이터가 없습니다.</div>) : (<RenderTable
                                tableProps={{
                                    ...InquiryTable
                                }}
                                editMode={false}
                                tableState={tableState}
                                setTableState={setTableState}
                            ></RenderTable>

                        )}
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
                        ></RenderTable>)}
                    </div>
                </div>
            </div>
        </div>
    </>);
};

export default SalesAnalysis;

