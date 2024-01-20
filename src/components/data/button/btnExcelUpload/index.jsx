import { useTranslation } from "next-i18next";
import { useState } from "react";
import * as XLSX from "xlsx";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_DEFAULT } from "@/consts/popup";

//styles
import styles from "./btnExcelUpload.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnExcelUpload = ({ transformExcelCell, excelMutation }) => {
  const [{ popupState }, setGlobalState] = useGlobalState();
  const { t } = useTranslation("common");

  const handleUploadExcel = (fileInput) => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const isExcelFile = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");

      if (!isExcelFile) {
        console.error("Invalid file format. Please upload an Excel file.");

        setGlobalState({
          popupState: {
            isOn: true,
            popup: POPUP_DEFAULT,
            content: "엑셀 파일을 업로드해주세요.",
          },
        });

        fileInput.value = "";
        return;
      }

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
      };
    }

    reader.readAsBinaryString(file);
  };

  return (
    <>
      <label htmlFor="file">
        <div className={cx("btn-excel-upload")}>엑셀업로드</div>
      </label>
      <input type="file" id="file" className={cx("btn-excel-upload-input")} onChange={(e) => handleUploadExcel(e.target)} />
    </>
  );
};

export default BtnExcelUpload;
