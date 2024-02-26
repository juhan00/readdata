import { useTranslation } from "next-i18next";

//styles
import styles from "./btnSave.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnSave = ({ onClick }) => {
  const { t } = useTranslation("common");
  return (
    <button className={cx("btn-save")} onClick={onClick}>
      저장
    </button>
  );
};

export default BtnSave;
