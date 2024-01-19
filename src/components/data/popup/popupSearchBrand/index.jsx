import { useState, useEffect, useMemo, useCallback } from "react";
import DataPopupLayout from "@/layouts/dataPopupLayout";
import PopupSearchItem from "../popupSearchItem";
import { SEARCH_TYPE_INPUT } from "@/consts/common";
import BtnPopupSearch from "../../button/btnPopupSearch";
import { getBrandList } from "@/utils/api/getBrandList";
import { useMutation } from "react-query";
import RenderTable from "@/src/components/data/renderTable";
import { useTable, useSortBy, usePagination } from "react-table";
import { brandColumns } from "@/consts/brandColumns";

//styles
import styles from "./popupSearchBrand.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const PopupSearchBrand = ({ setReturnState, setIsPopup }) => {
  const [tableState, setTableState] = useState([]);
  const mutation = useMutation(() => getBrandList("C0002"));

  // const updateMyData = useCallback((rowIndex, columnId, value) => {
  //   setTableState((prevData) => prevData.map((row, index) => (index === rowIndex ? { ...row, [columnId]: value } : row)));
  //   setIsModified(true);

  // }, []);

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
      data: useMemo(() => tableState, [tableState]),
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  const getTableData = async () => {
    try {
      const data = await mutation.mutateAsync();
      setTableState(data);
      console.log("Data successfully:", data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    getTableData();
  }, [getBrandList]);

  const handleClickReturn = (state) => {
    setReturnState(state);
    setIsPopup(false);
  };

  return (
    <DataPopupLayout title={"테스트 타이틀"} setIsPopup={setIsPopup}>
      <div className={cx("search-brand")}>
        <div className={cx("search-wrap")}>
          <PopupSearchItem searchType={SEARCH_TYPE_INPUT} />
          <BtnPopupSearch />
        </div>
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
              pageOptions,
            }}
            handleClickReturn={handleClickReturn}
            returnColumnName={"brand_code"}
            editMode={false}
          />
          <button onClick={() => handleClickReturn()}>데이터 반환</button>
        </div>
      </div>
    </DataPopupLayout>
  );
};

export default PopupSearchBrand;
