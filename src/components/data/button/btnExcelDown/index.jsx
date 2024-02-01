import { useTranslation } from "next-i18next";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

//styles
import styles from "./btnExcelDown.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnExcelDown = ({ columns, tableData }) => {
  const { t } = useTranslation("common");

  const handleDownloadExcel = () => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Add an empty column to handle columns not present in the tableData
    const emptyColumn = { header: "", accessor: "emptyColumn" };
    const updatedColumns = [...columns, emptyColumn];

    const formattedData = [
      updatedColumns.map((column) => column.header),
      ...tableData.map((row) =>
        updatedColumns.map((column) => {
          const cellValue = row[column.accessor];
          return cellValue !== undefined ? cellValue : "";
        })
      ),
    ];

    const ws = XLSX.utils.aoa_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    // Create a blob from workbook
    const excelBlob = XLSX.write(wb, { bookType: "xlsx", type: "array", mimeType: fileType });

    // Create a blob URL
    const excelBlobUrl = URL.createObjectURL(new Blob([excelBlob]));

    // Save the blob URL as a file
    saveAs(excelBlobUrl, `tableData${fileExtension}`);
    console.log("excel columns===============>", columns);
  };

  return (
    <button className={cx("btn-excel-down")} onClick={() => handleDownloadExcel()}>
      엑셀다운
    </button>
  );
};

export default BtnExcelDown;
