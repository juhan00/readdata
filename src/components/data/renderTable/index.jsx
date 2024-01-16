import { useState, useMemo, use } from "react";
import PopupSearchAddress from "@/src/components/data/popup/popupSearchAddress";

//styles
import { useEffect } from "react";
import styles from "./renderTable.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const RenderTable = ({ tableProps }) => {
  const [editingRow, setEditingRow] = useState(null);
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
  const [columnValues, setColumnValues] = useState({});
  // const [pages, setPages] = useState();
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
    updateMyData,
    agreeOptions,
  } = tableProps;

  const pages = useMemo(() => {
    const start = Math.floor(pageIndex / 5) * 5;
    const end = Math.min(start + 5, pageOptions.length);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }, [pageIndex, pageOptions.length]);

  // useEffect(() => {
  //   const currentGroup = Math.floor(pageIndex / 5);
  //   const start = currentGroup * 5 + 1;
  //   const end = Math.min((currentGroup + 1) * 5, pageOptions.length + 1);
  //   const updatedPages = Array.from({ length: end - start }, (_, i) => start + i);
  //   setPages(updatedPages);
  //   console.log("pages", updatedPages);
  // }, [pageIndex, pageOptions.length]);

  const handleChange = (columnId, value) => {
    // 입력 필드의 상태를 업데이트
    setColumnValues((prevColumnValues) => ({
      ...prevColumnValues,
      [columnId]: value,
    }));
  };

  const handleEditClick = (rowIndex) => {
    setEditingRow(rowIndex);
  };

  const handleSaveClick = () => {
    // 여기에서 수정 내용을 저장하는 로직을 구현하세요.
    setEditingRow(null);
  };

  const handleCancelClick = () => {
    // 여기에서 수정 취소 로직을 구현하세요.
    setColumnValues({});
    setEditingRow(null);
  };

  const handleClickAddress = (index, columnId) => {
    setIsAddressPopupOpen(true);
  };

  const handleSelectAddress = (selectedAddress) => {
    // 주소 검색 팝업에서 선택한 주소를 업데이트
    setColumnValues((prevColumnValues) => ({
      ...prevColumnValues,
      ["address"]: selectedAddress,
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
                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={column.headerStyle}>
                  {column.render("Header")}
                  <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                </th>
              ))}
              <th></th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);

            const isEditing = editingRow === rowIndex;

            return (
              <tr {...row.getRowProps()} onDoubleClick={() => handleClickReturn && handleClickReturn(row.original[returnColumnName])}>
                {row.cells.map((cell) => {
                  const isAgreeColumn = cell.column.Header === "agree";
                  const isAddressColumn = cell.column.Header === "address";

                  return (
                    <td {...cell.getCellProps()} style={cell.column.cellStyle} key={cell.column.id}>
                      {isEditing ? (
                        isAgreeColumn ? (
                          <select value={columnValues[cell.column.id] || cell.value} onChange={(e) => handleChange(cell.column.id, e.target.value)}>
                            {agreeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : // 주소 컬럼에 대해서만 주소 검색 팝업 렌더링
                        isAddressColumn ? (
                          <>
                            {isAddressPopupOpen && (
                              <PopupSearchAddress
                                onSelectAddress={handleSelectAddress}
                                orgAddress={columnValues[cell.column.id] || cell.value}
                                // isAddressPopupOpen={isAddressPopupOpen}
                                onClose={() => setIsAddressPopupOpen(false)}
                              />
                            )}
                            <input
                              value={columnValues[cell.column.id] || cell.value}
                              onClick={(e) => handleClickAddress(cell.column.id, e.target.value)}
                              onChange={(e) => handleChange(cell.column.index, cell.column.id, e.target.value)}
                            />
                          </>
                        ) : (
                          // 나머지 컬럼에 대해서는 input 엘리먼트 렌더링
                          <input value={columnValues[cell.column.id] || cell.value} onChange={(e) => handleChange(cell.column.id, e.target.value)} />
                        )
                      ) : (
                        cell.render("Cell")
                      )}

                      {/* {isEditing ? (
                      <input type="text" value={cell.value} onChange={(e) => cell.column.onEditChange(row.index, e.target.value)} />
                    ) : (
                      cell.render("Cell")
                    )} */}
                    </td>
                  );
                })}
                <td>
                  {isEditing ? (
                    <>
                      <button onClick={handleSaveClick}>저장</button>
                      <button onClick={handleCancelClick}>취소</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditClick(row.index)}>수정</button>
                  )}
                </td>
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
