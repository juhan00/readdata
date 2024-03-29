import { SEARCH_TYPE } from "@/consts/common";
import { POPUP_DEFAULT } from "@/consts/popup";
import { changeStoreColumns } from "@/consts/storeColumns";
import { useGlobalState } from "@/context/globalStateContext";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import BtnSearch from "@/src/components/data/button/btnSearch";
import BtnTableAdd from "@/src/components/data/button/btnTableAdd";
import RenderTable from "@/src/components/data/renderTable";
import SearchItem from "@/src/components/data/searchItem";
import { addStoreList, getStoreList, updateStoreList } from "@/utils/api/store";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { getBrandList } from "@/utils/api/brand";

//styles
import className from "classnames/bind";
import styles from "./store.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const Store = () => {
  const { t } = useTranslation(["common", "columns"]);
  const storeColumns = useMemo(() => changeStoreColumns(t), []);

  const searchFieldData = {
    brand_code: "",
    fran_name: "",
    use_flag: "",
  };

  const [{ popupState, userInfo }, setGlobalState] = useGlobalState();
  const [companyCode, setCompanyCode] = useState(userInfo.companyCode);
  const [brandFirstCode, setBrandFirstCode] = useState("");
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const newRow = useMemo(() => {
    return {
      ...storeColumns.reduce((obj, item) => {
        obj[item.accessor] = "";
        return obj;
      }, {}),
      "use_flag": 0,
      "brand_code": brandFirstCode,
      "new": "new"
    };
  }, [brandFirstCode]);

  const {
    data: storeData,
    isLoading: isLoadingStoreData,
    refetch: refetchStoreData,
  } = useQuery("getStoreData", () => getStoreList(companyCode), { enabled: companyCode !== undefined });

  const {
    data: brandData,
    isLoading: isLoadingBrandData,
    refetch: refetchBrandData,
  } = useQuery(["getStoreBrandData", companyCode], () => getBrandList(companyCode), {
    enabled: companyCode !== undefined,
  });

  useEffect(() => {
    if (!isLoadingStoreData && storeData) {
      setTableState(storeData);
    }
  }, [storeData, isLoadingStoreData]);

  const updateMutation = useMutation(async (data) => await updateStoreList(data), {
    onSuccess: () => {
      refetchStoreData();
    },
    onError: (error) => {
      console.error("Update error:", error);

      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "업데이트에 실패했습니다.",
        },
      }));
    },
  });

  useEffect(() => {
    if (!brandData || brandData.length === 0) {
      return;
    }
    setBrandFirstCode(brandData[0].brand_code);
  }, [brandData]);

  const addMutation = useMutation(async (data) => await addStoreList(data), {
    onSuccess: () => {
      refetchStoreData();
    },
    onError: (error) => {
      console.error("Update error:", error);

      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "추가에 실패했습니다.",
        },
      }));
    },
  });

  const excelMutation = useMutation(
    async (excelData) => {
      for (const data of excelData) {
        try {
          await addStoreList(data);
        } catch (error) {
          console.error("Update error:", error);
          throw error;
        }
      }
    },
    {
      onSuccess: () => {
        refetchStoreData();
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

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        ((!searchData.brand_code || row.brand_code?.toString().toLowerCase().includes(searchData.brand_code.toLowerCase())) &&
          (!searchData.fran_name || row.fran_name?.toString().toLowerCase().includes(searchData.fran_name.toLowerCase())) &&
          (!searchData.use_flag || row.use_flag?.toString().toLowerCase().includes(searchData.use_flag.toLowerCase()))) ||
        row.new?.toString().toLowerCase().includes("new")
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
      columns: storeColumns,
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
      storeColumns.forEach((column) => {
        if (item.hasOwnProperty(column.Header)) {
          transformedItem[column.accessor] = item[column.Header];
        }
      });
      return transformedItem;
    });

useEffect(() => {
 console.log("brandData", brandData);
},[brandData])

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
                <BtnTableAdd onClick={() => handleNewRowClick()} />
                <BtnExcelDown columns={headerGroups} tableData={rows} prepareRow={prepareRow} />
                <BtnExcelUpload transformExcelCell={transformExcelCell} excelMutation={excelMutation} />
              </div>
            </div>
            <div className={cx("item")}>
              {isLoadingStoreData ? (
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
                  addressItem={true}
                  brandItem={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Store;
