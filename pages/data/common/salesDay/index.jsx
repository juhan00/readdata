import { SEARCH_TYPE } from "@/consts/common";
import { changeSalesDayColumns } from "@/consts/salesDayColumns";
import BarChart from "@/src/components/data/barChart";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import SearchItem from "@/src/components/data/searchItem";
import { getSalesDayList, getSalesHeadersList } from "@/utils/api/sales";
import { useChangeFormatDate } from "@/utils/useChangeFormatDate";
import { useGetDateArray } from "@/utils/useGetDateArray";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { useGlobalState } from "@/context/globalStateContext";

//styles
import className from "classnames/bind";
import styles from "./salesDay.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesDay = () => {
  const searchFieldData = {
    brand_code: "",
    store: "",
  };

  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const { t } = useTranslation(["common", "columns"]);
  const [{ popupState, userInfo }, setGlobalState] = useGlobalState();
  const [companyCode, setCompanyCode] = useState(userInfo.companyCode);
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [startDate, setStartDate] = useState(oneWeekAgo);
  const [endDate, setEndDate] = useState(today);
  const [defaultBrandCode, setDefaultBrandCode] = useState("");

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

  const updateDate = (date) => {
    const updatedDate = new Date(date.getTime() + 1);
    setEndDate(updatedDate);
  };

  const {
    data: salesDayData,
    isLoading: isLoadingSalesDayData,
    refetch: refetchSalesDayData,
  } = useQuery(["getSalesDayData", endDate], () => getSalesDayList(companyCode, formatStartDate, formatEndDate), {
    enabled: companyCode !== undefined && formatStartDate !== undefined && formatEndDate !== undefined,
  });

  const {
    data: headersData,
    isLoading: isLoadingHeadersData,
    refetch: refetchHeadersData,
  } = useQuery(["getSalesHeadersData", defaultBrandCode], () => getSalesHeadersList(defaultBrandCode), {
    enabled: defaultBrandCode !== undefined,
  });

  useEffect(() => {
    if (!isLoadingSalesDayData && salesDayData) {
      setTableState(salesDayData);
    }
  }, [salesDayData, isLoadingSalesDayData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.brand_code || row.brand_code?.toString().toLowerCase().includes(searchData.brand_code.toLowerCase())) &&
        (!searchData.store || row.store?.toString().toLowerCase().includes(searchData.store.toLowerCase()))
    );
  }, [tableState, searchData]);

  const memoizedSalesDates = useMemo(() => {
    return useGetDateArray(startDate, endDate);
  }, [startDate, endDate]);

  const memoizedSalesDayColumns = useMemo(() => {
    return headersData ? changeSalesDayColumns(t, memoizedSalesDates, headersData) : [];
  }, [memoizedSalesDates, headersData]);

  const memoizedSalesDayData = useMemo(() => {
    const setStoreGroupData = (data) => {
      const groupData = {};

      data.forEach((item, index) => {
        const key = `${item.brand_name}_${item.store}`;
        const sale_date = item.sale_date;
        if (!groupData[key]) {
          groupData[key] = {
            brand_name: item.brand_name,
            store: item.store,
            fran_code: item.fran_code,
            data: {},
          };
        }

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
      <div className={cx("sales-day")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("search-item")}>
              <div className={cx("item-wrap")}>
                <div className={cx("item")}>
                  <SearchItem
                    searchType={SEARCH_TYPE.SELECT_BRAND}
                    value={searchField.brand_code}
                    setDefaultValue={setDefaultBrandCode}
                    title={"브랜드 명"}
                    id={"brand_code"}
                    onChange={handleFieldChange}
                    companyCode={companyCode}
                  />
                </div>
                <div className={cx("item")}>
                  <SearchDateItems
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                    updateDate={updateDate}
                  />
                </div>
                <div className={cx("item")}>
                  <SearchItem searchType={SEARCH_TYPE.INPUT} value={searchField.store} title={"가맹점명"} id={"store"} onChange={handleFieldChange} />
                </div>
              </div>
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
              {isLoadingSalesDayData ? (
                <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
              ) : memoizedData.length === 0 ? (
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
