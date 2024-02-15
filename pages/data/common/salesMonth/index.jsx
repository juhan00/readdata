import { SEARCH_TYPE } from "@/consts/common";
import { changeSalesMonthColumns } from "@/consts/salesMonthColumns";
import BarChart from "@/src/components/data/barChart";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import SearchItem from "@/src/components/data/searchItem";
import { getSalesHeadersList, getSalesMonthList } from "@/utils/api/sales";
import { useChangeFormatMonth } from "@/utils/useChangeFormatDate";
import { useGetMonthArray } from "@/utils/useGetDateArray";
import { set, startOfMonth } from "date-fns";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { useGlobalState } from "@/context/globalStateContext";
//styles
import className from "classnames/bind";
import styles from "./salesMonth.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesMonth = () => {
  const searchFieldData = {
    brand_code: "",
    store: "",
  };

  const today = new Date();
  const thisMonth = startOfMonth(set(today, { month: today.getMonth() }));

  const { t } = useTranslation(["common", "dataAdmin"]);
  const [{ popupState, userInfo }, setGlobalState] = useGlobalState();
  const [companyCode, setCompanyCode] = useState(userInfo.companyCode);
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [startDate, setStartDate] = useState(thisMonth);
  const [endDate, setEndDate] = useState(thisMonth);
  const [defaultBrand, setDefaultBrand] = useState({});

  useEffect(() => {
    setSearchData((prevData) => ({
      ...prevData,
      ["brand_name"]: defaultBrand.brand_name,
    }));
  }, [defaultBrand]);

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
  } = useQuery(["getSalesHeadersData", defaultBrand.brand_code], () => getSalesHeadersList(defaultBrand.brand_code), {
    enabled: defaultBrand.brand_code !== undefined,
  });

  useEffect(() => {
    if (!isLoadingSalesMonthData && salesMonthData) {
      setTableState(salesMonthData);
    }
  }, [salesMonthData, isLoadingSalesMonthData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter(
        (row) =>
            (!searchData.brand_name || row.brand_name?.toString().toLowerCase().includes(searchData.brand_name.toLowerCase())) &&
            (!searchData.store || row.store?.toString().toLowerCase().includes(searchData.store.toLowerCase()))
    );
  }, [tableState, searchData]);

  const memoizedSalesDates = useMemo(() => {
    return useGetMonthArray(startDate, endDate);
  }, [endDate]);

  const memoizedSalesMonthColumns = useMemo(() => {
    return headersData ? changeSalesMonthColumns(t, memoizedSalesDates, headersData) : [];
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

    const fieldName = field === "brand_code" ? "brand_name" : field;
    const fieldValue = field === "brand_code" ? e.target.options[e.target.selectedIndex].text : e.target.value;

    setSearchField((prevData) => ({
      ...prevData,
      [fieldName]: fieldValue,
    }));
  };

  const handleSearchSubmit = (e) => {
    // refetchSalesMonthData();
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
              <div className={cx("search-item")}>
                <div className={cx("item-wrap")}>
                  <div className={cx("item")}>
                    <SearchItem
                        searchType={SEARCH_TYPE.SELECT_BRAND}
                        value={searchField.brand_code}
                        setDefaultValue={setDefaultBrand}
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
                        isMonth={true}
                        updateDate={updateDate}
                    />
                  </div>
                  <div className={cx("item")}>
                    <SearchItem searchType={SEARCH_TYPE.INPUT} value={searchField.uid} title={"가맹점명"} id={"store"} onChange={handleFieldChange} />
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
                {isLoadingSalesMonthData ? (
                    <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
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