import { brandTestColumns } from "@/consts/brandTestColumns";
import { brandColumns } from "@/consts/brandColumns";
import { SEARCH_TYPE } from "@/consts/common";
import { POPUP_DEFAULT } from "@/consts/popup";
import { useGlobalState } from "@/context/globalStateContext";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import BtnSearch from "@/src/components/data/button/btnSearch";
import BtnTableAdd from "@/src/components/data/button/btnTableAdd";
import RenderTableTest from "@/src/components/data/renderTableTest";
import SearchItem from "@/src/components/data/searchItem";
import { addBrandList, getBrandList, updateBrandList } from "@/utils/api/brand";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";

//styles
import className from "classnames/bind";
import styles from "./brandTest.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const BrandTest = () => {
  const newRow = brandTestColumns.reduce((obj, item) => {
    if (item.accessor === "use_flag") {
      obj[item.accessor] = 0;
    } else {
      obj[item.accessor] = "";
    }
    return obj;
  }, {});

  const searchFieldData = {
    brand_name: "",
    brand_flag: "",
  };

  const [{ popupState }, setGlobalState] = useGlobalState();
  const { t } = useTranslation(["common", "dataUser"]);
  const [companyCode, setCompanyCode] = useState("");
  const [tableState, setTableState] = useState([]);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: brandTestData,
    isLoading: isLoadingBrandTestData,
    refetch: refetchBrandTestData,
  } = useQuery(["getBrandTestData", companyCode], () => getBrandList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    if (!isLoadingBrandTestData && brandTestData) {
      setTableState(brandTestData);
    }
  }, [brandTestData, isLoadingBrandTestData]);

  const updateMutation = useMutation(async (data) => await updateBrandList(data), {
    onSuccess: () => {
      refetchBrandTestData();
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

  const addMutation = useMutation(async (data) => await addBrandList(data), {
    onSuccess: () => {
      refetchBrandTestData();
    },
    onError: (error) => {
      console.error("Added error:", error);

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
          await addBrandList(data);
        } catch (error) {
          console.error("Update error:", error);
          throw error;
        }
      }
    },
    {
      onSuccess: () => {
        refetchBrandTestData();
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
        (!searchData.brand_name || row.brand_name?.toString().toLowerCase().includes(searchData.brand_name.toLowerCase())) &&
        (!searchData.brand_flag || row.brand_flag?.toString().toLowerCase().includes(searchData.brand_flag.toLowerCase()))
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
      columns: brandTestColumns,
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
      brandTestColumns.forEach((column) => {
        if (item.hasOwnProperty(column.header)) {
          transformedItem[column.accessor] = item[column.header];
        }
      });
      return transformedItem;
    });

  const exportExcelColumns = brandTestColumns.filter((column) => column.accessor !== "no");

  return (
    <>
      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchItem
                searchType={SEARCH_TYPE.INPUT}
                value={searchField.brand_name}
                title={"브랜드명"}
                id={"brand_name"}
                onChange={handleFieldChange}
              />
            </div>
            <div className={cx("item")}>
              <SearchItem
                searchType={SEARCH_TYPE.SELECT_FLAG}
                value={searchField.brand_flag}
                title={"사용여부"}
                id={"brand_flag"}
                onChange={handleFieldChange}
              />
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
                <BtnExcelDown columns={exportExcelColumns} tableData={memoizedData} />
                <BtnExcelUpload transformExcelCell={transformExcelCell} excelMutation={excelMutation} />
              </div>
            </div>
            <div className={cx("item")}>
              {isLoadingBrandTestData ? (
                <div className={cx("loading-data")}>데이터를 가져오고 있습니다.</div>
              ) : !memoizedData.length ? (
                <div className={cx("no-data")}>데이터가 없습니다.</div>
              ) : (
                <RenderTableTest
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

export default BrandTest;
