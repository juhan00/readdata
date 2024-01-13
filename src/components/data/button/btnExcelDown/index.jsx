import { useTranslation } from "next-i18next";

//styles
import styles from "./btnExcelDown.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnExcelDown = () => {
  const { t } = useTranslation("common");
  return <button className={cx("btn-excel-down")}>엑셀다운</button>;
};

export default BtnExcelDown;
