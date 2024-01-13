import SearchItem from "@/src/components/data/searchItem";
import { SEARCH_TYPE_SELECT, SEARCH_TYPE_INPUT } from "@/consts/common";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useTable, useSortBy, usePagination } from "react-table";
import PopupSearchBrand from "@/src/components/data/popup/popupSearchBrand";
import BtnSearch from "@/src/components/data/button/btnSearch";
import BtnTableAdd from "@/src/components/data/button/btnTableAdd";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import { getSampleTable } from "@/utils/api/sampleTable";
import { brandColumns } from "@/consts/dataColumns";
import RenderTable from "@/src/components/data/renderTable";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import DaumPostcode from "react-daum-postcode";
import PopupSearchAddress from "@/src/components/data/popup/popupSearchAddress";
import { useMutation } from "react-query";

//styles
import styles from "./brand.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const EditableCell = ({ cell: { value: initialValue }, row: { index }, column, updateMyData, agreeOptions }) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);

  const handleDocumentClick = (e) => {
    // 팝업 영역을 제외한 다른 부분이 클릭되었을 때 팝업을 닫습니다.
    if (!e.target.closest("#addressPopup")) {
      setIsAddressPopupOpen(false);
    }
  };

  // 팝업 영역 외의 다른 부분이 클릭되었을 때 처리
  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleChange = (e) => setValue(e.target.value);

  const handleBlur = () => {
    setIsEditing(false);
    updateMyData(index, column.id, value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleSelectAddress = (selectedAddress) => {
    // 주소 검색 팝업에서 선택한 주소를 업데이트
    setValue(selectedAddress);
    // 업데이트된 주소를 상위 컴포넌트로 전달
    updateMyData(index, column.id, selectedAddress);
    // 팝업 닫기
    setIsEditing(false);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const isAgreeColumn = column.id === "agree";
  const isAddressColumn = column.id === "address";

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        // "동의" 컬럼에 대해서만 select 엘리먼트 렌더링
        isAgreeColumn ? (
          <select value={value} onChange={handleChange} onBlur={handleBlur} autoFocus>
            {agreeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : // 주소 컬럼에 대해서만 주소 검색 팝업 렌더링
        isAddressColumn ? (
          <PopupSearchAddress
            onSelectAddress={handleSelectAddress}
            orgAddress={value}
            isAddressPopupOpen={isAddressPopupOpen}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          // 나머지 컬럼에 대해서는 input 엘리먼트 렌더링
          <input value={value} onChange={handleChange} onBlur={handleBlur} autoFocus />
        )
      ) : (
        // 편집 모드가 아닐 때는 나머지 컬럼에 대해서는 <div>{value}</div> 렌더링
        <div>{value}</div>
      )}
    </div>
  );
};

const Brand = () => {
  const searchFieldData = {
    name: "",
    age: "",
  };

  const { t } = useTranslation(["common", "dataUser"]);
  const [brandState, setBrandState] = useState("초기 데이터");
  const [tableState, setTableState] = useState([]);
  const [isPopup, setIsPopup] = useState(false);
  const [agreeOptions] = useState(["Y", "N"]);
  const [isModified, setIsModified] = useState(false);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const mutation = useMutation(getSampleTable);

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
        setTableState(data);
        console.log("Data successfully:", data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getTableData();
  }, [getSampleTable]);

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
      columns: brandColumns,
      data: useMemo(() => memoizedData, [memoizedData]),
      defaultColumn: { Cell: EditableCell },
      updateMyData,
      agreeOptions,
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

  useEffect(() => {
    console.log("searchField", searchField);
    console.log("searchData", searchData);
    console.log("memoizedData", memoizedData);
  }, [searchField, searchData, memoizedData]);

  return (
    <>
      {isPopup && <PopupSearchBrand setReturnState={setBrandState} setIsPopup={setIsPopup} />}

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
                <BtnExcelDown />
                <BtnExcelUpload />
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
                  }}
                />
              )}
            </div>
            <div className={cx("item")}>
              {brandState}
              <button onClick={() => handleClickPopup()}>팝업열기</button>
            </div>
            <div className={cx("item")}>{brandState}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Brand;
