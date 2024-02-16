import { useState, useMemo, useEffect } from "react";
import PopupSearchAddress from "@/src/components/data/popup/popupSearchAddress";
import { isEqual } from "lodash";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";
import { TABLE_COLUMN_TYPE } from "@/consts/common";
import AddressItem from "../searchAddressItem/addressItem";
import { SEARCH_ADDRESS } from "@/consts/common";
import { getSidoDataList, getSigoonDataList } from "@/utils/api/address";
import { QueryClient, useQuery } from "react-query";
import PopupSearchCompany from "../popup/popupSearchCompany";
import { getBrandList } from "@/utils/api/brand";

//styles
import styles from "./renderTable.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const RenderTable = ({
  tableProps,
  handleClickReturn,
  returnColumnName,
  editMode,
  handleUpdateData,
  handleAddData,
  isAdded,
  setIsAdded,
  setIsEditing,
  tableState,
  setTableState,
  newRow,
  addressFieldName,
  returnBtnName,
  tableHeight,
  useDoubleClick,
  rowSelect,
  totalRow = false,
  addressItem = false,
  brandItem = false,
  rowFixHeaderValues = {},
}) => {
  const {
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
    // updateMyData,
  } = tableProps;

  const [editingRow, setEditingRow] = useState(null);
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
  const [columnValues, setColumnValues] = useState(newRow);
  const [booleanOption, setBooleanOption] = useState([0, 1]);
  const [selectRowIndex, setSelectRowIndex] = useState(null);
  const [gubun1, setGubun1] = useState({});
  const [isCompanyPopupOpen, setIsCompanyPopupOpen] = useState(false);
  const [{ popupState, userInfo }, setGlobalState] = useGlobalState();
  const [companyCode, setCompanyCode] = useState(userInfo.companyCode);

  const {
    data: sidoData,
    isLoading: isLoadingSidoDataData,
    refetch: refetchSidoData,
  } = useQuery("getTableSidoData", () => getSidoDataList(), {
    enabled: addressItem,
  });

  const {
    data: sigoonData,
    isLoading: isLoadingSigoonDataData,
    refetch: refetchSigoonData,
  } = useQuery(["getTableSigoonData", gubun1.code], () => getSigoonDataList(gubun1.name), {
    enabled: gubun1.code !== undefined && gubun1.code !== "" && addressItem,
  });

  const {
    data: brandData,
    isLoading: isLoadingBrandData,
    refetch: refetchBrandData,
  } = useQuery(["getTableBrandSelectData", companyCode], () => getBrandList(companyCode), {
    enabled: brandItem && companyCode !== undefined,
  });

  const pages = useMemo(() => {
    if (!pageOptions) {
      return [];
    }
    const start = Math.floor(pageIndex / 5) * 5;
    const end = Math.min(start + 5, pageOptions.length);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [pageIndex, pageOptions]);

  const isObjectInArray = (array, targetObject, currentRowIndex) => {
    return array.filter((_, index) => index !== currentRowIndex).some((obj) => isEqual(obj, targetObject));
  };

  const handleChange = (columnId, value, e) => {
    if (columnId === "gubun1" || columnId === "gubun2") {
      if (columnId === "gubun1") {
        setGubun1({ code: value, name: e.target.options[e.target.selectedIndex].text });
      }

      setColumnValues((prevColumnValues) => ({
        ...prevColumnValues,
        [columnId]: value,
        [`${columnId}_h`]: e.target.options[e.target.selectedIndex].text,
      }));
    } else {
      setColumnValues((prevColumnValues) => ({
        ...prevColumnValues,
        [columnId]: value,
      }));
    }
  };

  const handleEditClick = (rowIndex, fullRowIndex) => {
    setIsEditing(true);

    if (!isAdded) {
      setEditingRow(fullRowIndex);
      setColumnValues(page[rowIndex]?.values);
    }
  };

  const handleEditSaveClick = (rowIndex) => {
    const checkCurrentTableEqual = isObjectInArray(tableState, columnValues, rowIndex);

    if (checkCurrentTableEqual) {
      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "중복된 데이터가 있습니다.",
        },
      }));
      return;
    }

    setEditingRow(null);
    handleUpdateData({ ...columnValues });
    setIsEditing(false);
    setColumnValues({});
  };

  const handleEditCancelClick = () => {
    setColumnValues({});
    setEditingRow(null);
    setIsEditing(false);
  };

  const handleAddSaveClick = () => {
    const checkCurrentTableEqual = isObjectInArray(tableState, columnValues, 0);

    if (checkCurrentTableEqual) {
      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "중복된 데이터가 있습니다.",
        },
      }));
      return;
    }

    handleAddData({ ...columnValues });
    setTableState((prevTableState) => prevTableState.slice(1));
    setIsAdded(false);
  };

  const handleAddCancelClick = () => {
    setTableState((prevTableState) => prevTableState.slice(1));
    setColumnValues({});
    setIsAdded(false);
  };

  const handleClickAddress = (index, columnId) => {
    setIsAddressPopupOpen(true);
  };

  const handleSelectAddress = (selectedAddress) => {
    const addressCellName = headerGroups.flatMap((headerGroup) =>
      headerGroup.headers.filter((column) => column.type === TABLE_COLUMN_TYPE.ADDRESS).map((addressColumn) => addressColumn.id)
    );

    setColumnValues((prevColumnValues) => ({
      ...prevColumnValues,
      [addressCellName]: selectedAddress,
    }));
    setIsAddressPopupOpen(false);
  };

  const handleClickCompany = () => {
    setIsCompanyPopupOpen(true);
  };

  const handleSelectCompany = (selectedCompany) => {
    setIsCompanyPopupOpen(false);

    const compnayCellId = headerGroups.flatMap((headerGroup) =>
      headerGroup.headers.filter((column) => column.id === "company_code").map((companyColumn) => companyColumn.id)
    );

    const compnayCellName = headerGroups.flatMap((headerGroup) =>
      headerGroup.headers.filter((column) => column.type === TABLE_COLUMN_TYPE.COMPANY).map((companyColumn) => companyColumn.id)
    );

    setColumnValues((prevColumnValues) => ({
      ...prevColumnValues,
      [compnayCellId]: selectedCompany.company_code,
      [compnayCellName]: selectedCompany.company_name,
    }));
  };

  const handleSelectBrand = (e) => {
    const brandCellId = headerGroups.flatMap((headerGroup) =>
      headerGroup.headers.filter((column) => column.id === "brand_code").map((brandColumn) => brandColumn.id)
    );

    const brandCellName = headerGroups.flatMap((headerGroup) =>
      headerGroup.headers.filter((column) => column.type === TABLE_COLUMN_TYPE.BRAND).map((brandColumn) => brandColumn.id)
    );

    setColumnValues((prevColumnValues) => ({
      ...prevColumnValues,
      [brandCellId]: e.target.value,
      [brandCellName]: e.target.options[e.target.selectedIndex].text,
    }));
  };

  const handleClickSelect = (index) => {
    setSelectRowIndex(index);
  };

  //매출분석페이지 합계 Header
  const { sum_total = "", sum_avg = "", sum_pos = "", sum_delivery = "" } = rowFixHeaderValues;
  const SumTotal = sum_total ? Number(sum_total).toLocaleString() : "ㅡ";
  const SumAvg = sum_avg ? Number(sum_avg).toLocaleString() : "ㅡ";
  const SumPos = sum_pos ? Number(sum_pos).toLocaleString() : "ㅡ";
  const SumDelivery = sum_delivery ? Number(sum_delivery).toLocaleString() : "ㅡ";

  useEffect(() => {
    console.log("brandData", brandData);
    console.log("columnValues", columnValues);
  }, [brandData, columnValues]);

  return (
    <>
      <div className={cx("table-wrap")} style={tableHeight && { height: `${tableHeight}` }}>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {editMode && <th className={cx("edit-th")}></th>}

                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(isAdded || editingRow != null ? {} : column.getSortByToggleProps())}
                    style={column.headerStyle}
                    rowSpan={column.rowspan ? column.rowspan : ""}
                  >
                    <div className={cx("text")}>
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <span className={cx("sort", "desc")}>v</span>
                        ) : (
                          <span className={cx("sort", "asc")}>^</span>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
            {Object.keys(rowFixHeaderValues).length > 0 && (
              <tr>
                <th style={{ backgroundColor: "#fdeea8" }}>합계</th>
                <th style={{ backgroundColor: "#fdeea8" }}>{SumTotal}</th>
                <th style={{ backgroundColor: "#fdeea8" }}>{SumAvg}</th>
                <th style={{ backgroundColor: "#fdeea8" }}>{SumPos}</th>
                <th style={{ backgroundColor: "#fdeea8" }}>{SumDelivery}</th>
              </tr>
            )}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page?.map((row, rowIndex) => {
              prepareRow(row);

              editingRow;
              const isEditingRow = editingRow === row.index || (isAdded && row.index === 0);
              return (
                <tr
                  {...row.getRowProps()}
                  onDoubleClick={() => (useDoubleClick ? handleClickReturn && handleClickReturn(row.original[returnColumnName]) : "")}
                  className={cx(
                    rowSelect && selectRowIndex === row.index ? "active" : "",
                    totalRow === true && page.length === rowIndex + 1 ? "total" : ""
                  )}
                >
                  {editMode && (
                    <td>
                      <div className={cx("button-wrap")}>
                        {isEditingRow ? (
                          isAdded && row.index === 0 ? (
                            <>
                              <button onClick={() => handleAddSaveClick()}>저장</button>
                              <button onClick={() => handleAddCancelClick()}>취소</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEditSaveClick(row.index)}>저장</button>
                              <button onClick={() => handleEditCancelClick()}>취소</button>
                            </>
                          )
                        ) : handleClickReturn ? (
                          <button
                            onClick={() => {
                              handleClickReturn(row.values);
                              handleClickSelect(row.index);
                            }}
                          >
                            {returnBtnName || "선택"}
                          </button>
                        ) : (
                          <button onClick={() => handleEditClick(rowIndex, row.index)}>수정</button>
                        )}
                      </div>
                    </td>
                  )}
                  {row.cells.map((cell) => {
                    const isNumberColumn = cell.column.type === TABLE_COLUMN_TYPE.NUMBER;
                    const isAuthorityColumn = cell.column.type === TABLE_COLUMN_TYPE.AUTHORITY;
                    const isUseflagColumn = cell.column.type === TABLE_COLUMN_TYPE.USEFLAG;
                    const isAddressColumn = cell.column.type === TABLE_COLUMN_TYPE.ADDRESS;
                    const isgubun1Column = cell.column.type === TABLE_COLUMN_TYPE.GUBUN1;
                    const isgubun2Column = cell.column.type === TABLE_COLUMN_TYPE.GUBUN2;
                    const isNoEditColumn = cell.column.noEdit === true;
                    const isCompanyColumn = cell.column.type === TABLE_COLUMN_TYPE.COMPANY;
                    const isBrandColumn = cell.column.type === TABLE_COLUMN_TYPE.BRAND;

                    return (
                      <td {...cell.getCellProps()} style={cell.column.cellStyle} key={cell.column.id}>
                        {isEditingRow ? (
                          isNumberColumn || isNoEditColumn ? (
                            <input
                              value={columnValues[cell.column.id] || cell.value || ""}
                              readOnly
                              onFocus={(e) => {
                                e.target.blur();
                              }}
                            />
                          ) : isAuthorityColumn ? (
                            <select value={columnValues[cell.column.id]} onChange={(e) => handleChange(cell.column.id, Number(e.target.value))}>
                              {booleanOption.map((option) => (
                                <option key={option} value={option}>
                                  {option === 0 ? "사용자" : "관리자"}
                                </option>
                              ))}
                            </select>
                          ) : isUseflagColumn ? (
                            <select value={columnValues[cell.column.id]} onChange={(e) => handleChange(cell.column.id, Number(e.target.value))}>
                              {booleanOption.map((option) => (
                                <option key={option} value={option}>
                                  {option === 0 ? "사용안함" : "사용"}
                                </option>
                              ))}
                            </select>
                          ) : isAddressColumn ? (
                            <>
                              {isAddressPopupOpen && (
                                <PopupSearchAddress
                                  onSelectAddress={handleSelectAddress}
                                  orgAddress={columnValues[cell.column.id] || cell.value || ""}
                                  onClose={() => setIsAddressPopupOpen(false)}
                                />
                              )}
                              <input
                                value={columnValues[cell.column.id] || cell.value || ""}
                                onClick={(e) => handleClickAddress(cell.column.id, e.target.value)}
                                readOnly
                                onFocus={(e) => {
                                  e.target.blur();
                                }}
                              />
                            </>
                          ) : isgubun1Column ? (
                            <AddressItem
                              data={sidoData}
                              id={"gubun1"}
                              value={columnValues[cell.column.id]}
                              onChange={(e) => handleChange(cell.column.id, e.target.value, e)}
                              type={SEARCH_ADDRESS.SIDO}
                            />
                          ) : isgubun2Column ? (
                            <AddressItem
                              data={sigoonData}
                              id={"gubun2"}
                              value={columnValues[cell.column.id]}
                              onChange={(e) => handleChange(cell.column.id, e.target.value, e)}
                              type={SEARCH_ADDRESS.SIGOON}
                            />
                          ) : isCompanyColumn ? (
                            <>
                              {isCompanyPopupOpen && (
                                <PopupSearchCompany handleClickReturn={handleSelectCompany} setIsPopup={() => setIsCompanyPopupOpen(false)} />
                              )}
                              <input
                                value={columnValues[cell.column.id] || cell.value || ""}
                                onClick={(e) => handleClickCompany()}
                                readOnly
                                onFocus={(e) => {
                                  e.target.blur();
                                }}
                              />
                            </>
                          ) : isBrandColumn ? (
                            <select
                              id={"brand_code"}
                              defaultValue={columnValues["brand_code"]}
                              onChange={(e) => handleSelectBrand(e)}
                              disabled={isAdded ? false : true}
                            >
                              {brandData?.map((data) => {
                                return (
                                  <option key={data.brand_code} value={data.brand_code}>
                                    {data.brand_name}
                                  </option>
                                );
                              })}
                            </select>
                          ) : (
                            <input
                              value={columnValues[cell.column.id] || cell.value || ""}
                              onChange={(e) => handleChange(cell.column.id, e.target.value)}
                            />
                          )
                        ) : isNumberColumn ? (
                          row.index + 1
                        ) : (
                          cell.render("Cell")
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* <div className={cx("page-info-wrap")}>
        {pageIndex + 1} / {pageOptions.length}
      </div> */}
      {pageOptions && (
        <div className={cx("pagination")}>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className={cx("prev_double")}></button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className={cx("prev")}></button>
          <div className={cx("number-wrap")}>
            {pages.map((page, index) => (
              <button key={index} onClick={() => gotoPage(page)} disabled={pageIndex === page} className={cx("number")}>
                {page + 1}
              </button>
            ))}
          </div>
          <button onClick={() => nextPage()} disabled={!canNextPage} className={cx("next")}></button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className={cx("next_double")}></button>
        </div>
      )}
    </>
  );
};

export default RenderTable;
