import { SEARCH_TYPE } from "@/consts/common";
import { POPUP_DEFAULT } from "@/consts/popup";
import { storeAccountColumns } from "@/consts/storeAccountColumns";
import { useGlobalState } from "@/context/globalStateContext";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchItem from "@/src/components/data/searchItem";
import { getStoreAccountList, updateStoreAccountList } from "@/utils/api/store";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";

//styles
import className from "classnames/bind";
import styles from "./storeAccount.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const StoreAccount = () => {
  const searchFieldData = {
    brand_code: "",
    fran_name: "",
    use_flag: "",
  };

  const [{ popupState }, setGlobalState] = useGlobalState();
  const { t } = useTranslation(["common", "dataAdmin"]);
  const [companyCode, setCompanyCode] = useState("C0001");
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: storeData,
    isLoading: isLoadingStoreData,
    refetch: refetchStoreData,
  } = useQuery("getStoreAccountData", () => getStoreAccountList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    if (!isLoadingStoreData && storeData) {
      setTableState(storeData);
    }
  }, [storeData, isLoadingStoreData]);

  const updateMutation = useMutation(async (data) => await updateStoreAccountList(data), {
    onSuccess: () => {
      refetchStoreData();
    },
    onError: (error) => {
      console.error("Update error:", error);

      setGlobalState({
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "업데이트에 실패했습니다.",
        },
      });
    },
  });

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.brand_code || row.brand_code?.toString().toLowerCase().includes(searchData.brand_code.toLowerCase())) &&
        (!searchData.fran_name || row.fran_name?.toString().toLowerCase().includes(searchData.fran_name.toLowerCase())) &&
        (!searchData.use_flag || row.use_flag?.toString().toLowerCase().includes(searchData.use_flag.toLowerCase()))
    );
  }, [tableState, searchData]);

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
      columns: storeAccountColumns,
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

  const handleUpdateData = (data) => {
    updateMutation.mutate(data);
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
                    searchType={SEARCH_TYPE.SELECT_BRAND}
                    value={searchField.brand_code}
                    title={"브랜드 명"}
                    id={"brand_code"}
                    onChange={handleFieldChange}
                    companyCode=""
                  />
                </div>
                <div className={cx("item")}>
                  <SearchItem
                    searchType={SEARCH_TYPE.INPUT}
                    value={searchField.fran_name}
                    title={"가맹점 명"}
                    id={"fran_name"}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className={cx("item")}>
                  <SearchItem
                    searchType={SEARCH_TYPE.SELECT_FLAG}
                    value={searchField.use_flag}
                    title={"사용여부"}
                    id={"use_flag"}
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

        <div className={cx("row")}>
          <div className={cx("box", "content-wrap")}>
            <div className={cx("item")}>
              <div className={cx("content-btn-wrap")}>
                <BtnExcelDown columns={headerGroups} tableData={rows} prepareRow={prepareRow} />
              </div>
            </div>
            <div className={cx("item")}>
              {isLoadingStoreData ? (
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
                  isAdded={isAdded}
                  setIsAdded={setIsAdded}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  handleUpdateData={handleUpdateData}
                  tableState={tableState}
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

export default StoreAccount;
