import { SEARCH_TYPE_INPUT } from "@/consts/common";
import { storeMappingColumns } from "@/consts/storeMappingColumns";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnSearch from "@/src/components/data/button/btnSearch";
import BtnTableAdd from "@/src/components/data/button/btnTableAdd";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import RenderTable from "@/src/components/data/renderTable";
import SearchItem from "@/src/components/data/searchItem";
import { getStoreMapingList, updateStoreMapingList } from "@/utils/api/store";
import { useTranslation } from "next-i18next";
import { use, useEffect, useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";
import ScrapingSearch from "@/src/components/data/scrapingSearch";

//styles
import className from "classnames/bind";
import styles from "./storeMapping.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const StoreMapping = () => {
  const searchFieldData = {
    uid: "",
    uname: "",
  };

  const [{ popupState }, setGlobalState] = useGlobalState();
  const { t } = useTranslation(["common", "dataAdmin"]);
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);

  const {
    data: storeMapingData,
    isLoading: isLoadingStoreMapingData,
    refetch: refetchStoreMapingData,
  } = useQuery("getStoreMapingData", getStoreMapingList);

  useEffect(() => {
    console.log("storeMapingData", storeMapingData);
  });
  useEffect(() => {
    if (!isLoadingStoreMapingData && storeMapingData) {
      setTableState(storeMapingData);
    }
  }, [storeMapingData, isLoadingStoreMapingData]);

  const updateMutation = useMutation(async (data) => await updateStoreList(data), {
    onSuccess: () => {
      refetchStoreMapingData();
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

  const addMutation = useMutation(async (data) => await addStoreList(data), {
    onSuccess: () => {
      refetchStoreMapingData();
    },
    onError: (error) => {
      console.error("Update error:", error);

      setGlobalState({
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "추가에 실패했습니다.",
        },
      });
    },
  });

  const excelMutation = useMutation(async (excelData) => {
    for (const data of excelData) {
      try {
        await addStoreList(data);
      } catch (error) {
        console.error("Update error:", error);

        setGlobalState({
          popupState: {
            isOn: true,
            popup: POPUP_DEFAULT,
            content: "엑셀업로드가 실패했습니다.",
          },
        });

        return;
      }
    }

    refetchStoreMapingData();

    setGlobalState({
      popupState: {
        isOn: true,
        popup: POPUP_DEFAULT,
        content: "엑셀업로드가 완료되었습니다.",
      },
    });
  });

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.uid || row.uid?.toString().toLowerCase().includes(searchData.uid.toLowerCase())) &&
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
      columns: storeMappingColumns,
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
  };

  const handleUpdateData = (data) => {
    updateMutation.mutate(data);
  };

  // const transformExcelCell = (excelData) =>
  //   excelData.map((item) => Object.fromEntries(storeAccountColumns.map((column, index) => [column.header, item[index]])));

  // useEffect(() => {
  //   if (transformExcelData.length > 0) {
  //     excelMutation.mutate(transformExcelData);
  //   }
  // }, [excelMutation, transformExcelData]);

  return (
    <>
      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} value={searchField.uid} title={"사용자 ID"} id={"uid"} onChange={handleFieldChange} />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} value={searchField.uname} title={"사용자명"} id={"uname"} onChange={handleFieldChange} />
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
                  handleUpdateData={handleUpdateData}
                  tableState={tableState}
                  setTableState={setTableState}
                />
              )}
            </div>
          </div>
          <div className={cx("box", "content-wrap")}>
            <ScrapingSearch />
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreMapping;
