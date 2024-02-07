import { SEARCH_TYPE } from "@/consts/common";
import { salesMonthColumns } from "@/consts/salesMonthColumns";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import SearchItem from "@/src/components/data/searchItem";
import { getSalesMonthList, getSalesHeadersList } from "@/utils/api/sales";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { useGetMonthArray } from "@/utils/useGetDateArray";
import BarChart from "@/src/components/data/barChart";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import SearchAddressItem from "@/src/components/data/searchAddressItem";
import { set, startOfMonth } from "date-fns";
import { useChangeFormatMonth } from "@/utils/useChangeFormatDate";
import { SEARCH_ADDRESS } from "@/consts/common";
import { getSidoDataList, getSigoonDataList } from "@/utils/api/address";
//styles
import className from "classnames/bind";
import styles from "./salesMonth.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesMonth = () => {
  const searchFieldData = {
    store: "",
  };

  const today = new Date();
  const thisMonth = startOfMonth(set(today, { month: today.getMonth() }));

  const { t } = useTranslation(["common", "dataAdmin"]);
  const [companyCode, setCompanyCode] = useState("C0002");
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [startDate, setStartDate] = useState(thisMonth);
  const [endDate, setEndDate] = useState(thisMonth);
  const [gubun1, setGubun1] = useState();

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

  const updateDate = (date) => {
    console.log("updateData", date);
    const updatedDate = new Date(date.getTime() + 1);
    setEndDate(updatedDate);
  };

  const {
    data: salesMonthData,
    isLoading: isLoadingSalesMonthData,
    refetch: refetchSalesMonthData,
  } = useQuery(["getSalesMonthData", endDate], () => getSalesMonthList(companyCode, formatStartDate, formatEndDate), {
    enabled: companyCode !== undefined && formatStartDate !== undefined && formatEndDate !== undefined,
  });

  const {
    data: headersData,
    isLoading: isLoadingHeadersData,
    refetch: refetchHeadersData,
  } = useQuery("getSalesHeadersData", () => getSalesHeadersList("B0002"), {
    enabled: true,
  });

  const {
    data: sidoData,
    isLoading: isLoadingSidoDataData,
    refetch: refetchSidoData,
  } = useQuery("getSidoData", () => getSidoDataList(), {
    enabled: true,
  });

  const {
    data: sigoonData,
    isLoading: isLoadingSigoonDataData,
    refetch: refetchSigoonData,
  } = useQuery(["getSigoonData", gubun1], () => getSigoonDataList(gubun1), {
    enabled: gubun1 !== undefined,
  });

  useEffect(() => {
    if (!isLoadingSalesMonthData && salesMonthData) {
      setTableState(salesMonthData);
    }
  }, [salesMonthData, isLoadingSalesMonthData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.store || row.store?.toString().toLowerCase().includes(searchData.store.toLowerCase())) &&
        (!searchData.uname || row.uname?.toString().toLowerCase().includes(searchData.uname.toLowerCase()))
    );
  }, [tableState, searchData]);

  const memoizedSalesDates = useMemo(() => {
    return useGetMonthArray(startDate, endDate);
  }, [endDate]);

  const memoizedSalesMonthColumns = useMemo(() => {
    return headersData ? salesMonthColumns(memoizedSalesDates, headersData) : [];
  }, [memoizedSalesDates, headersData]);

  const memoizedSalesMonthData = useMemo(() => {
    const setStoreGroupData = (data) => {
      const groupData = {};

      data.forEach((item, index) => {
        const key = `${item.brand_name}_${item.store}`;
        const sale_date = item.sale_month;
        if (!groupData[key]) {
          groupData[key] = {
            brand_name: item.brand_name,
            store: item.store,
            fran_code: item.fran_code,
            data: {},
          };
        }

        const salesData = {
          sale_date: item.sale_month,
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

  const memoizedSalesMonthChartData = useMemo(() => {
    const totalDataArray = [];

    memoizedSalesMonthData.forEach((item) => {
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
  }, [memoizedSalesMonthData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows,
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
      columns: memoizedSalesMonthColumns,
      data: useMemo(() => memoizedSalesMonthData, [memoizedSalesMonthData]),
      initialState: { pageIndex: 0, pageSize: 50 },
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const handleFieldChange = (field, e) => {
    e.preventDefault();

    if (field === "gubun1") {
      setGubun1(e.target.value);
    }

    setSearchField((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleSearchSubmit = (e) => {
    refetchSalesMonthData();
    setSearchData((prevData) => ({
      ...prevData,
      ...searchField,
    }));
    gotoPage(0);
  };

  return (
    <>
      <div className={cx("sales-month")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchDateItems
                startDate={startDate}
                endDate={endDate}
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                isMonth={true}
                updateDate={updateDate}
              />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE.INPUT} value={searchField.uid} title={"가맹점명"} id={"store"} onChange={handleFieldChange} />
            </div>
            <div className={cx("item")}>
              <SearchAddressItem
                title={"지역1"}
                type={SEARCH_ADDRESS.SIDO}
                data={sidoData}
                id={"gubun1"}
                value={searchField.gubun1}
                onChange={handleFieldChange}
              />
            </div>
            <div className={cx("item")}>
              <SearchAddressItem
                title={"지역2"}
                type={SEARCH_ADDRESS.SIGOON}
                data={sigoonData}
                id={"addressItem2"}
                value={searchField.gubun2}
                onChange={handleFieldChange}
              />
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
                <BtnExcelDown columns={headerGroups} tableData={rows} prepareRow={prepareRow} />
              </div>
            </div>
            <div className={cx("item")}>
              {isLoadingSalesMonthData ? (
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
              <BarChart memoizedSalesDayChartData={memoizedSalesMonthChartData} headersData={headersData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesMonth;
