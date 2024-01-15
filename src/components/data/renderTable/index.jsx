//styles
import { useEffect } from "react";
import styles from "./renderTable.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const RenderTable = ({ tableProps }) => {
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
    handleClickReturn,
    returnColumnName,
  } = tableProps;

  return (
    <div className={cx("table-wrap")}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <>
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} style={column.headerStyle}>
                    {column.render("Header")}
                    <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                  </th>
                  {index === headerGroup.headers.length - 1 && <td></td>}
                </>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onDoubleClick={() => handleClickReturn && handleClickReturn(row.original[returnColumnName])}>
                {row.cells.map((cell, index) => (
                  <>
                    <td {...cell.getCellProps()} style={cell.column.cellStyle} key={cell.column.id}>
                      {cell.render("Cell")}
                    </td>
                    {index === row.cells.length - 1 && (
                      <td>
                        <button>취소</button>
                        <button>취소</button>
                      </td>
                    )}
                  </>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>
        {pageOptions.map((page, index) => (
          <button key={index} onClick={() => gotoPage(index)} disabled={pageIndex === index}>
            {index + 1}
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
