import { useTranslation } from "next-i18next";

//styles
import styles from "./btnExcelUpload.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnExcelUpload = () => {
  const { t } = useTranslation("common");
  return <button className={cx("btn-excel-upload")}>엑셀업로드</button>;
};

export default BtnExcelUpload;
