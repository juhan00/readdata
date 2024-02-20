import { USE_TYPE } from "@/consts/common";
import DataLayout from "@/layouts/dataLayout";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Compnay from "../common/company";
import SalesDay from "../common/salesDay";
import SalesMonth from "../common/salesMonth";
import User from "../common/user";
import StoreAccount from "../common/storeAccount";
import Store from "../common/store";
import StoreMapping from "../common/storeMapping";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "../common/dashboard";
import SalesRegion from "../common/salesRegion";
import SalesAnalyze from "../common/salesAnalyze";
import Brand from "../common/brand";
import SalesChannel from "../common/salesChannel";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useGlobalState } from "@/context/globalStateContext";
import { COOKIE_NAME } from "@/consts/common";

//styles
import className from "classnames/bind";
import styles from "./admin.module.scss";
import SalesAnalyzeSelect from "@/pages/data/common/SalesAnalyzeSelect";

const cx = className.bind(styles);

const Admin = () => {
  const router = useRouter();
  const { category } = router.query;
  const [auth, setAuth] = useState(false);
  const [useType, setUseType] = useState(USE_TYPE.ADMINSUPER);
  const [adminMenu, setAdminMenu] = useState(category);
  const [globalState, setGlobalState] = useGlobalState();

  useEffect(() => {
    const cookie = getCookie(COOKIE_NAME);
    if (cookie) {
      const cookieObj = JSON.parse(cookie);
      const userType = cookieObj.user_type;
      const superAdmin = cookieObj.super_admin;
      setGlobalState((prevGlobalState) => ({
        ...prevGlobalState,
        userInfo: {
          id: cookieObj.user_id,
          name: cookieObj.user_name,
          companyCode: cookieObj.company_code,
        },
      }));

      if (!superAdmin) {
        if (userType === 1) {
          setUseType(USE_TYPE.ADMIN);
        } else {
          router.push("/data/login");
        }
      } else {
        setUseType(USE_TYPE.ADMINSUPER);
      }

      setAuth(true);
    } else {
      router.push("/data/login");
    }
  }, []);

  useEffect(() => {
    setAdminMenu(category);
  }, [category]);

  return (
    auth && (
      <div className={cx("admin")}>
        <PopupDataDefault />
        <DataLayout useType={useType} adminMenu={{ menu: adminMenu }}>
          {!adminMenu && <Dashboard />}
          {adminMenu === "company" && <Compnay />}
          {adminMenu === "user" && <User />}
          {adminMenu === "brand" && <Brand />}
          {adminMenu === "store" && <Store />}
          {adminMenu === "store_account" && <StoreAccount />}
          {adminMenu === "store_mapping" && <StoreMapping />}
          {adminMenu === "sales_day" && <SalesDay />}
          {adminMenu === "sales_month" && <SalesMonth />}
          {adminMenu === "sales_region" && <SalesRegion />}
          {adminMenu === "sales_channel" && <SalesChannel />}
          {adminMenu === "sales_analyze" && <SalesAnalyze />}
          {adminMenu === "sales_analyze_select" && <SalesAnalyzeSelect />}
        </DataLayout>
      </div>
    )
  );
};

export default Admin;

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "dataAdmin", "popup"])),
    },
  };
};
