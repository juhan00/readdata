import { USE_TYPE } from "@/consts/common";
import DataLayout from "@/layouts/dataLayout";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SalesDay from "../common/salesDay";
import SalesMonth from "../common/salesMonth";
import Dashboard from "../common/dashboard";
import SalesRegion from "../common/saleRegion";
import SalesAnalyze from "../common/salesAnalyze";

//styles
import className from "classnames/bind";
import styles from "./user.module.scss";

const cx = className.bind(styles);

const User = () => {
  const router = useRouter();
  const { category = "brand_test" } = router.query;
  const [userMenu, setUserMenu] = useState(category);

  useEffect(() => {
    setUserMenu(category);
  }, [category]);

  return (
    <div className={cx("user")}>
      <PopupDataDefault />
      <DataLayout useType={USE_TYPE.USER} userMenu={{ menu: userMenu }}>
        {!userMenu && <Dashboard />}
        {userMenu === "sales_day" && <SalesDay />}
        {userMenu === "sales_month" && <SalesMonth />}
        {userMenu === "sales_region" && <SalesRegion />}
        {userMenu === "sales_analyze" && <SalesAnalyze />}
      </DataLayout>
    </div>
  );
};

export default User;

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "dataUser", "popup"])),
    },
  };
};
