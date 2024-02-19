import { USE_TYPE } from "@/consts/common";
import DataLayout from "@/layouts/dataLayout";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SalesDay from "../common/salesDay";
import SalesMonth from "../common/salesMonth";
import Dashboard from "../common/dashboard";
import SalesRegion from "../common/salesRegion";
import SalesAnalyze from "../common/salesAnalyze";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import { useGlobalState } from "@/context/globalStateContext";
import { COOKIE_NAME } from "@/consts/common";

//styles
import className from "classnames/bind";
import styles from "./user.module.scss";

const cx = className.bind(styles);

const User = () => {
  const router = useRouter();
  const { category } = router.query;
  const [auth, setAuth] = useState(false);
  const [userMenu, setUserMenu] = useState(category);
  const [{ userInfo }, setGlobalState] = useGlobalState();

  useEffect(() => {
    const cookie = getCookie(COOKIE_NAME);
    if (cookie) {
      setAuth(true);
      const cookieObj = JSON.parse(cookie);
      const userType = cookieObj.user_type;
      if (userType === 0) {
        setGlobalState((prevGlobalState) => ({
          ...prevGlobalState,
          userInfo: {
            id: cookieObj.user_id,
            name: cookieObj.user_name,
            companyCode: cookieObj.company_code,
          },
        }));
      } else {
        router.push("/data/login");
      }
    } else {
      router.push("/data/login");
    }
  }, []);

  useEffect(() => {
    setUserMenu(category);
  }, [category]);

  return (
    auth && (
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
    )
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
