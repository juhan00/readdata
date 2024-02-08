import {SEARCH_TYPE} from "@/consts/common";
import {salesAnalysisColumns1, salesAnalysisColumns2} from "@/consts/salesAnalysisColumns";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import {getSalesAnalysisList, getSalesCompareAnalysisList} from "@/utils/api/salesAnalysis";
import {useChangeFormatDate} from "@/utils/useChangeFormatDate";
import {useTranslation} from "next-i18next";
import {useEffect, useMemo, useState} from "react";
import {QueryClient, useQuery} from "react-query";
import {usePagination, useSortBy, useTable} from "react-table";

//styles
import className from "classnames/bind";
import styles from "./salesAnalyze.module.scss";

import PieChartComponent_Analyze from "@/pages/test/chartPie_Analyze";

const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesAnalysis = () => {
    /*const searchFieldData = {
        chk_fran_name: "", pre_fran_name: "",
    };*/

    const searchFieldData = {
        use_flag: "",
    };

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 2);

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
    } = useQuery(["getSalesDayData"], () => getSalesAnalysisList(formatStartDate, formatEndDate), {
        enabled: formatStartDate !== undefined && formatEndDate !== undefined,
    });
    //대비기간 API
    const {
        data: compareSalesDayData, isLoading: isLoadingCompareSalesDayData, refetch: refetchCompareSalesDayData,
    } = useQuery(["getCompareSalesDayData"], () => getSalesCompareAnalysisList(formatCompareStartDate, formatCompareEndDate), {
        enabled: formatCompareStartDate !== undefined && formatCompareEndDate !== undefined,
    });

    console.log("조회기간=", formatStartDate, " ~ ", formatEndDate, " = ", salesDayData);
    console.log("대비기간=", formatCompareStartDate, " ~ ", formatCompareEndDate, " = ", compareSalesDayData);


    const mainHeader = ["매출구분"];
    const subHeader1 = [{header: "POS", accessor: "chk_pos_sales"}, {header: "배달", accessor: "chk_delivery_sales"},];
    const subHeader2 = [{header: "POS", accessor: "pre_pos_sales"}, {header: "배달", accessor: "pre_delivery_sales"},];

    const [salesAnalysisColumnsData1, setsalesAnalysisColumnsData1] = useState([]);
    const [salesAnalysisColumnsData2, setsalesAnalysisColumnsData2] = useState([]);



    useEffect(() => {
        updateColumns();
    }, []);

    const updateColumns = () => {
        const chkData = salesAnalysisColumns1(mainHeader, subHeader1, formatStartDate, formatEndDate);
        setsalesAnalysisColumnsData1(chkData);

        const preData = salesAnalysisColumns2(mainHeader, subHeader2, formatCompareStartDate, formatCompareEndDate);
        setsalesAnalysisColumnsData2(preData);
    };


    /*//조회기간
    const memoizedData = useMemo(() => {
        return tableState?.filter((row) =>
            (!searchData.chk_fran_name || row.chk_fran_name?.toString().toLowerCase().includes(searchData.chk_fran_name.toLowerCase()))&&
            (!searchData.chk_use_flag || row.chk_use_flag?.toString().toLowerCase().includes(searchData.chk_use_flag.toLowerCase())))
    }, [tableState, searchData]);

    console.log("tableState!!!!",tableState);
    console.log("searchData!!!!",searchData);
    console.log("memoizedData!!!!",memoizedData);

    //대비기간
    const memoizedCompareData = useMemo(() => {
        return compareTableState?.filter((row) =>
            (!searchCompareData.pre_fran_name || row.pre_fran_name?.toString().toLowerCase().includes(searchCompareData.pre_fran_name.toLowerCase()))&&
            (!searchCompareData.pre_use_flag || row.pre_use_flag?.toString().toLowerCase().includes(searchCompareData.pre_use_flag.toLowerCase())));
    }, [compareTableState, searchCompareData]);

    console.log("compareTableState!!!!",compareTableState);
    console.log("searchCompareData!!!!",searchCompareData);
    console.log("memoizedCompareData!!!!",memoizedCompareData);*/


    const memoizedCombinedData = useMemo(() => {
        const filterCombinedData = (table, searchData, period) => {
            return table?.filter((row) => // (!searchData[`${period}_fran_name`] || row[`${period}_fran_name`]?.toString().toLowerCase().includes(searchData[`${period}_fran_name`].toLowerCase())) &&
                (!searchData.use_flag || row.use_flag?.toString().toLowerCase().includes(searchData.use_flag.toLowerCase())));
        };
        const combinedData = filterCombinedData(tableState, searchData, 'chk');
        const combinedCompareData = filterCombinedData(compareTableState, searchCompareData, 'pre');

        return {combinedData, combinedCompareData};
    }, [tableState, searchData, compareTableState, searchCompareData]);

    const {combinedData, combinedCompareData} = memoizedCombinedData;


    /*//조회기간
    useEffect(() => {
        if (!isLoadingSalesDayData && salesDayData) {
            const filteredData = salesDayData.filter((row) => row.use_flag === 1);
            setTableState(filteredData);
        }
    }, [salesDayData, isLoadingSalesDayData]);

    //대비기간
    useEffect(() => {
        if (!isLoadingCompareSalesDayData && compareSalesDayData) {
            const filteredCompareData = compareSalesDayData.filter((row) => row.use_flag === 1);
            setCompareTableState(filteredCompareData);
        }
    }, [compareSalesDayData, isLoadingCompareSalesDayData]);*/

    // 조회기간
    useEffect(() => {
        if (!isLoadingSalesDayData && salesDayData) {
            const filteredData = salesDayData.filter((row) => {
                if (useFlag) {
                    return true;
                } else {
                    return row.use_flag === 1;
                }
            });
            setTableState(filteredData);
        }
    }, [salesDayData, isLoadingSalesDayData, useFlag]);

    // 대비기간
    useEffect(() => {
        if (!isLoadingCompareSalesDayData && compareSalesDayData) {
            const filteredCompareData = compareSalesDayData.filter((row) => {
                if (useFlag) {
                    return true;
                } else {
                    return row.use_flag === 1;
                }
            });
            setCompareTableState(filteredCompareData);
        }
    }, [compareSalesDayData, isLoadingCompareSalesDayData, useFlag]);

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
        data: useMemo(() => combinedData, [combinedData]),
    }, salesAnalysisColumnsData1);

    const preparationTable = getUseTable({
        data: useMemo(() => combinedCompareData, [combinedCompareData]),
    }, salesAnalysisColumnsData2);


    const handleFieldChange = (field, e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        if (field === 'use_flag') {
            setUseFlag(value);
            console.log("setUseFlag(value)==", setUseFlag)
        }
    };

    /*const handleFieldChange = (field, e) => {

        e.preventDefault();
        setSearchField((prevData) => ({
            ...prevData, [field]: e.target.value,
        }));
        setSearchCompareField((prevData) => ({
            ...prevData, [field]: e.target.value,
        }));
    };*/

    // 기존 검색기능
    const handleSearchSubmit = (e) => {
        setSearchData((prevData) => ({
            ...prevData, ...searchField,
        }));
        setSearchCompareData((prevData) => ({
            ...prevData, ...searchCompareField,
        }));
        // gotoPage(0);
        refetchSalesDayData();
        refetchCompareSalesDayData()
        updateColumns();
    };

    //조회기간, 대비기간 데이터 나열
    const salesDayDataArray = useMemo(() => combinedData?.map((item) => ({
        total: Number(item.chk_total),
        avg: Number(item.chk_avg),
        pos: Number(item.chk_pos_sales),
        delivery: Number(item.chk_delivery_sales)
    })) || [], [combinedData]);

    //조회기간, 대비기간 데이터 나열
    const compareSalesDayDataArray = useMemo(() => combinedCompareData?.map((item) => ({
        total: Number(item.pre_total),
        avg: Number(item.pre_avg),
        pos: Number(item.pre_pos_sales),
        delivery: Number(item.pre_delivery_sales)
    })) || [], [combinedCompareData]);

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

    //파이차트
    const chartData1 = [{name: "조회", value: sum_chk_total}, {name: "  대비", value: sum_pre_total},];

    const chartData2 = [{name: "조회", value: sum_chk_pos}, {name: "  대비", value: sum_pre_pos},];

    const chartData3 = [{name: "조회", value: sum_chk_delivery}, {name: "  대비", value: sum_pre_delivery},];

    //차트 위에 문구 포맷
    const strippedNumber = indeCreaseTotal.replace(/[^\d-+]/g, '');
    const difference = parseInt(strippedNumber, 10);

    const titleTotal = difference.toLocaleString().replace(/-/g, ' ');
    console.log("@titleTotal == ", titleTotal);

    const changeDirection = difference === 0 ? '입니다.' : (difference < 0 ? '하락 되었습니다.' : '상승 되었습니다.');
    const directionStyle = {
        color: difference === 0 ? 'black' : (difference < 0 ? 'blue' : 'red')
    };


    return (<>


        <div className={cx("brand")}>
            <div className={cx("row")}>
                <h1 style={{lineHeight: '2', fontWeight: 'bold', textAlign: 'center', fontSize: '30px'}}>
                    일자별 매출 비교 (전체 가맹점)
                </h1>
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

                    {/*<SearchItem searchType={SEARCH_TYPE.INPUT} value={searchField.chk_fran_name} title={"조회 가맹점 명"}
                                id={"chk_fran_name"} onChange={handleFieldChange}/>*/}

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
                        {/* <SearchItem searchType={SEARCH_TYPE.INPUT}
                                    value={searchField.pre_fran_name}
                                    title={"대비 가맹점 명"}
                                    id={"pre_fran_name"} onChange={handleFieldChange}/>*/}
                    </div>
                    <div className={cx("item")}>
                        {/*<SearchItem
                            searchType={SEARCH_TYPE.SELECT_FLAG}
                            value={searchField.chk_use_flag}
                            title={"사용여부"}
                            id={"chk_use_flag"}
                            onChange={handleFieldChange}
                        />*/}

                        <div className={cx("checkbox-wrap")}>
                            <div className={cx("checkbox")}>
                                <input
                                    type="checkbox"
                                    value={searchField.use_flag}
                                    id="agree2"
                                    onChange={(e) => handleFieldChange('use_flag', e)}
                                />
                                <label htmlFor="agree2" style={{marginTop: '0.8rem'}}>
                                    <span>사용안함 포함</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={cx("item")}>
                        <div className={cx("btn-submit")}>
                            <BtnSearch onClick={handleSearchSubmit}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx("row")}>
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
            </div>


            <div className={cx("dashboard")} style={{marginTop: '2rem'}}>
                <div className={cx("row", "flex")} style={{alignItems: 'center'}}>
                    <div className={cx("box", "content-wrap")}>
                        <div className={cx("item")}>
                            {/*<div className={cx("title", "brand")}>
                            매출 추이
                        </div>*/}
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
            </div>

            <div className={cx("row", "flex")}>
                <div className={cx("box", "no-padding-horizontal", "content-wrap")}>
                    <div className={cx("item")}>
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
                        </>)}
                    </div>
                </div>
                <div className={cx("box", "no-padding-horizontal", "content-wrap")}>
                    <div className={cx("item")}>
                        {isLoadingCompareSalesDayData ? (
                            <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !combinedCompareData.length ? (
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
            </div>
        </div>
    </>);
};

export default SalesAnalysis;

