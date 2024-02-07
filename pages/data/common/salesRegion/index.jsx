import { SEARCH_TYPE } from "@/consts/common";
import { salesDayColumns } from "@/consts/salesDayColumns";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchDateItems from "@/src/components/data/searchDateItems";
import SearchItem from "@/src/components/data/searchItem";
import { getSalesDayList, getSalesHeadersList, getSalesRegionList } from "@/utils/api/sales";
import { useChangeFormatDate } from "@/utils/useChangeFormatDate";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { useGetDateArray } from "@/utils/useGetDateArray";
import BarChart from "@/src/components/data/barChart";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import SearchAddressItem from "@/src/components/data/searchAddressItem";
import { SEARCH_ADDRESS } from "@/consts/common";
import { getSidoDataList, getSigoonDataList } from "@/utils/api/address";
import ChartPie from "@/src/components/data/chartPie";

//styles
import className from "classnames/bind";
import styles from "./salesRegion.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const SalesRegion = () => {
  const searchFieldData = {
    brand_code: "",
    gubun1: "",
    gubun2: "",
  };

  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const { t } = useTranslation(["common", "dataAdmin"]);
  const [companyCode, setCompanyCode] = useState("C0002");
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [startDate, setStartDate] = useState(oneWeekAgo);
  const [endDate, setEndDate] = useState(today);
  const [gubun1, setGubun1] = useState([]);
  const [gubun2, setGubun2] = useState([]);

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
    data: salesRegionData,
    isLoading: isLoadingSalesRegionData,
    refetch: refetchSalesRegionData,
  } = useQuery(["getSalesRegionData", endDate], () => getSalesRegionList(companyCode, formatStartDate, formatEndDate), {
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
    enabled: gubun1 !== undefined && gubun1.length !== 0,
  });

  useEffect(() => {
    if (!isLoadingSalesRegionData && salesRegionData) {
      setTableState(salesRegionData);
    }
  }, [salesRegionData, isLoadingSalesRegionData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.brand_code || row.brand_code?.toString().toLowerCase().includes(searchData.brand_code.toLowerCase())) &&
        (!searchData.gubun1 || row.gubun1?.toString().toLowerCase().includes(searchData.gubun1.toLowerCase())) &&
        (!searchData.gubun2 || row.gubun2?.toString().toLowerCase().includes(searchData.gubun2.toLowerCase()))
    );
  }, [tableState, searchData]);

  const memoizedSalesRegionChartData = useMemo(() => {
    const headersArray = headersData?.map((header) => header.accessor);
    const checkGubun2 = searchField.gubun2.length !== 0;
    console.log("checkGubun2", checkGubun2);
    const groupedData = memoizedData?.reduce((result, item) => {
      if (!checkGubun2) {
        const { gubun1, gubun1_h, ...rest } = item;
        const existingGubun1 = result.find((data) => data.gubun1 === gubun1);

        const newGubun1 = {};
        const valueName = "value";
        const totalName = "total";

        headersArray?.map((header) => {
          if (existingGubun1) {
            existingGubun1[header] = existingGubun1[header] + item[header];
            existingGubun1[valueName] = existingGubun1[valueName] + item[header];
            existingGubun1[totalName] = existingGubun1[totalName] + item[header];
          } else {
            newGubun1["gubun1"] = gubun1;
            newGubun1["name"] = gubun1_h;
            newGubun1[header] = item[header];
            newGubun1[valueName] = (newGubun1[valueName] || 0) + item[header];
            newGubun1[totalName] = (newGubun1[totalName] || 0) + item[header];
          }
        });
        if (!existingGubun1) {
          result.push(newGubun1);
        }
      } else {
        const { gubun1, gubun1_h, gubun2, gubun2_h, ...rest } = item;
        const existingGubun2 = result.find((data) => data.gubun2 === gubun2);

        const newGubun2 = {};
        const valueName = "value";
        const totalName = "total";

        headersArray?.map((header) => {
          if (existingGubun2) {
            existingGubun2[header] = existingGubun2[header] + item[header];
            existingGubun2[valueName] = existingGubun2[valueName] + item[header];
            existingGubun2[totalName] = existingGubun2[totalName] + item[header];
          } else {
            newGubun2["gubun2"] = gubun2;
            newGubun2["name"] = gubun2_h;
            newGubun2[header] = item[header];
            newGubun2[valueName] = (newGubun2[valueName] || 0) + item[header];
            newGubun2[totalName] = (newGubun2[totalName] || 0) + item[header];
          }
        });
        if (!existingGubun2) {
          result.push(newGubun2);
        }
      }

      return result;
    }, []);

    return groupedData || [];
  }, [memoizedData, headersData]);

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

  // const handleSelectChange = (selectedOption, { value }) => {
  //   if (selectedOption === "gubun1") {
  //     setGubun1([selectedOption]);
  //   }
  //   setSearchField((prevData) => ({
  //     ...prevData,
  //     [selectedOption]: value,
  //   }));
  // };

  const handleSearchSubmit = (e) => {
    setSearchData((prevData) => ({
      ...prevData,
      ...searchField,
    }));
    // gotoPage(0);
  };

  useEffect(() => {
    console.log("tableState", tableState);
    console.log("memoizedData", memoizedData);
    console.log("memoizedSalesRegionChartData", memoizedSalesRegionChartData);
    console.log("searchField", searchField);
  }, [memoizedSalesRegionChartData, searchField]);

  return (
    <>
      <div className={cx("sales-region")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
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
              <SearchItem
                searchType={SEARCH_TYPE.SELECT_BRAND}
                value={searchField.brand_code}
                title={"브랜드 명"}
                id={"brand_code"}
                onChange={handleFieldChange}
                companyCode=""
              />
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
                id={"gubun2"}
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
          <div className={cx("box", "pie")}>
            <div className={cx("item")}>
              {isLoadingSalesRegionData ? (
                <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
              ) : !memoizedData.length ? (
                <div className={cx("no-data")}>데이터가 없습니다.</div>
              ) : (
                <ChartPie memoizedSalesRegionChartData={memoizedSalesRegionChartData} />
              )}
            </div>
          </div>
        </div>

        <div className={cx("row")}>
          <div className={cx("box", "bar")}>
            <div className={cx("item")}>
              {isLoadingSalesRegionData ? (
                <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
              ) : !memoizedData.length ? (
                <div className={cx("no-data")}>데이터가 없습니다.</div>
              ) : (
                <BarChart memoizedSalesDayChartData={memoizedSalesRegionChartData} headersData={headersData} dataKey={"name"} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesRegion;