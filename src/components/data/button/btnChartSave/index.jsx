import { useTranslation } from "next-i18next";
import { saveAs } from "file-saver";

//styles
import styles from "./btnChartSave.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const BtnChartSave = ({ onClick }) => {
  const { t } = useTranslation("common");

  return (
    <button className={cx("btn-chart-save")} onClick={onClick}>
      이미지저장
    </button>
  );
};

export default BtnChartSave;
