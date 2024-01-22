import { useState, useMemo, useEffect } from "react";
import PopupSearchAddress from "@/src/components/data/popup/popupSearchAddress";
import { isEqual } from "lodash";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";
import { TABLE_COLUMN_TYPE_NUMBER, TABLE_COLUMN_TYPE_AUTHORITY, TABLE_COLUMN_TYPE_USEFLAG, TABLE_COLUMN_TYPE_ADDRESS } from "@/consts/common";

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
  const [{ popupState }, setGlobalState] = useGlobalState();

  const pages = useMemo(() => {
    const start = Math.floor(pageIndex / 5) * 5;
    const end = Math.min(start + 5, pageOptions.length);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [pageIndex, pageOptions.length]);

  const isObjectInArray = (array, targetObject, currentRowIndex) => {
    return array.filter((_, index) => index !== currentRowIndex).some((obj) => isEqual(obj, targetObject));
  };

  const handleChange = (columnId, value) => {
    setColumnValues((prevColumnValues) => ({
      ...prevColumnValues,
      [columnId]: value,
    }));
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
      setGlobalState({
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "중복된 데이터가 있습니다.",
        },
      });
      return;
    }

    setEditingRow(null);
    handleUpdateData({ ...columnValues });
    setIsEditing(false);
  };

  const handleEditCancelClick = () => {
    setColumnValues({});
    setEditingRow(null);
    setIsEditing(false);
  };

  const handleAddSaveClick = () => {
    console.log("tableState", tableState);
    console.log("columnValues", columnValues);

    const checkCurrentTableEqual = isObjectInArray(tableState, columnValues, 0);

    if (checkCurrentTableEqual) {
      setGlobalState({
        popupState: {
          isOn: true,
          popup: POPUP_DEFAULT,
          content: "중복된 데이터가 있습니다.",
        },
      });
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
      headerGroup.headers.filter((column) => column.type === "address").map((addressColumn) => addressColumn.id)
    );

    setColumnValues((prevColumnValues) => ({
      ...prevColumnValues,
      [addressCellName]: selectedAddress,
    }));
    setIsAddressPopupOpen(false);
  };

  return (
    <div className={cx("table-wrap")}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th {...column.getHeaderProps(isAdded || editingRow != null ? {} : column.getSortByToggleProps())} style={column.headerStyle}>
                  {column.render("header")}
                  <span>{column.isSorted ? (column.isSortedDesc ? "v" : "^") : ""}</span>
                </th>
              ))}
              {editMode && <th></th>}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);

            editingRow;
            const isEditingRow = editingRow === row.index || (isAdded && row.index === 0);
            return (
              <tr {...row.getRowProps()} onDoubleClick={() => handleClickReturn && handleClickReturn(row.original[returnColumnName])}>
                {row.cells.map((cell) => {
                  const isNumberColumn = cell.column.type === TABLE_COLUMN_TYPE_NUMBER;
                  const isAuthorityColumn = cell.column.type === TABLE_COLUMN_TYPE_AUTHORITY;
                  const isUseflagColumn = cell.column.type === TABLE_COLUMN_TYPE_USEFLAG;
                  const isAddressColumn = cell.column.type === TABLE_COLUMN_TYPE_ADDRESS;

                  return (
                    <td {...cell.getCellProps()} style={cell.column.cellStyle} key={cell.column.id}>
                      {isEditingRow ? (
                        isNumberColumn ? (
                          ""
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
                                // isAddressPopupOpen={isAddressPopupOpen}
                                onClose={() => setIsAddressPopupOpen(false)}
                              />
                            )}
                            <input
                              value={columnValues[cell.column.id] || cell.value || ""}
                              onClick={(e) => handleClickAddress(cell.column.id, e.target.value)}
                              readOnly
                            />
                          </>
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
                      ) : (
                        <button onClick={() => handleEditClick(rowIndex, row.index)}>수정</button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      <span>
        페이지 {pageIndex + 1} / {pageOptions.length}
      </span>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        {pages.map((page, index) => (
          <button key={index} onClick={() => gotoPage(page)} disabled={pageIndex === page}>
            {page + 1}
          </button>
        ))}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default RenderTable;
