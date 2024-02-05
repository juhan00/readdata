import { SEARCH_TYPE } from "@/consts/common";
import { salesTestMonthColumns, salesMonthColumns } from "@/consts/salesTestMonthColumns";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTableTest from "@/src/components/data/renderTableTest";
import SearchDateItems from "@/src/components/data/searchDateItems";
import SearchItem from "@/src/components/data/searchItem";
import { getSalesMonthList } from "@/utils/api/sales";
import { useChangeFormatMonth } from "@/utils/useChangeFormatDate";
import { set, startOfMonth } from "date-fns";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";

//styles
import className from "classnames/bind";
import styles from "./salesTestMonth.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const salesData = [
  {
    store: "명륜진사갈비1",
    data: [
      { date: "2024-01-01", baemin_sales: 1000, yogiyo_sales: 2000, pos_sales: 3000 },
      { date: "2024-01-02", baemin_sales: 4000, yogiyo_sales: 5000, pos_sales: 6000 },
      { date: "2024-01-03", baemin_sales: 7000, yogiyo_sales: 8000, pos_sales: 9000 },
    ],
  },
  {
    store: "명륜진사갈비3",
    data: [
      { date: "2024-01-01", baemin_sales: 19000, yogiyo_sales: 20000, pos_sales: 21000 },
      { date: "2024-01-02", baemin_sales: 22000, yogiyo_sales: 23000, pos_sales: 24000 },
      { date: "2024-01-03", baemin_sales: 25000, yogiyo_sales: 26000, pos_sales: 27000 },
    ],
  },
  {
    store: "명륜진사갈비2",
    data: [
      { date: "2024-01-01", baemin_sales: 10000, yogiyo_sales: 11000, pos_sales: 12000 },
      { date: "2024-01-02", baemin_sales: 13000, yogiyo_sales: 14000, pos_sales: 15000 },
      { date: "2024-01-03", baemin_sales: 16000, yogiyo_sales: 17000, pos_sales: 18000 },
    ],
  },
];

const SalesTestMonth = () => {
  const searchFieldData = {
    store: "",
  };

  const today = new Date();
  const thisMonth = startOfMonth(set(today, { month: today.getMonth() }));

  const { t } = useTranslation(["common", "dataAdmin"]);
  const [tableState, setTableState] = useState(salesData);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [startDate, setStartDate] = useState(thisMonth);
  const [endDate, setEndDate] = useState(thisMonth);

  const salesDates = ["2024-01-01", "2024-01-02", "2024-01-03"];
  const headers = [
    { header: "배달의민족 매출", accessor: "baemin_sales" },
    { header: "요기요 매출", accessor: "yogiyo_sales" },
    { header: "포스 매출", accessor: "pos_sales" },
  ];

  const [salesTestMonthColumnsData, setSalesTestMonthColumnsData] = useState();

  useEffect(() => {
    const testData = salesTestMonthColumns(salesDates, headers);
    setSalesTestMonthColumnsData(testData);
    console.log("testData", testData);
    console.log("salesMonthColumns", salesMonthColumns);
  }, []);

  const formatStartDate = useMemo(() => {
    return useChangeFormatMonth(startDate);
  }, [startDate]);

  const formatEndDate = useMemo(() => {
    return useChangeFormatMonth(endDate);
  }, [endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.store || row.store?.toString().toLowerCase().includes(searchData.store.toLowerCase())) &&
        (!searchData.uname || row.uname?.toString().toLowerCase().includes(searchData.uname.toLowerCase()))
    );
  }, [tableState, searchData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageCount,
    pageOptions,
  } = useTable(
    {
      columns: salesTestMonthColumnsData || [],
      data: useMemo(() => tableState, [tableState]),
      initialState: { pageIndex: 0, pageSize: 10 },
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const handleFieldChange = (field, e) => {
    e.preventDefault();
    setSearchField((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleSearchSubmit = (e) => {
    setSearchData((prevData) => ({
      ...prevData,
      ...searchField,
    }));
    gotoPage(0);
  };

  return (
    <>
      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchDateItems
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                isMonth={true}
              />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE.INPUT} value={searchField.uid} title={"가맹점명"} id={"store"} onChange={handleFieldChange} />
            </div>
            <div className={cx("btn-submit")}>
              <BtnSearch onClick={handleSearchSubmit} />
            </div>
          </div>
        </div>

        <div className={cx("row")}>
          <div className={cx("box", "content-wrap")}>
            <div className={cx("item")}>
              <div className={cx("content-btn-wrap")}>
                <BtnExcelDown columns={headerGroups} tableData={page} />
              </div>
            </div>
            <div className={cx("item")}>
              <RenderTableTest
                tableProps={{
                  getTableProps,
                  getTableBodyProps,
                  headerGroups,
                  prepareRow,
                  page,
                  pageIndex,
                  pageSize,
                  gotoPage,
                  previousPage,
                  nextPage,
                  canPreviousPage,
                  canNextPage,
                  pageCount,
                  pageOptions,
                }}
                editMode={false}
                setTableState={setTableState}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesTestMonth;
