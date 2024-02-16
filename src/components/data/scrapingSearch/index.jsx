import React, { useState, useEffect, useMemo, use } from "react";
import { useTranslation } from "next-i18next";
import RenderTable from "@/src/components/data/renderTable";
import { usePagination, useSortBy, useTable } from "react-table";
import { changeScrapingColumns } from "@/consts/scrapingColumns";
import { QueryClient, useMutation, useQuery } from "react-query";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";
import { getScrapingList, updateStoreMapingList } from "@/utils/api/store";
import CheckBox from "../checkBox";

//styles
import className from "classnames/bind";
import styles from "./scrapingSearch.module.scss";
const cx = className.bind(styles);

const ScrapingSearch = ({ selectFranName, selectFranCode, refetchStoreMapingData }) => {
  const { t } = useTranslation(["common", "columns"]);
  const scrapingColumns = useMemo(() => changeScrapingColumns(t), []);

  const [companyCode, setCompanyCode] = useState("C0001");
  const [{ popupState }, setGlobalState] = useGlobalState();
  const [tableState, setTableState] = useState([]);
  const [franName, setFranName] = useState("");
  const [filterScrapFranName, setFilterScrapFranName] = useState("");
  const [scrapFranName, setScrapFranName] = useState("");
  const [checkedJoinFlag, setCheckedJoinFlag] = useState(false);

  const {
    data: scrapingData,
    isLoading: isLoadingScrapingData,
    refetch: refetchScrapingData,
  } = useQuery(["getScrapingData", checkedJoinFlag], () => getScrapingList(companyCode, checkedJoinFlag), {
    enabled: companyCode !== undefined && checkedJoinFlag !== undefined,
  });

  useEffect(() => {
    setFranName(selectFranName);
  }, [selectFranName]);

  useEffect(() => {
    if (!isLoadingScrapingData && scrapingData) {
      setTableState(scrapingData);
    }
  }, [scrapingData, isLoadingScrapingData]);

  const updateMutation = useMutation(async (data) => await updateStoreMapingList(data), {
    onSuccess: () => {
      refetchStoreMapingData();
      refetchScrapingData();

      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "업데이트를 완료했습니다.",
        },
      }));
    },
    onError: (error) => {
      console.error("Update error:", error);

      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "업데이트에 실패했습니다.",
        },
      }));
    },
  });

  const memoizedData = useMemo(() => {
    return tableState?.filter((row) => !filterScrapFranName || row.fran_name?.toString().toLowerCase().includes(filterScrapFranName.toLowerCase()));
  }, [tableState, filterScrapFranName]);

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
    if (!franName || !state) {
      return;
    }
    const data = {
      scrap_name: state.fran_name,
      fran_name: franName,
      fran_code: selectFranCode,
    };
    updateMutation.mutate(data);
  };

  const handleJoinFlagChange = (e) => {
    setCheckedJoinFlag((prev) => !prev);
  };

  return (
    <div className={cx("scraping-search")}>
      <div className={cx("item")}>
        <div className={cx("title")}>가맹점 명</div>
        <div className={cx("input-wrap")}>
          <input value={franName} readOnly />
        </div>
      </div>
      <div className={cx("item")}>
        <div className={cx("title")}>맵핑 가맹점 명(수집데이터)</div>
        <div className={cx("search-wrap")}>
          <label>가맹점 명</label>
          <input value={scrapFranName} onChange={(e) => setScrapFranName(e.target.value)} />
          <button onClick={() => setFilterScrapFranName(scrapFranName)}>검색</button>
        </div>
      </div>
      <div className={cx("item")}>
        <div className={cx("join-flag-wrap")}>
          <CheckBox title={"맵핑 데이터 포함"} id={"join_flag"} checked={checkedJoinFlag} onChange={handleJoinFlagChange} />
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
            returnBtnName={"맵핑"}
            tableHeight={"37.2rem"}
          />
        </div>
      </div>
    </div>
  );
};

export default ScrapingSearch;
