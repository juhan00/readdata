import Link from "next/link";
import { USE_TYPE_USER, USE_TYPE_ADMIN } from "@/consts/common";
import { useTranslation } from "next-i18next";

//styles
import styles from "./leftNavigation.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const LeftNavigation = ({ useType, userMenu, adminMenu }) => {
  const { t } = useTranslation("common");

  const handleClickUserMenu = (menu) => {
    userMenu.setMenu(menu);
  };

  const handleClickAdminMenu = (menu) => {
    adminMenu.setMenu(menu);
  };

  return (
    <div className={cx("left-navigation")}>
      <div className={cx("left-nav-wrap")}>
        <div className={cx("logo-wrap")}>
          <img src="/assets/images/logo.png" alt="logo" />
        </div>
        <nav>
          {useType === USE_TYPE_USER && (
            <ul className={cx("user")}>
              <li>
                <button className={cx("menu1", userMenu.menu === 1 && "active")} onClick={() => handleClickUserMenu(1)}>
                  {t("data.user_menu.menu1")}
                </button>
              </li>
              <li>
                <button className={cx("menu2", userMenu.menu === 2 && "active")} onClick={() => handleClickUserMenu(2)}>
                  {t("data.user_menu.menu2")}
                </button>
              </li>
              <li>
                <button className={cx("menu3", userMenu.menu === 3 && "active")} onClick={() => handleClickUserMenu(3)}>
                  {t("data.user_menu.menu3")}
                </button>
              </li>
              <li>
                <button className={cx("menu4", userMenu.menu === 4 && "active")} onClick={() => handleClickUserMenu(4)}>
                  {t("data.user_menu.menu4")}
                </button>
              </li>
            </ul>
          )}

          {useType === USE_TYPE_ADMIN && (
            <ul className={cx("admin")}>
              <li>
                <button className={cx("menu1", adminMenu.menu === 1 && "active")} onClick={() => handleClickAdminMenu(1)}>
                  {t("data.admin_menu.menu1")}
                </button>
              </li>
              <li>
                <button className={cx("menu2", adminMenu.menu === 2 && "active")} onClick={() => handleClickAdminMenu(2)}>
                  {t("data.admin_menu.menu2")}
                </button>
              </li>
              <li>
                <button className={cx("menu3", adminMenu.menu === 3 && "active")} onClick={() => handleClickAdminMenu(3)}>
                  {t("data.admin_menu.menu3")}
                </button>
              </li>
              <li>
                <button className={cx("menu4", adminMenu.menu === 4 && "active")} onClick={() => handleClickAdminMenu(4)}>
                  {t("data.admin_menu.menu4")}
                </button>
              </li>
              <li>
                <button className={cx("menu5", adminMenu.menu === 5 && "active")} onClick={() => handleClickAdminMenu(5)}>
                  {t("data.admin_menu.menu5")}
                </button>
              </li>
              <li>
                <button className={cx("menu6", adminMenu.menu === 6 && "active")} onClick={() => handleClickAdminMenu(6)}>
                  {t("data.admin_menu.menu6")}
                </button>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </div>
  );
};

export default LeftNavigation;
