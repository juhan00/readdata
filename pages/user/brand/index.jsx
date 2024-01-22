import { SEARCH_TYPE_INPUT, SEARCH_TYPE_SELECT_FLAG } from "@/consts/common";
import { brandColumns } from "@/consts/brandColumns";
import BtnExcelDown from "@/src/components/data/button/btnExcelDown";
import BtnExcelUpload from "@/src/components/data/button/btnExcelUpload";
import BtnSearch from "@/src/components/data/button/btnSearch";
import BtnTableAdd from "@/src/components/data/button/btnTableAdd";
import RenderTable from "@/src/components/data/renderTable";
import SearchItem from "@/src/components/data/searchItem";
import { getBrandList, updateBrandList, addBrandList } from "@/utils/api/brand";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePagination, useSortBy, useTable } from "react-table";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";

//styles
import className from "classnames/bind";
import styles from "./brand.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const Brand = () => {
  const newRow = {
    brand_code: "",
    brand_name: "",
    company_code: "",
    company_name: "",
    use_flag: 0,
  };

  const searchFieldData = {
    brand_name: "",
    brand_flag: "",
  };

  const [{ popupState }, setGlobalState] = useGlobalState();
  const { t } = useTranslation(["common", "dataUser"]);
  const [companyCode, setCompanyCode] = useState("");
  const [tableState, setTableState] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: brandData,
    isLoading: isLoadingBrandData,
    refetch: refetchBrandData,
  } = useQuery(["getTableData", companyCode], () => getBrandList(companyCode), { enabled: companyCode !== undefined });

  useEffect(() => {
    if (!isLoadingBrandData && brandData) {
      console.log("setTableState");
      setTableState(brandData);
    }
  }, [brandData, isLoadingBrandData]);

  const updateMutation = useMutation(async (data) => await updateBrandList(data), {
    onSuccess: () => {
      refetchBrandData();
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
      refetchBrandData();
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

  const excelMutation = useMutation(async (excelData) => {
    for (const data of excelData) {
      try {
        await addBrandList(data);
      } catch (error) {
        console.error("Update error:", error);

        setGlobalState({
          popupState: {
            isOn: true,
            popup: POPUP_DEFAULT,
            content: "엑셀업로드가 실패했습니다.",
          },
        });

        return;
      }
    }

    refetchBrandData();

    setGlobalState({
      popupState: {
        isOn: true,
        popup: POPUP_DEFAULT,
        content: "엑셀업로드가 완료되었습니다.",
      },
    });
  });

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
      columns: brandColumns,
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
      gotoPage(0);
    }
  };

  const transformExcelCell = (excelData) =>
    excelData.map((item) => ({
      brand_code: item["브랜드 코드"],
      brand_name: item["브랜드명"],
      company_code: item["회사코드"],
      company_name: item["회사명"],
      use_flag: item["사용구분"],
    }));

  const exportExcelColumns = brandColumns.filter((column) => column.accessor !== "no");

  return (
    <>
      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchItem
                searchType={SEARCH_TYPE_INPUT}
                value={searchField.brand_name}
                title={"브랜드명"}
                id={"brand_name"}
                onChange={handleFieldChange}
              />
            </div>
            <div className={cx("item")}>
              <SearchItem
                searchType={SEARCH_TYPE_SELECT_FLAG}
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
              {isLoadingBrandData ? (
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

export default Brand;
