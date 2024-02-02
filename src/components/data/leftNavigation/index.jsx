import Link from "next/link";
import { USE_TYPE } from "@/consts/common";
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
    router.push(`/data/user?category=${cagegory}`);
  };

  const handleClickAdminMenu = (cagegory) => {
    router.push(`/data/admin?category=${cagegory}`);
  };

  return (
    <div className={cx("left-navigation")}>
      <div className={cx("left-nav-wrap")}>
        <div className={cx("logo-wrap")}>
          <Link href={useType === USE_TYPE.USER ? "/data/user" : "/data/admin"}>
            <img src="/assets/images/logo.png" alt="logo" />
          </Link>
        </div>
        <nav>
          {useType === USE_TYPE.USER && (
            <ul className={cx("user")}>
              <li>
                <button className={cx("sales-day", userMenu.menu === "sales_day" && "active")} onClick={() => handleClickUserMenu("sales_day")}>
                  {t("data.nav_menu.sales_day")}
                </button>
              </li>
              <li>
                <button className={cx("sales-month", userMenu.menu === "sales_month" && "active")} onClick={() => handleClickUserMenu("sales_month")}>
                  {t("data.nav_menu.sales_month")}
                </button>
              </li>
              <li>
                <button
                  className={cx("sales-region", userMenu.menu === "sales_region" && "active")}
                  onClick={() => handleClickUserMenu("sales_region")}
                >
                  {t("data.nav_menu.sales_region")}
                </button>
              </li>
              <li>
                <button
                  className={cx("sales-analyze", userMenu.menu === "sales_analyze" && "active")}
                  onClick={() => handleClickUserMenu("sales_analyze")}
                >
                  {t("data.nav_menu.sales_analyze")}
                </button>
              </li>
            </ul>
          )}

          {useType === USE_TYPE.ADMIN && (
            <ul className={cx("admin")}>
              <li>
                <button className={cx("brand", adminMenu.menu === "brand" && "active")} onClick={() => handleClickAdminMenu("brand")}>
                  {t("data.nav_menu.brand")}
                </button>
              </li>
              <li>
                <button className={cx("store", adminMenu.menu === "store" && "active")} onClick={() => handleClickAdminMenu("store")}>
                  {t("data.nav_menu.store")}
                </button>
              </li>
              <li>
                <button
                  className={cx("store-account", adminMenu.menu === "store_account" && "active")}
                  onClick={() => handleClickAdminMenu("store_account")}
                >
                  {t("data.nav_menu.store_account")}
                </button>
              </li>
              <li>
                <button
                  className={cx("store-mapping", adminMenu.menu === "store_mapping" && "active")}
                  onClick={() => handleClickAdminMenu("store_mapping")}
                >
                  {t("data.nav_menu.store_mapping")}
                </button>
              </li>
              <li>
                <button className={cx("sales-day", adminMenu.menu === "sales_day" && "active")} onClick={() => handleClickAdminMenu("sales_day")}>
                  {t("data.nav_menu.sales_day")}
                </button>
              </li>
              <li>
                <button
                  className={cx("sales-month", adminMenu.menu === "sales_month" && "active")}
                  onClick={() => handleClickAdminMenu("sales_month")}
                >
                  {t("data.nav_menu.sales_month")}
                </button>
              </li>
              <li>
                <button
                  className={cx("sales-region", adminMenu.menu === "sales_region" && "active")}
                  onClick={() => handleClickAdminMenu("sales_region")}
                >
                  {t("data.nav_menu.sales_region")}
                </button>
              </li>
              <li>
                <button
                  className={cx("sales-analyze", adminMenu.menu === "sales_analyze" && "active")}
                  onClick={() => handleClickAdminMenu("sales_analyze")}
                >
                  {t("data.nav_menu.sales_analyze")}
                </button>
              </li>
            </ul>
          )}

          {useType === USE_TYPE.ADMINSUPER && (
            <ul className={cx("admin")}>
              <li>
                <button className={cx("company", adminMenu.menu === "company" && "active")} onClick={() => handleClickAdminMenu("company")}>
                  {t("data.nav_menu.company")}
                </button>
              </li>
              <li>
                <button className={cx("user", adminMenu.menu === "user" && "active")} onClick={() => handleClickAdminMenu("user")}>
                  {t("data.nav_menu.user")}
                </button>
              </li>
              <li>
                <button className={cx("brand", adminMenu.menu === "brand" && "active")} onClick={() => handleClickAdminMenu("brand")}>
                  {t("data.nav_menu.brand")}
                </button>
              </li>
              <li>
                <button className={cx("store", adminMenu.menu === "store" && "active")} onClick={() => handleClickAdminMenu("store")}>
                  {t("data.nav_menu.store")}
                </button>
              </li>
              <li>
                <button
                  className={cx("store-account", adminMenu.menu === "store_account" && "active")}
                  onClick={() => handleClickAdminMenu("store_account")}
                >
                  {t("data.nav_menu.store_account")}
                </button>
              </li>
              <li>
                <button
                  className={cx("store-mapping", adminMenu.menu === "store_mapping" && "active")}
                  onClick={() => handleClickAdminMenu("store_mapping")}
                >
                  {t("data.nav_menu.store_mapping")}
                </button>
              </li>
              <li>
                <button className={cx("sales-day", adminMenu.menu === "sales_day" && "active")} onClick={() => handleClickAdminMenu("sales_day")}>
                  {t("data.nav_menu.sales_day")}
                </button>
              </li>
              <li>
                <button
                  className={cx("sales-month", adminMenu.menu === "sales_month" && "active")}
                  onClick={() => handleClickAdminMenu("sales_month")}
                >
                  {t("data.nav_menu.sales_month")}
                </button>
              </li>
              <li>
                <button
                  className={cx("sales-region", adminMenu.menu === "sales_region" && "active")}
                  onClick={() => handleClickAdminMenu("sales_region")}
                >
                  {t("data.nav_menu.sales_region")}
                </button>
              </li>
              <li>
                <button
                  className={cx("sales-analyze", adminMenu.menu === "sales_analyze" && "active")}
                  onClick={() => handleClickAdminMenu("sales_analyze")}
                >
                  {t("data.nav_menu.sales_analyze")}
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
