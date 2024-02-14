import { useState, useEffect, useMemo, useCallback } from "react";
import DataPopupLayout from "@/layouts/dataPopupLayout";
import PopupSearchItem from "../popupSearchItem";
import { SEARCH_TYPE } from "@/consts/common";
import BtnPopupSearch from "../../button/btnPopupSearch";
import { getBrandList } from "@/utils/api/brand";
import RenderTable from "@/src/components/data/renderTable";
import { useTable, useSortBy, usePagination } from "react-table";
import { brandColumns } from "@/consts/brandColumns";
import { QueryClient, useMutation, useQuery } from "react-query";
import { changeCompanyPopupColumns } from "@/consts/companyPopupColumns";
import { useTranslation } from "next-i18next";
import SearchItem from "../../searchItem";
import { getCompanyList } from "@/utils/api/company";
import { useGlobalState } from "@/context/globalStateContext";

//styles
import styles from "./popupSearchCompany.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const PopupSearchCompany = ({ handleClickReturn, setIsPopup }) => {
  const searchFieldData = {
    company_name: "",
  };

  const { t } = useTranslation(["common", "columns"]);
  const [{ userInfo }] = useGlobalState();
  const [companyCode, setCompanyCode] = useState(userInfo.companyCode);
  const companyPopupColumns = useMemo(() => changeCompanyPopupColumns(t), []);
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);

  const {
    data: companyData,
    isLoading: isLoadingCompanyData,
    refetch: refetchCompanyData,
  } = useQuery("getCompanyPopupData", () => getCompanyList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    if (!isLoadingCompanyData && companyData) {
      setTableState(companyData);
    }
  }, [companyData, isLoadingCompanyData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) => !searchData.company_name || row.company_name?.toString().toLowerCase().includes(searchData.company_name.toLowerCase())
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
      columns: companyPopupColumns,
      data: useMemo(() => memoizedData, [memoizedData]),
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

  return (
    <DataPopupLayout title={"회사명 선택"} setIsPopup={setIsPopup}>
      <div className={cx("search-brand")}>
        <div className={cx("search-wrap")}>
          <SearchItem
            searchType={SEARCH_TYPE.INPUT}
            value={searchField.company_name}
            title={"회사명"}
            id={"company_name"}
            onChange={handleFieldChange}
          />
          <button className={cx("submit")} onClick={() => handleSearchSubmit()}>
            검색
          </button>
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
            editMode={true}
            tableState={tableState}
            handleClickReturn={handleClickReturn}
            returnBtnName={"선택"}
            // rowSelect={true}
            tableHeight={"28rem"}
          />
        </div>
      </div>
    </DataPopupLayout>
  );
};

export default PopupSearchCompany;
