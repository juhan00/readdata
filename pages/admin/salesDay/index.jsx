import { SEARCH_TYPE_INPUT } from "@/consts/common";
import { salesDayColumns } from "@/consts/salesDayColumns";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import SearchItem from "@/src/components/data/searchItem";
import { getSalesDayList } from "@/utils/api/sales";
import { useChangeFormatDate } from "@/utils/useChangeFormatDate";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";

//styles
import className from "classnames/bind";
import styles from "./salesDay.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesDay = () => {
  const searchFieldData = {
    store: "",
  };

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const { t } = useTranslation(["common", "dataAdmin"]);
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [startDate, setStartDate] = useState(oneMonthAgo);
  const [endDate, setEndDate] = useState(today);

  const formatStartDate = useMemo(() => {
    return useChangeFormatDate(startDate);
  }, [startDate]);

  const formatEndDate = useMemo(() => {
    return useChangeFormatDate(endDate);
  }, [endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const {
    data: salesDayData,
    isLoading: isLoadingSalesDayData,
    refetch: refetchSalesDayData,
  } = useQuery(["getSalesDayData", formatEndDate], () => getSalesDayList(formatStartDate, formatEndDate), {
    enabled: formatStartDate !== undefined && formatEndDate !== undefined,
  });

  useEffect(() => {
    if (!isLoadingSalesDayData && salesDayData) {
      setTableState(salesDayData);
    }
  }, [salesDayData, isLoadingSalesDayData]);

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
      columns: salesDayColumns,
      data: useMemo(() => memoizedData, [memoizedData]),
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
              />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} value={searchField.uid} title={"가맹점명"} id={"store"} onChange={handleFieldChange} />
            </div>
            <div className={cx("btn-submit")}>
              <BtnSearch onClick={handleSearchSubmit} />
            </div>
          </div>
        </div>

        <div className={cx("row")}>
          <div className={cx("box", "content-wrap")}>
            {/* <div className={cx("item")}>
              <div className={cx("content-btn-wrap")}>
                <BtnTableAdd onClick={() => handleNewRowClick()} />
                <BtnExcelDown columns={salesDayColumns} tableData={memoizedData} />
              </div>
            </div> */}
            <div className={cx("item")}>
              {isLoadingSalesDayData ? (
                <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
              ) : !memoizedData.length ? (
                <div className={cx("no-data")}>데이터가 없습니다.</div>
              ) : (
                <RenderTable
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesDay;
