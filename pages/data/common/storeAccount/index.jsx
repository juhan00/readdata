import { SEARCH_TYPE } from "@/consts/common";
import { POPUP_DEFAULT } from "@/consts/popup";
import { changeStoreAccountColumns } from "@/consts/storeAccountColumns";
import { useGlobalState } from "@/context/globalStateContext";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnSearch from "@/src/components/data/button/btnSearch";
import RenderTable from "@/src/components/data/renderTable";
import SearchItem from "@/src/components/data/searchItem";
import { getStoreAccountList } from "@/utils/api/store";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import StoreAccountAdd from "@/src/components/data/storeAccountAdd";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import { updateStoreAccountList } from "@/utils/api/store";

//styles
import className from "classnames/bind";
import styles from "./storeAccount.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const StoreAccount = () => {
  const { t } = useTranslation(["common", "columns"]);
  const storeAccountColumns = useMemo(() => changeStoreAccountColumns(t), []);

  const searchFieldData = {
    brand_code: "",
    fran_name: "",
  };

  const [{ popupState, userInfo }, setGlobalState] = useGlobalState();
  const [companyCode, setCompanyCode] = useState(userInfo.companyCode);
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectStoreState, setSelectStoreState] = useState({});

  const {
    data: storeAccountData,
    isLoading: isLoadingStoreAccountData,
    refetch: refetchStoreAccountData,
  } = useQuery("getStoreAccountData", () => getStoreAccountList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    if (!isLoadingStoreAccountData && storeAccountData) {
      setTableState(storeAccountData);
    }
  }, [storeAccountData, isLoadingStoreAccountData]);

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.brand_code || row.brand_code?.toString().toLowerCase().includes(searchData.brand_code.toLowerCase())) &&
        (!searchData.fran_name || row.fran_name?.toString().toLowerCase().includes(searchData.fran_name.toLowerCase()))
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

  const handleClickReturn = (state) => {
    setSelectStoreState({ ...state });
  };

  const excelMutation = useMutation(
    async (excelData) => {
      for (const data of excelData) {
        try {
          await updateStoreAccountList(data);
        } catch (error) {
          console.error("Update error:", error);
          throw error;
        }
      }
    },
    {
      onSuccess: () => {
        refetchStoreAccountData();
        gotoPage(0);

        setGlobalState((prevGlobalState) => ({
          ...prevGlobalState,
          popupState: {
            isOn: true,
            popup: POPUP_DEFAULT,
            content: "엑셀업로드가 완료되었습니다.",
          },
        }));
      },
      onError: (error) => {
        console.error("Update error:", error);

        setGlobalState((prevGlobalState) => ({
          ...prevGlobalState,
          popupState: {
            isOn: true,
            popup: POPUP_DEFAULT,
            content: "엑셀업로드가 실패했습니다.",
          },
        }));
      },
    }
  );

  const transformExcelCell = (excelData) =>
    excelData.map((item) => {
      const transformedItem = {};
      storeAccountColumns.forEach((column) => {
        if (item.hasOwnProperty(column.Header)) {
          transformedItem[column.accessor] = item[column.Header] === undefined ? "" : item[column.Header];
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
                    searchType={SEARCH_TYPE.SELECT_BRAND}
                    value={searchField.brand_code}
                    title={"브랜드 명"}
                    id={"brand_code"}
                    onChange={handleFieldChange}
                    companyCode={companyCode}
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
              <div className={cx("content-btn-wrap")}>
                <BtnExcelDown columns={headerGroups} tableData={rows} prepareRow={prepareRow} />
                <BtnExcelUpload transformExcelCell={transformExcelCell} excelMutation={excelMutation} />
              </div>
            </div>
            <div className={cx("item")}>
              {isLoadingStoreAccountData ? (
                <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
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
          <div className={cx("box", "right")}>
            <div className={cx("store-account-add")}>
              <StoreAccountAdd selectStoreState={selectStoreState} refetchStoreAccountData={refetchStoreAccountData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreAccount;
