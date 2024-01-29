import { USE_TYPE } from "@/consts/common";
import { useTranslation } from "next-i18next";

//styles
import styles from "./topHeader.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const TopHeader = ({ useType }) => {
  const { t } = useTranslation("common");

  return (
    <div className={cx("top-header")}>
      <div className={cx("use-type", useType === USE_TYPE.ADMIN ? "admin" : "user")}>{useType === USE_TYPE.ADMIN ? "관리자" : "사용자"}</div>
      <div className={cx("right")}>
        <div className={cx("name")}>
          <strong>홍길동</strong>
          {t("data.name_text")}
        </div>
        <button className={cx("help")}>{t("data.help")}</button>
        <button className={cx("logout")}>{t("data.logout")}</button>
      </div>
    </div>
  );
};

export default TopHeader;
