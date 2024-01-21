import { SEARCH_TYPE_INPUT, SEARCH_TYPE_SELECT_FLAG } from "@/consts/common";
import { companyColumns } from "@/consts/companyColumns";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import BtnSearch from "@/src/components/data/button/btnSearch";
import BtnTableAdd from "@/src/components/data/button/btnTableAdd";
import RenderTable from "@/src/components/data/renderTable";
import SearchItem from "@/src/components/data/searchItem";
import { addUserList, getCompanyList, updateUserList } from "@/utils/api/company";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";

//styles
import className from "classnames/bind";
import styles from "./company.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const Compnay = () => {
  const newRow = {
    company_code: "",
    company_name: "",
    bizno: "",
    boss: "",
    email: "",
    phone: 0,
    addr: 0,
    flag: "",
  };

  const searchFieldData = {
    company_name: "",
    boss: "",
    flag: "",
  };

  const { t } = useTranslation(["common", "dataAdmin"]);
  const [tableState, setTableState] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: companyData, isLoading: isLoadingCompanyData, refetch: refetchCompanyData } = useQuery("getTableData", getCompanyList);

  useEffect(() => {
    if (!isLoadingCompanyData && companyData) {
      console.log("setTableState");
      setTableState(companyData);
    }
  }, [companyData, isLoadingCompanyData]);

  const updateMutation = useMutation(async (data) => await updateCompanyList(data), {
    onSuccess: () => {
      refetchCompanyData();
    },
    onError: (error) => {
      console.error("Update error:", error);
    },
  });

  const addMutation = useMutation(async (data) => await addCompanyList(data), {
    onSuccess: () => {
      refetchCompanyData();
    },
    onError: (error) => {
      console.error("Update error:", error);
    },
  });

  const excelMutation = useMutation(
    async (excelData) => {
      const promises = excelData.map((data) => addCompanyList(data));
      await Promise.all(promises);
    },
    {
      onSuccess: () => {
        refetchCompanyData();
      },
      onError: (error) => {
        console.error("Update error:", error);
      },
    }
  );

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.company_name || row.company_name?.toString().toLowerCase().includes(searchData.company_name.toLowerCase())) &&
        (!searchData.boss || row.boss?.toString().toLowerCase().includes(searchData.boss.toLowerCase())) &&
        (!searchData.flag || row.flag?.toString().toLowerCase().includes(searchData.flag.toLowerCase()))
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
      columns: companyColumns,
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

  const handleAddData = (data) => {
    addMutation.mutate(data);
  };

  const handleNewRowClick = () => {
    if (!isAdded && !isEditing) {
      setTableState((prevTableState) => [
        {
          ...newRow,
        },
        ...prevTableState,
      ]);

      setIsAdded(true);
    }
  };

  const transformExcelCell = (excelData) =>
    excelData.map((item) => ({
      company_code: item["회사코드"],
      company_name: item["회사명"],
      bizno: item["사업자등록번호"],
      boss: item["대표자명"],
      email: item["이메일"],
      phone: item["전화번호"],
      addr: item["회사주소"],
      flag: item["사용여부"],
    }));

  return (
    <>
      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchItem
                searchType={SEARCH_TYPE_INPUT}
                value={searchField.company_name}
                title={"회사명"}
                id={"company_name"}
                onChange={handleFieldChange}
              />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} value={searchField.boss} title={"대표자"} id={"boss"} onChange={handleFieldChange} />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_SELECT_FLAG} value={searchField.flag} title={"사용여부"} id={"flag"} onChange={handleFieldChange} />
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
                <BtnTableAdd onClick={() => handleNewRowClick()} />
                <BtnExcelDown columns={companyColumns} tableData={memoizedData} />
                <BtnExcelUpload transformExcelCell={transformExcelCell} excelMutation={excelMutation} />
              </div>
            </div>
            <div className={cx("item")}>
              {isLoadingCompanyData ? (
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
                  editMode={true}
                  isAdded={isAdded}
                  setIsAdded={setIsAdded}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  handleUpdateData={handleUpdateData}
                  handleAddData={handleAddData}
                  setTableState={setTableState}
                  transformExcelCell={transformExcelCell}
                  newRow={newRow}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Compnay;
