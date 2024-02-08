import { SEARCH_TYPE } from "@/consts/common";
import { companyColumns } from "@/consts/companyColumns";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import BtnSearch from "@/src/components/data/button/btnSearch";
import BtnTableAdd from "@/src/components/data/button/btnTableAdd";
import RenderTable from "@/src/components/data/renderTable";
import SearchItem from "@/src/components/data/searchItem";
import { addCompanyList, getCompanyList, updateCompanyList } from "@/utils/api/company";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";

//styles
import className from "classnames/bind";
import styles from "./company.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const Compnay = () => {
  const newRow = companyColumns.reduce((obj, item) => {
    if (item.accessor === "flag") {
      obj[item.accessor] = 0;
    } else {
      obj[item.accessor] = "";
    }
    return obj;
  }, {});

  const searchFieldData = {
    company_name: "",
    flag: "",
  };

  const [{ popupState }, setGlobalState] = useGlobalState();
  const { t } = useTranslation(["common", "dataAdmin"]);
  const [companyCode, setCompanyCode] = useState("C0001");
  const [tableState, setTableState] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: companyData,
    isLoading: isLoadingCompanyData,
    refetch: refetchCompanyData,
  } = useQuery("getCompanyData", () => getCompanyList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    if (!isLoadingCompanyData && companyData) {
      setTableState(companyData);
    }
  }, [companyData, isLoadingCompanyData]);

  const updateMutation = useMutation(async (data) => await updateCompanyList(data), {
    onSuccess: () => {
      refetchCompanyData();
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

  const addMutation = useMutation(async (data) => await addCompanyList(data), {
    onSuccess: () => {
      refetchCompanyData();
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

  const excelMutation = useMutation(
    async (excelData) => {
      for (const data of excelData) {
        try {
          await addCompanyList(data);
        } catch (error) {
          console.error("Update error:", error);
          throw error;
        }
      }
    },
    {
      onSuccess: () => {
        refetchCompanyData();
        gotoPage(0);

        setGlobalState({
          popupState: {
            isOn: true,
            popup: POPUP_DEFAULT,
            content: "엑셀업로드가 완료되었습니다.",
          },
        });
      },
      onError: (error) => {
        console.error("Update error:", error);

        setGlobalState({
          popupState: {
            isOn: true,
            popup: POPUP_DEFAULT,
            content: "엑셀업로드가 실패했습니다.",
          },
        });
      },
    }
  );

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.company_name || row.company_name?.toString().toLowerCase().includes(searchData.company_name.toLowerCase())) &&
        (!searchData.flag || row.flag?.toString().toLowerCase().includes(searchData.flag.toLowerCase()))
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
    gotoPage(0);
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
      gotoPage(0);
    }
  };

  const transformExcelCell = (excelData) =>
    excelData.map((item) => {
      const transformedItem = {};
      companyColumns.forEach((column) => {
        if (item.hasOwnProperty(column.Header)) {
          transformedItem[column.accessor] = item[column.Header];
        }
      });
      return transformedItem;
    });

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
                    value={searchField.company_name}
                    title={"회사명"}
                    id={"company_name"}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className={cx("item")}>
                  <SearchItem
                    searchType={SEARCH_TYPE.SELECT_FLAG}
                    value={searchField.flag}
                    title={"사용여부"}
                    id={"flag"}
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
                <BtnTableAdd onClick={() => handleNewRowClick()} />
                <BtnExcelDown columns={headerGroups} tableData={rows} prepareRow={prepareRow} />
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
                  tableState={tableState}
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
