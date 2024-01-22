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
  const [brandState, setBrandState] = useState("");
  const [isBrandPopup, setIsBrandPopup] = useState(false);
  const [tableState, setTableState] = useState([]);
  const [agreeOptions] = useState(["Y", "N"]);
  const [isModified, setIsModified] = useState(false);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const mutation = useMutation(getStoreList);

  // const memoizedData = useMemo(() => {
  //   return tableState.filter(
  //     (row) =>
  //       (!searchData.name || row.name.toLowerCase().includes(searchData.name.toLowerCase())) &&
  //       (!searchData.age || row.age?.toString().toLowerCase().includes(searchData.age.toLowerCase()))
  //   );
  // }, [tableState, searchData]);

  const updateMyData = useCallback((rowIndex, columnId, value) => {
    setTableState((prevData) => prevData.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)));
    setIsModified(true);
  }, []);

  const getTableData = async (brandState) => {
    try {
      const data = await mutation.mutateAsync(brandState);

      setTableState(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

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
      data: useMemo(() => tableState, [tableState]),
      initialState: { pageIndex: 0, pageSize: 10 },
      // defaultColumn: { Cell: EditableCell },
      // updateMyData,
      // agreeOptions,
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const handleClickBrandPopup = () => {
    console.log("handleClickBrandPopup");
    setIsBrandPopup(true);
  };

  const handleFieldChange = (field, e) => {
    e.preventDefault();
    setSearchField((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleSearchSubmit = (e) => {
    console.log("검색");
    getTableData(brandState);
    // e.preventDefault();
    // console.log(searchField);
    // setSearchData((prevData) => ({
    //   ...prevData,
    //   ...searchField,
    // }));
  };

  useEffect(() => {
    console.log(searchField);
  }, [searchField]);

  return (
    <>
      {isBrandPopup && <PopupSearchBrand setReturnState={setBrandState} setIsPopup={setIsBrandPopup} />}

      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchItem
                searchType={SEARCH_TYPE_INPUT}
                title={"브랜드명"}
                id={"brand"}
                name={"brand"}
                value={brandState}
                onClick={() => handleClickBrandPopup()}
                readOnly={true}
              />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} value={searchField.name} title={"name"} id={"name"} onChange={handleFieldChange} />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} value={searchField.age} title={"age"} id={"age"} onChange={handleFieldChange} />
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
              {!tableState.length ? (
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
                  editMode={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brand;
