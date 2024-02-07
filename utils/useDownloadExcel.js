import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const useDownloadExcel = (columns, tableData) => {
  const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  console.log("tableData", tableData);
  const formattedData = tableData.map((row) =>
    columns.map((column) => {
      const cellValue = row[column.accessor];
      return cellValue !== undefined ? cellValue : "";
    })
  );

  const ws = XLSX.utils.aoa_to_sheet([columns.map((column) => column.header), ...formattedData]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

  // Create a blob from workbook
  const excelBlob = XLSX.write(wb, { bookType: "xlsx", type: "array", mimeType: fileType });

  // Create a blob URL
  const excelBlobUrl = URL.createObjectURL(new Blob([excelBlob]));

  // Save the blob URL as a file
  saveAs(excelBlobUrl, `tableData${fileExtension}`);
};

export default useDownloadExcel;
