import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const useUploadExcel = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const binaryString = e.target.result;
    const workbook = XLSX.read(binaryString, { type: "binary" });

    // Assume there is only one sheet, you may need to modify this if your Excel has multiple sheets
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert sheet data to array of objects using the first row as headers
    const uploadedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Extract headers and convert data to the desired format
    const headers = uploadedData[0];
    const formattedData = uploadedData.slice(1).map((row) => {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      return rowData;
    });

    // Update tableData by merging previous data with the formatted data
    setTableData((prevTableData) => [...prevTableData, ...formattedData]);

    // Set modified flag
    setIsModified(true);
  };

  reader.readAsBinaryString(file);
};

export default useUploadExcel;
