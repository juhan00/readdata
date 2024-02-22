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

import CheckBox from "@/src/components/data/checkBox";
import ChartPieAnalyze from "@/src/components/data/chartPieAnalyze";
import {useGlobalState} from "@/context/globalStateContext";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnExcelDown_Analyze from "@/src/components/data/button/btnExcelDown_Analyze";

const cx = className.bind(styles);

const queryClient = new QueryClient();

const TabContent1 = () => (<div>
    {/* Content for Tab 1 */}
    <h2>Page 1 Content</h2>
    <p>This is the content for the first tab.</p>
</div>);

const TabContent2 = () => (<div>
    {/* Content for Tab 2 */}
    <h2>Page 2 Content</h2>
    <p>This is the content for the second tab.</p>
</div>);

const TabContent3 = () => (<div>
    {/* Content for Tab 3 */}
    <h2>Page 3 Content</h2>
    <p>This is the content for the third tab.</p>
</div>);

const SalesAnalysis = () => {

    const [selectedTab, setSelectedTab] = useState(1);

    const renderTabContent = () => {
        switch (selectedTab) {
            case 1:
                return <TabContent1/>;
            case 2:
                return <TabContent2/>;
            case 3:
                return <TabContent3/>;
            default:
                return null;
        }
    };

    const [{ popupState, userInfo }, setGlobalState] = useGlobalState();
    const [companyCode, setCompanyCode] = useState(userInfo.companyCode);

    const searchFieldData = {
        use_flag: "",
    };
    const {t} = useTranslation(["common", "dataAdmin"]);
    const [checkedUseFlag, setCheckedUseFlag] = useState(false);
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

    //진입 시 날짜 포맷
    const today = new Date();
    const oneMonthAgo = new Date(today);

    //-1달, -1일
    oneMonthAgo.setMonth(today.getMonth() - 1);
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 1);

    const oneDayAgo = new Date(today);
    oneDayAgo.setDate(today.getDate() - 1);

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
        setCompareStartDate(date)
    };
    const handleCompareEndDateChange = (date) => {
        setCompareEndDate(date)
    };


    //조회기간 API
    const {
        data: salesDayData, isLoading: isLoadingSalesDayData, refetch: refetchSalesDayData,
    } = useQuery(["getSalesDayData"], () => getSalesAnalysisList(companyCode,formatStartDate, formatEndDate), {
        enabled: formatStartDate !== undefined && formatEndDate !== undefined,
    });
    //대비기간 API
    const {
        data: compareSalesDayData, isLoading: isLoadingCompareSalesDayData, refetch: refetchCompareSalesDayData,
    } = useQuery(["getCompareSalesDayData"], () => getSalesCompareAnalysisList(companyCode, formatCompareStartDate, formatCompareEndDate), {
        enabled: formatCompareStartDate !== undefined && formatCompareEndDate !== undefined,
    });

    const memoizedCombinedData = useMemo(() => {
        const filterCombinedData = (table, searchData, period) => {
            return table?.filter((row) =>
                (!searchData.use_flag || row.use_flag?.toString().toLowerCase().includes(searchData.use_flag.toLowerCase())));
        };
        const combinedData = filterCombinedData(tableState, searchData, 'chk');
        const combinedCompareData = filterCombinedData(compareTableState, searchCompareData, 'pre');

        return {combinedData, combinedCompareData};
    }, [tableState, searchData, compareTableState, searchCompareData]);

    const {combinedData, combinedCompareData} = memoizedCombinedData;

    // 로우 합침 (한달치 검색시 한달 매출액 더하기)
    useEffect(() => {
        if (!isLoadingSalesDayData && salesDayData) {
            const aggregatedData1 = {};

            salesDayData.forEach((row) => {
                const franCode1 = row.chk_fran_code;

                if (!aggregatedData1[franCode1]) {
                    aggregatedData1[franCode1] = { ...row };
                } else {
                    aggregatedData1[franCode1].chk_total += row.chk_total || 0;
                    aggregatedData1[franCode1].chk_avg += row.chk_avg || 0;
                    aggregatedData1[franCode1].chk_delivery_sales += row.chk_delivery_sales || 0;
                    aggregatedData1[franCode1].chk_pos_sales += row.chk_pos_sales || 0;
                }
            });
            const aggregatedArray1 = Object.values(aggregatedData1);

            setTableState(aggregatedArray1);
        }

        if (!isLoadingCompareSalesDayData && compareSalesDayData) {
            const aggregatedData2 = {};

            compareSalesDayData.forEach((row) => {
                const franCode2 = row.pre_fran_code;

                if (!aggregatedData2[franCode2]) {
                    aggregatedData2[franCode2] = { ...row };
                } else {
                    aggregatedData2[franCode2].pre_total += row.pre_total || 0;
                    aggregatedData2[franCode2].pre_avg += row.pre_avg || 0;
                    aggregatedData2[franCode2].pre_delivery_sales += row.pre_delivery_sales || 0;
                    aggregatedData2[franCode2].pre_pos_sales += row.pre_pos_sales || 0;
                }
            });
            const aggregatedArray2 = Object.values(aggregatedData2);

            setCompareTableState(aggregatedArray2);
        }
    }, [salesDayData, isLoadingSalesDayData, compareSalesDayData, isLoadingCompareSalesDayData]);

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


   /* // 조회기간
    useEffect(() => {
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


    const {
        getTableProps: table1GetTableProps,
        getTableBodyProps: table1GetTableBodyProps,
        headerGroups: table1HeaderGroups,
        prepareRow: table1PrepareRow,
        page: table1Page,
        rows:table1Row,
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
        data: useMemo(() => combinedData, [combinedData]),
        initialState: {pageIndex: 0, pageSize: 10},
        autoResetPage: false,
    }, useSortBy, usePagination);

    const {
        getTableProps: table2GetTableProps,
        getTableBodyProps: table2GetTableBodyProps,
        headerGroups: table2HeaderGroups,
        prepareRow: table2PrepareRow,
        page: table2Page,
        rows:table2Row,
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
        data: useMemo(() => combinedCompareData, [combinedCompareData]),
        initialState: {pageIndex: 0, pageSize: 10},
        autoResetPage: false,
    }, useSortBy, usePagination);


    /* const handleFieldChange = (field, e) => {
         const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
         if (field === 'use_flag') {
             setCheckedUseFlag(value);
             console.log("setCheckedUseFlag(value)==", setCheckedUseFlag)
         }
     };*/
    const handleUseFlagChange = (e) => {
        setCheckedUseFlag((prev) => !prev);
        setSearchField((prevData) => ({
            ...prevData, [e.target.id]: e.target.checked ? "" : "1",
        }));
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
        refetchSalesDayData();
        refetchCompareSalesDayData()
        table1GotoPage(0);
        table2GotoPage(0);
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

    //차트 관련 문구 포맷
    const strippedNumber = indeCreaseTotal.replace(/[^\d-+]/g, '');
    const difference = parseInt(strippedNumber, 10);

    const titleTotal = difference.toLocaleString().replace(/-/g, ' ');

    const changeDirection = difference === 0 ? '입니다.' : (difference < 0 ? '하락 되었습니다.' : '상승 되었습니다.');
    const directionStyle = {
        color: difference === 0 ? 'black' : (difference < 0 ? 'blue' : 'red')
    };


    return (
        <>

        <div className={cx("analyze")}>
            <div className={cx("row")}>
                <h1 style={{lineHeight: '2', fontWeight: 'bold', textAlign: 'center', fontSize: '30px'}}>
                    일자별 매출 비교 (전체 가맹점)
                </h1>
                <div className={cx("box", "flex", "search-wrap")}>
                    <div className={cx("search-item")}>
                        <div className={cx("item-wrap")}>
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
                            <div className={cx("item")}>
                                <div className={cx("checkbox-wrap")}>
                                    <div className={cx("checkbox")}>
                                        <CheckBox title={"사용안함 포함"} id={"use_flag"} checked={checkedUseFlag} onChange={handleUseFlagChange}/>
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
                            <ChartPieAnalyze data={chartData1} title="매출합계"/>
                        </div>
                        <div style={{width: "33%"}}>
                            <ChartPieAnalyze data={chartData2} title="POS"/>
                        </div>
                        <div style={{width: "33%"}}>
                            <ChartPieAnalyze data={chartData3} title="배달"/>
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
                            <div className={cx("table-wrap")} style={{height: '12.5rem', backgroundColor: '#f2f2f2'}}>
                                {isLoadingSalesDayData ? (<div className={cx("loading-data")}>데이터를 가져오고
                                    있습니다.</div>) : !combinedData.length ? (
                                    <div className={cx("no-data")}>데이터가 없습니다.</div>) : (
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
                                </table>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx("row", "flex")}>
                <div className={cx("box", "no-padding-horizontal", "content-wrap")}>
                    <div className={cx("item")}>
                        <div className={cx("content-btn-wrap")}>
                            <BtnExcelDown_Analyze columns={table1HeaderGroups} tableData={table1Row} prepareRow={table1PrepareRow} periodType="조회"/>
                        </div>
                    </div>
                    <div className={cx("item")}>
                        {isLoadingCompareSalesDayData ? (
                            <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !combinedData.length ? (
                            <div className={cx("no-data")}>데이터가 없습니다.</div>) : (<>
                            <RenderTable
                                tableProps={{
                                    getTableProps: table1GetTableProps,
                                    getTableBodyProps: table1GetTableBodyProps,
                                    headerGroups: table1HeaderGroups,
                                    prepareRow: table1PrepareRow,
                                    page: table1Page,
                                    row:table1Row,
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
                        </>)}
                    </div>
                </div>
                <div className={cx("box", "no-padding-horizontal", "content-wrap")}>
                    <div className={cx("item")}>
                        <div className={cx("content-btn-wrap")}>
                            <BtnExcelDown_Analyze columns={table2HeaderGroups} tableData={table2Row} prepareRow={table2PrepareRow} periodType="대비"/>
                        </div>
                    </div>
                    <div className={cx("item")}>
                        {isLoadingCompareSalesDayData ? (
                            <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>) : !combinedCompareData.length ? (
                            <div className={cx("no-data")}>데이터가 없습니다.</div>) : (<>
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
                                compareTableState={compareTableState}
                                setCompareTableState={setCompareTableState}
                                rowFixHeaderValues={{
                                    sum_total: sum_pre_total,
                                    sum_avg: sum_pre_avg,
                                    sum_pos: sum_pre_pos,
                                    sum_delivery: sum_pre_delivery,
                                }}
                            />
                        </>)}
                    </div>
                </div>
            </div>
        </div>

        </>);
};

export default SalesAnalysis;

