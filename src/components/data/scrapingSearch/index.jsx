import React, { useState, useEffect, useMemo, use } from "react";
import { useTranslation } from "next-i18next";
import RenderTable from "@/src/components/data/renderTable";
import { usePagination, useSortBy, useTable } from "react-table";
import { scrapingColumns } from "@/consts/scrapingColumns";
import { QueryClient, useMutation, useQuery } from "react-query";

import { getScrapingList } from "@/utils/api/store";

//styles
import className from "classnames/bind";
import styles from "./scrapingSearch.module.scss";
const cx = className.bind(styles);

const ScrapingSearch = () => {
  const { t } = useTranslation(["common", "dataAdmin"]);
  const [tableState, setTableState] = useState([]);
  const [franName, setFranName] = useState("");
  const [filterBrandName, setFilterBrandName] = useState("");
  const [brandName, setBrandName] = useState("");

  const { data: scrapingData, isLoading: isLoadingScrapingData, refetch: refetchScrapingData } = useQuery("getScrapingData", getScrapingList);

  useEffect(() => {
    if (!isLoadingScrapingData && scrapingData) {
      setTableState(scrapingData);
    }
  }, [scrapingData, isLoadingScrapingData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter((row) => !filterBrandName || row.brand_name?.toString().toLowerCase().includes(filterBrandName.toLowerCase()));
  }, [tableState, filterBrandName]);

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
      columns: scrapingColumns,
      data: useMemo(() => memoizedData, [memoizedData]),
      initialState: { pageIndex: 0, pageSize: 10 },
      autoResetPage: false,
      manualPagination: true,
    },
    useSortBy,
    usePagination
  );

  const handleClickReturn = (state) => {
    console.log("handleClickReturn", state);
  };

  return (
    <div className={cx("scraping-search")}>
      <div className={cx("item")}>
        <div className={cx("title")}>가맹점 명</div>
        <div className={cx("input-wrap")}>
          <input value={franName} onChange={(e) => setFranName(e.target.value)} readOnly />
        </div>
      </div>
      <div className={cx("item")}>
        <div className={cx("title")}>맵핑 가맹점 명(수집데이터)</div>
        <div className={cx("search-wrap")}>
          <label>브랜드 명</label>
          <input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
          <button onClick={() => setFilterBrandName(brandName)}>검색</button>
        </div>
      </div>
      <div className={cx("item")}>
        <div className={cx("content-wrap")}>
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
            }}
            editMode={true}
            tableState={tableState}
            setTableState={setTableState}
            handleClickReturn={handleClickReturn}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrapingSearch;
