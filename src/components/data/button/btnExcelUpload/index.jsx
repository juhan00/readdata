import { useTranslation } from "next-i18next";
import { useState } from "react";
import * as XLSX from "xlsx";

//styles
import styles from "./btnExcelUpload.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnExcelUpload = ({ transformExcelCell, excelMutation }) => {
  const { t } = useTranslation("common");
  // const [excelData, setExcelData] = useState([]);

  const handleUploadExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryString = e.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const uploadedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const headers = uploadedData[0];
      const formattedData = uploadedData.slice(1).map((row) => {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });

      const excelData = transformExcelCell([...formattedData]);
      excelMutation.mutate(excelData);
      // setIsModified(true);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <label htmlFor="file">
        <div className={cx("btn-excel-upload")}>엑셀업로드</div>
      </label>
      <input type="file" id="file" className={cx("btn-excel-upload-input")} onChange={(e) => handleUploadExcel(e.target.files[0])} />
    </>
  );
};

export default BtnExcelUpload;
