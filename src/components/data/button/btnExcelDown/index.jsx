import { useTranslation } from "next-i18next";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

//styles
import styles from "./btnExcelDown.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnExcelDown = ({ columns, tableData }) => {
  const { t } = useTranslation("common");

  const handleDownloadExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Sheet 1");

      let rowIndex = 1;
      let colIndex = 1;

      const processColumn = (column) => {
        const currentHeader = column.Header || "";
        const rowspan = column.rowspan;

        if (column.columns && column.columns.length > 0) {
          if (rowspan) {
            sheet.getCell(rowIndex, colIndex).value = currentHeader;
            colIndex = colIndex + 1;
          } else {
            sheet.getCell(rowIndex, colIndex).value = currentHeader;
            colIndex = colIndex + column.columns.length;
          }
        } else {
          sheet.getCell(rowIndex, colIndex).value = currentHeader;
          colIndex = colIndex + 1;
        }
      };

      const setProcessColumn = (headers) => {
        headers.forEach((column) => {
          processColumn(column);
        });
      };

      const setTableData = (rowData) => {
        rowData.forEach((data) => {
          if (data.value) {
            sheet.getCell(rowIndex, colIndex).value = data.value;
          }
          colIndex++;
        });
      };

      columns.forEach((column, index) => {
        const depth = index + 1;
        rowIndex = depth;
        colIndex = 1;
        setProcessColumn(column.headers);
      });

      if (tableData && tableData.length > 0) {
        tableData.forEach((rowData) => {
          rowIndex++;
          colIndex = 1;
          setTableData(rowData.cells);
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([buffer]), "excel_file.xlsx");
    } catch (error) {
      console.error("Excel 생성 오류:", error);
    }
  };

  return (
    <button className={cx("btn-excel-down")} onClick={() => handleDownloadExcel()}>
      엑셀다운
    </button>
  );
};

export default BtnExcelDown;
