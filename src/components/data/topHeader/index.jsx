import { USE_TYPE } from "@/consts/common";
import { useTranslation } from "next-i18next";
import { useGlobalState } from "@/context/globalStateContext";
import { useRouter } from "next/router";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { COOKIE_NAME } from "@/consts/common";

//styles
import styles from "./topHeader.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const TopHeader = ({ useType }) => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [{ userInfo }, setGlobalState] = useGlobalState();

  const handleLogoutClick = () => {
    deleteCookie(COOKIE_NAME);
    window.location.href = router.pathname;
  };

  return (
    <div className={cx("top-header")}>
      <div className={cx("use-type", useType === USE_TYPE.USER ? "user" : "admin")}>{useType === USE_TYPE.USER ? "사용자" : "관리자"}</div>
      <div className={cx("right")}>
        <div className={cx("name")}>
          <strong>{userInfo.name}</strong>
          {t("data.name_text")}
        </div>
        <button className={cx("help")}>{t("data.help")}</button>
        <button className={cx("logout")} onClick={() => handleLogoutClick()}>
          {t("data.logout")}
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
