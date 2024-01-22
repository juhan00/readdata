import { useTranslation } from "next-i18next";

//styles
import styles from "./btnSearch.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnSearch = ({ onClick }) => {
  const { t } = useTranslation("common");
  return (
    <button className={cx("submit")} onClick={(e) => onClick(e)}>
      {t("search")}
    </button>
  );
};

export default BtnSearch;
