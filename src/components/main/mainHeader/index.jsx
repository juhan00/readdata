import { useState } from "react";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_CONTACTUS } from "/consts/popup";

import Link from "next/link";

//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./mainHeader.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

export default function Header() {
  const [{ popupState }, setGlobalState] = useGlobalState();
  const [isMenu, setIsMenu] = useState(false);

  const { t } = useTranslation("common");

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleLoginClick = () => {
    alert("준비중입니다.");
  };

  const handleMenuClick = () => {
    setIsMenu(!isMenu);
  };

  const handlePopupOpenClick = () => {
    setGlobalState({
      popupState: {
        isOn: !popupState.isOn,
        popup: POPUP_CONTACTUS,
      },
    });
  };

  return (
    <header className={cx("header")}>
      <div className={cx("header-wrap")}>
        <div className={cx("logo")} onClick={() => handleScrollToTop()}>
          <img src="/assets/images/logo.png" alt="leaddata logo" />
        </div>
        <div className={cx("nav-wrap", isMenu && "active")}>
          <div className={cx("menu")} onClick={() => handleMenuClick()}></div>
          <nav>
            <Link href="https://leadplanet.kr/" target="_blank">
              {t("main_header.menu1")}
            </Link>
            <Link href="" onClick={() => handlePopupOpenClick()}>
              {t("main_header.menu2")}
            </Link>
            <Link href="" onClick={() => handleLoginClick()}>
              {t("main_header.menu3")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
