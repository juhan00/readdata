import { useTranslation } from "next-i18next";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

// styles
import styles from "./btnExcelDown_Analyze.module.scss"
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnExcelDown_Analyze = ({ columns, tableData, prepareRow, periodType}) => {
    const { t } = useTranslation("common");

    let rowIndex = 1;
    let colIndex = 1;

    const handleDownloadExcel = async () => {
        try {
            const workbook = new ExcelJS.Workbook();
            const sheet = workbook.addWorksheet("Sheet 1");

            const mainHeaderRow = sheet.addRow([periodType === '조회' ? "조회기간" : "대비기간"]);
            mainHeaderRow.getCell(1).style = {
                font: { bold: true },
                alignment: { horizontal: "center" },
            };

            const subHeaderRow1 = sheet.addRow(["가맹점 명", "매출 합계", "평균 일매출", "매출 구분"]);
            subHeaderRow1.eachCell((cell, colNumber) => {
                cell.style = {
                    font: { bold: true },
                    alignment: {
                        horizontal: "center",
                        vertical: 'middle'
                    },
                };
            });

            const subHeaderRow2 = sheet.addRow(["", "", "", "POS", "Delivery"]);
            subHeaderRow2.eachCell((cell, colNumber) => {
                cell.style = {
                    font: { bold: true },
                    alignment: {
                        horizontal: "center",
                        vertical: 'middle'
                    },
                };
            });

            sheet.mergeCells(1, 1, 1, 5);
            sheet.mergeCells(3, 1, 2, 1);
            sheet.mergeCells(3, 2, 2, 2);
            sheet.mergeCells(3, 3, 2, 3);
            sheet.mergeCells(2, 4, 2, 5);

            const setTableData = (rowData) => {
                rowData?.forEach((data) => {
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
            });

            if (tableData && tableData.length > 0) {
                tableData.forEach((rowData) => {
                    prepareRow(rowData);
                    rowIndex++;
                    colIndex = 1;
                    setTableData(rowData.cells);
                });
            }


            // Save the workbook to a blob
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), "excel_file.xlsx");
        } catch (error) {
            console.error("Excel creation error:", error);
        }
    };

    return (
        <button className={cx("btn-excel-down")} onClick={() => handleDownloadExcel()}>
            엑셀다운
        </button>
    );
};

export default BtnExcelDown_Analyze;