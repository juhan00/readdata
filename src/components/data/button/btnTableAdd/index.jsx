import { useTranslation } from "next-i18next";

//styles
import styles from "./btnTableAdd.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnTableAdd = ({ onClick }) => {
  const { t } = useTranslation("common");
  return (
    <button className={cx("btn-add")} onClick={onClick}>
      추가
    </button>
  );
};

export default BtnTableAdd;
