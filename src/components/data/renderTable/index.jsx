import { useState, useMemo, useEffect } from "react";
import PopupSearchAddress from "@/src/components/data/popup/popupSearchAddress";
import { isEqual } from "lodash";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";

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
  const [editingRow, setEditingRow] = useState(null);
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
  const [columnValues, setColumnValues] = useState(newRow);
  const [booleanOption, setBooleanOption] = useState([0, 1]);
  const [{ popupState }, setGlobalState] = useGlobalState();

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

  const handleEditClick = (rowIndex) => {
    setIsEditing(true);

    if (!isAdded) {
      setEditingRow(rowIndex);
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

            const isEditingRow = editingRow === rowIndex || (isAdded && rowIndex === 0);
            return (
              <tr {...row.getRowProps()} onDoubleClick={() => handleClickReturn && handleClickReturn(row.original[returnColumnName])}>
                {row.cells.map((cell) => {
                  const isAuthorityColumn = cell.column.type === "authority";
                  const isUseflagColumn = cell.column.type === "useflag";
                  const isAddressColumn = cell.column.type === "address";

                  return (
                    <td {...cell.getCellProps()} style={cell.column.cellStyle} key={cell.column.id}>
                      {isEditingRow ? (
                        isAuthorityColumn ? (
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
                      ) : (
                        cell.render("Cell")
                      )}
                    </td>
                  );
                })}
                {editMode && (
                  <td>
                    {isEditingRow ? (
                      isAdded && rowIndex === 0 ? (
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
                      <button onClick={() => handleEditClick(row.index)}>수정</button>
                    )}
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
