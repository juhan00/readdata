import { SEARCH_TYPE_INPUT, SEARCH_TYPE_SELECT } from "@/consts/common";
import { storeColumns } from "@/consts/storeColumns";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import BtnSearch from "@/src/components/data/button/btnSearch";
import BtnTableAdd from "@/src/components/data/button/btnTableAdd";
import PopupSearchBrand from "@/src/components/data/popup/popupSearchBrand";
import RenderTable from "@/src/components/data/renderTable";
import SearchItem from "@/src/components/data/searchItem";
import { getSampleTable } from "@/utils/api/sampleTable";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePagination, useSortBy, useTable } from "react-table";
import EditableCell from "@/src/components/data/editableCell";
import { useMutation } from "react-query";
import useDownloadExcel from "@/utils/useDownloadExcel";
import useUploadExcel from "@/utils/useUploadExcel";
import { getStoreList } from "@/utils/api/storeList";

//styles
import className from "classnames/bind";
import styles from "./store.module.scss";
const cx = className.bind(styles);

const Brand = () => {
  const searchFieldData = {
    name: "",
    age: "",
  };

  const { t } = useTranslation(["common", "dataUser"]);
  const [storeState, setStoreState] = useState("초기 데이터");
  const [tableState, setTableState] = useState([]);
  const [isPopup, setIsPopup] = useState(false);
  const [agreeOptions] = useState(["Y", "N"]);
  const [isModified, setIsModified] = useState(false);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const mutation = useMutation(async () => await getStoreList("B0001"));

  // const memoizedData = useMemo(
  //   () => tableState.filter((row) => Object.values(row).some((value) => value.toString().toLowerCase().includes(searchData.toLowerCase()))),
  //   [tableState, searchData]
  // );

  const memoizedData = useMemo(() => {
    return tableState.filter(
      (row) =>
        (!searchData.name || row.name.toLowerCase().includes(searchData.name.toLowerCase())) &&
        (!searchData.age || row.age?.toString().toLowerCase().includes(searchData.age.toLowerCase()))
    );
  }, [tableState, searchData]);

  const updateMyData = useCallback((rowIndex, columnId, value) => {
    setTableState((prevData) => prevData.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)));
    setIsModified(true);
  }, []);

  useEffect(() => {
    const getTableData = async () => {
      try {
        const data = await mutation.mutateAsync();
        console.log(data);
        setTableState(data);
        // console.log("Data successfully:", data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getTableData();
  }, [getStoreList]);

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
      columns: storeColumns,
      data: useMemo(() => memoizedData, [memoizedData]),
      initialState: { pageIndex: 0, pageSize: 10 },
      // defaultColumn: { Cell: EditableCell },
      // updateMyData,
      // agreeOptions,
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const handleClickPopup = () => {
    setIsPopup(true);
  };

  const handleFieldChange = (field, e) => {
    e.preventDefault();
    setSearchField((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchData((prevData) => ({
      ...prevData,
      ...searchField,
    }));
  };

  return (
    <>
      {isPopup && <PopupSearchBrand setReturnState={setStoreState} setIsPopup={setIsPopup} />}

      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_SELECT} title={"name"} name={"test"} />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} title={"name"} name={"name"} onChange={handleFieldChange} />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} title={"age"} name={"age"} onChange={handleFieldChange} />
            </div>
            <div className={cx("btn-submit")}>
              <BtnSearch onClick={handleSearchSubmit} />
            </div>
          </div>
        </div>

        <div className={cx("row")}>
          <div className={cx("box", "full-height", "content-wrap")}>
            <div className={cx("item")}>
              <div className={cx("content-btn-wrap")}>
                <BtnTableAdd />
                <BtnExcelDown columns={storeColumns} tableData={tableState} />
                <BtnExcelUpload setTableData={setTableState} setIsModified={setIsModified} />
              </div>
            </div>
            <div className={cx("item")}>
              {!memoizedData.length ? (
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
                    updateMyData,
                    agreeOptions,
                  }}
                />
              )}
            </div>
            <div className={cx("item")}>
              {storeState}
              <button onClick={() => handleClickPopup()}>팝업열기</button>
            </div>
            <div className={cx("item")}>{storeState}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brand;
