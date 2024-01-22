import Link from "next/link";
import { USE_TYPE_USER, USE_TYPE_ADMIN } from "@/consts/common";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

//styles
import styles from "./leftNavigation.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const LeftNavigation = ({ useType, userMenu, adminMenu }) => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const handleClickUserMenu = (cagegory) => {
    router.push(`/user?category=${cagegory}`);
    // userMenu.setMenu(menu);
  };

  const handleClickAdminMenu = (cagegory) => {
    router.push(`/admin?category=${cagegory}`);
    // adminMenu.setMenu(menu);
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
                <button className={cx("menu1", userMenu.menu === "brand" && "active")} onClick={() => handleClickUserMenu("brand")}>
                  {t("data.user_menu.menu1")}
                </button>
              </li>
              <li>
                <button className={cx("menu2", userMenu.menu === "store" && "active")} onClick={() => handleClickUserMenu("store")}>
                  {t("data.user_menu.menu2")}
                </button>
              </li>
              <li>
                <button className={cx("menu3", userMenu.menu === "sales_day" && "active")} onClick={() => handleClickUserMenu("sales_day")}>
                  {t("data.user_menu.menu3")}
                </button>
              </li>
              <li>
                <button className={cx("menu4", userMenu.menu === "sales_month" && "active")} onClick={() => handleClickUserMenu("sales_month")}>
                  {t("data.user_menu.menu4")}
                </button>
              </li>
            </ul>
          )}

          {useType === USE_TYPE_ADMIN && (
            <ul className={cx("admin")}>
              <li>
                <button className={cx("menu1", adminMenu.menu === "company" && "active")} onClick={() => handleClickAdminMenu("company")}>
                  {t("data.admin_menu.menu1")}
                </button>
              </li>
              <li>
                <button className={cx("menu2", adminMenu.menu === "user" && "active")} onClick={() => handleClickAdminMenu("user")}>
                  {t("data.admin_menu.menu2")}
                </button>
              </li>
              <li>
                <button className={cx("menu3", adminMenu.menu === "store" && "active")} onClick={() => handleClickAdminMenu("store")}>
                  {t("data.admin_menu.menu3")}
                </button>
              </li>
              <li>
                <button className={cx("menu4", adminMenu.menu === "sales_day" && "active")} onClick={() => handleClickAdminMenu("sales_day")}>
                  {t("data.admin_menu.menu4")}
                </button>
              </li>
              <li>
                <button className={cx("menu5", adminMenu.menu === "sales_month" && "active")} onClick={() => handleClickAdminMenu("sales_month")}>
                  {t("data.admin_menu.menu5")}
                </button>
              </li>
              <li>
                <button className={cx("menu6", adminMenu.menu === "help" && "active")} onClick={() => handleClickAdminMenu("help")}>
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
