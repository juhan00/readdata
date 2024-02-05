import { SEARCH_TYPE } from "@/consts/common";
import { salesDayColumns } from "@/consts/salesDayColumns";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import SearchItem from "@/src/components/data/searchItem";
import { getSalesDayList, getSalesHeadersList } from "@/utils/api/sales";
import { useChangeFormatDate } from "@/utils/useChangeFormatDate";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { useGetDateArray } from "@/utils/useGetDateArray";
import BarChart from "@/src/components/data/barChart";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";

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
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const { t } = useTranslation(["common", "dataAdmin"]);
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [startDate, setStartDate] = useState(oneWeekAgo);
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

  const {
    data: headersData,
    isLoading: isLoadingHeadersData,
    refetch: refetchHeadersData,
  } = useQuery("getSalesHeadersData", () => getSalesHeadersList("B0002"), {
    enabled: true,
  });

  console.log("salesDayData==",salesDayData);
  console.log("headersData==",headersData);

  useEffect(() => {
    if (!isLoadingSalesDayData && salesDayData) {
      setTableState(salesDayData);
    }
    console.log("isLoadingSalesDayData=",isLoadingSalesDayData);
    console.log("salesDayData=",salesDayData);
  }, [salesDayData, isLoadingSalesDayData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.store || row.store?.toString().toLowerCase().includes(searchData.store.toLowerCase())) &&
        (!searchData.uname || row.uname?.toString().toLowerCase().includes(searchData.uname.toLowerCase()))
    );
  }, [tableState, searchData]);

  const memoizedSalesDates = useMemo(() => {
    return useGetDateArray(startDate, endDate);
  }, [endDate]);

  const memoizedSalesDayColumns = useMemo(() => {
    return headersData ? salesDayColumns(memoizedSalesDates, headersData) : [];
  }, [memoizedSalesDates, headersData]);

  const memoizedSalesDayData = useMemo(() => {
    const setStoreGroupData = (data) => {
      const groupData = {};

      data.forEach((item, index) => {
        const key = `${item.brand_name}_${item.store}`;
        const sale_date = item.sale_date;
        //key= (주)프랭크에프엔비_명일점 @@@sale_date= 2023-12-01
        if (!groupData[key]) {
          groupData[key] = {
            brand_name: item.brand_name,
            store: item.store,
            fran_code: item.fran_code,
            data: {},
          };
        }
        console.log("groupData[key]@@@=:,");

        const salesData = {
          sale_date: item.sale_date,
        };

        headersData?.forEach((header) => {
          const accessor = header.accessor;
          salesData[accessor] = item[accessor];
        });

        groupData[key].data[sale_date] = salesData;
      });

      const result = Object.values(groupData);
      return result;
    };
    return setStoreGroupData(memoizedData);
  }, [memoizedData, headersData]);

  const memoizedSalesDayChartData = useMemo(() => {
    const totalDataArray = [];

    memoizedSalesDayData.forEach((item) => {
      Object.keys(item.data).forEach((sale_date) => {
        const saleDate = item.data[sale_date].sale_date;

        let dateObject = totalDataArray.find((obj) => obj.sale_date === saleDate);

        if (!dateObject) {
          dateObject = {
            sale_date: saleDate,
          };
          totalDataArray.push(dateObject);
        }

        Object.keys(item.data[sale_date]).forEach((column) => {
          if (column !== "sale_date") {
            dateObject[column] = (Number(dateObject[column]) || 0) + Number(item.data[sale_date][column]);
          }
        });
      });
    });

    totalDataArray.forEach((obj) => {
      const total = Object.keys(obj).reduce((sum, key) => {
        if (key !== "sale_date") {
          sum += obj[key];
        }
        return sum;
      }, 0);

      obj.total = total;
    });

    // console.log("totalDataArray================>", totalDataArray);
    return totalDataArray;
  }, [memoizedSalesDayData]);

  useEffect(() => {
    console.log("memoizedSalesDayColumns===========>", memoizedSalesDayColumns);
  }, [memoizedSalesDayColumns]);

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
      columns: memoizedSalesDayColumns,
      data: useMemo(() => memoizedSalesDayData, [memoizedSalesDayData]),
      initialState: { pageIndex: 0, pageSize: 50 },
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
                labelText={1}
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
                <BtnExcelDown columns={headerGroups} tableData={memoizedSalesDayData} />
              </div>
            </div>
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

        <div className={cx("row")}>
          <div className={cx("box")}>
            <div className={cx("item")}>
              <BarChart memoizedSalesDayChartData={memoizedSalesDayChartData} headersData={headersData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesDay;
