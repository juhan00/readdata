import { useState } from "react";
import { useGlobalState } from "@/context/globalStateContext";
import { POPUP_CONTACTUS } from "/consts/popup";

import Link from "next/link";

//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./mainHeader.module.scss";
import className from "classnames/bind";
import { POPUP_DEFAULT } from "@/consts/popup";
const cx = className.bind(styles);

export default function Header() {
  const [{ popupState }, setGlobalState] = useGlobalState();
  const [isMenu, setIsMenu] = useState(false);

  const { t } = useTranslation(["common", "popup"]);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleLoginClick = () => {
    setGlobalState((prevGlobalState) => ({
      ...prevGlobalState,
      popupState: {
        isOn: !popupState.isOn,
        popup: POPUP_DEFAULT,
        content: t("popup:default.coming_soon"),
      },
    }));
  };

  const handleMenuClick = () => {
    setIsMenu(!isMenu);
  };

  const handlePopupOpenClick = () => {
    setGlobalState((prevGlobalState) => ({
      ...prevGlobalState,
      popupState: {
        isOn: !popupState.isOn,
        popup: POPUP_CONTACTUS,
        title: t("popup:default.contact_us_title"),
      },
    }));
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
              {t("common:main_header.menu1")}
            </Link>
            <Link href="" onClick={() => handlePopupOpenClick()}>
              {t("common:main_header.menu2")}
            </Link>
            <Link href="" onClick={() => handleLoginClick()}>
              {t("common:main_header.menu3")}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
