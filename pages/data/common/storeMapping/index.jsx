import { SEARCH_TYPE } from "@/consts/common";
import { changeStoreMappingColumns } from "@/consts/storeMappingColumns";
import { useGlobalState } from "@/context/globalStateContext";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import ScrapingSearch from "@/src/components/data/scrapingSearch";
import SearchItem from "@/src/components/data/searchItem";
import { getStoreMapingList } from "@/utils/api/store";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";

//styles
import className from "classnames/bind";
import styles from "./storeMapping.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const StoreMapping = () => {
  const { t } = useTranslation(["common", "columns"]);
  const storeMappingColumns = useMemo(() => changeStoreMappingColumns(t), []);

  const searchFieldData = {
    fran_name: "",
    scrap_name: "",
  };

  const [{ popupState }, setGlobalState] = useGlobalState();
  const [companyCode, setCompanyCode] = useState("C0001");
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [selectFranName, setSelectFranName] = useState("");
  const [selectFranCode, setSelectFranCode] = useState("");

  const {
    data: storeMapingData,
    isLoading: isLoadingStoreMapingData,
    refetch: refetchStoreMapingData,
  } = useQuery("getStoreMapingData", () => getStoreMapingList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    if (!isLoadingStoreMapingData && storeMapingData) {
      setTableState(storeMapingData);
    }
  }, [storeMapingData, isLoadingStoreMapingData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter((row) => {
      const conditions = Object.entries(searchData).map(([key, value]) => {
        switch (key) {
          case "fran_name":
            return !value || row.fran_name?.toString().toLowerCase().includes(value.toLowerCase());
          case "scrap_name":
            return value === "" ? true : value === "0" ? !row.scrap_name : value === "1" ? !!row.scrap_name : true;
          default:
            return true;
        }
      });

      return conditions.every((condition) => condition);
    });
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
      columns: storeMappingColumns,
      data: useMemo(() => memoizedData, [memoizedData]),
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

  const handleClickReturn = (state) => {
    setSelectFranName(state.fran_name);
    setSelectFranCode(state.fran_code);
  };

  return (
    <>
      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("search-item")}>
              <div className={cx("item-wrap")}>
                <div className={cx("item")}>
                  <SearchItem
                    searchType={SEARCH_TYPE.INPUT}
                    value={searchField.fran_name}
                    title={"가맹점명"}
                    id={"fran_name"}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className={cx("item")}>
                  <SearchItem
                    searchType={SEARCH_TYPE.SELECT_MAPPING}
                    value={searchField.scrap_name}
                    title={"맵핑여부"}
                    id={"scrap_name"}
                    onChange={handleFieldChange}
                  />
                </div>
              </div>
            </div>
            <div className={cx("btn-submit")}>
              <BtnSearch onClick={handleSearchSubmit} />
            </div>
          </div>
        </div>

        <div className={cx("row", "flex")}>
          <div className={cx("box", "content-wrap")}>
            <div className={cx("item")}>
              {isLoadingStoreMapingData ? (
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
                  editMode={true}
                  tableState={tableState}
                  setTableState={setTableState}
                  handleClickReturn={handleClickReturn}
                  returnBtnName={"선택"}
                  rowSelect={true}
                />
              )}
            </div>
          </div>
          <div className={cx("box", "content-wrap")}>
            <ScrapingSearch selectFranName={selectFranName} selectFranCode={selectFranCode} refetchStoreMapingData={refetchStoreMapingData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreMapping;
