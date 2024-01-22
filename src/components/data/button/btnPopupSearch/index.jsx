import { useTranslation } from "next-i18next";

//styles
import styles from "./btnPopupSearch.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnSearchPopup = () => {
  const { t } = useTranslation("common");
  return <button className={cx("submit")}>검색</button>;
};

export default BtnSearchPopup;
