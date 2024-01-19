import { SEARCH_TYPE_INPUT, SEARCH_TYPE_SELECT } from "@/consts/common";
import { userColumns } from "@/consts/userColumns";
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
import { useQuery, useMutation, QueryClient, QueryClientProvider } from "react-query";
import useDownloadExcel from "@/utils/useDownloadExcel";
import useUploadExcel from "@/utils/useUploadExcel";
import { getUserList, updateUserList } from "@/utils/api/user";

//styles
import className from "classnames/bind";
import styles from "./user.module.scss";
const cx = className.bind(styles);

const queryClient = new QueryClient();

const User = () => {
  const searchFieldData = {
    uid: "",
    uname: "",
  };

  const { t } = useTranslation(["common", "dataUser"]);
  const [tableState, setTableState] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [searchData, setSearchData] = useState(searchFieldData);
  const [searchField, setSearchField] = useState(searchFieldData);
  const [isAdded, setIsAdded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { data: userData, isLoading: isLoadingUserData, refetch: refetchUserData } = useQuery("getTableData", getUserList);

  useEffect(() => {
    if (!isLoadingUserData && userData) {
      console.log("setTableState");
      setTableState(userData);
    }
  }, [userData, isLoadingUserData]);

  const updateMutation = useMutation(
    async (data) =>
      await updateUserList({
        user_id: data.uid,
        user_pw: data.upw,
        user_name: data.uname,
        email: data.email,
        phone_num: data.phone,
        authority: data.authority,
        useflag: data.use_flag,
        company_code: data.company_code,
        company_name: data.company_name,
      }),
    {
      onSuccess: () => {
        refetchUserData();
      },
      onError: (error) => {
        console.error("Update error:", error);
      },
    }
  );

  const addMutation = useMutation(
    async (data) =>
      await addUserList({
        user_id: data.uid,
        user_pw: data.upw,
        user_name: data.uname,
        email: data.email,
        phone_num: data.phone,
        authority: data.authority,
        useflag: data.use_flag,
        company_code: data.company_code,
        company_name: data.company_name,
      }),
    {
      onSuccess: () => {
        refetchUserData();
      },
      onError: (error) => {
        console.error("Update error:", error);
      },
    }
  );

  const memoizedData = useMemo(() => {
    return tableState?.filter(
      (row) =>
        (!searchData.uid || row.uid.toLowerCase().includes(searchData.uid.toLowerCase())) &&
        (!searchData.uname || row.uname?.toString().toLowerCase().includes(searchData.uname.toLowerCase()))
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
      columns: userColumns,
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
    const newRow = {
      uid: "",
      upw: "",
      uname: "",
      email: "",
      phone: "",
      authority: 0,
      use_flag: 0,
      company_code: "",
      company_name: "",
    };

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

  useEffect(() => {
    console.log("isEditing", isEditing);
  }, [isEditing]);

  return (
    <>
      <div className={cx("brand")}>
        <div className={cx("row")}>
          <div className={cx("box", "flex", "search-wrap")}>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} value={searchField.uid} title={"사용자 ID"} id={"uid"} onChange={handleFieldChange} />
            </div>
            <div className={cx("item")}>
              <SearchItem searchType={SEARCH_TYPE_INPUT} value={searchField.uname} title={"사용자명"} id={"uname"} onChange={handleFieldChange} />
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
                <BtnExcelDown columns={userColumns} tableData={tableState} />
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
                  }}
                  editMode={true}
                  isAdded={isAdded}
                  setIsAdded={setIsAdded}
                  isEditing={isEditing}
                  setIsEditing={setIsEditing}
                  handleUpdateData={handleUpdateData}
                  handleAddData={handleAddData}
                  setTableState={setTableState}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
