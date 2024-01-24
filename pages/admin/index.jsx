import { USE_TYPE_ADMIN } from "@/consts/common";
import DataLayout from "@/layouts/dataLayout";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Compnay from "./company";
import SalesDay from "./salesDay";
import SalesMonth from "./salesMonth";
import User from "./user";
import StoreAccount from "./storeAccount";
import Store from "./store";
import StoreMapping from "./storeMapping";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

//styles
import className from "classnames/bind";
import styles from "./admin.module.scss";

const cx = className.bind(styles);

const Admin = () => {
  const router = useRouter();
  const { category = "company" } = router.query;
  const [adminMenu, setAdminMenu] = useState(category);

  useEffect(() => {
    setAdminMenu(category);
  }, [category]);

  return (
    <div className={cx("admin")}>
      <PopupDataDefault />
      <DataLayout useType={USE_TYPE_ADMIN} adminMenu={{ menu: adminMenu }}>
        {adminMenu === "company" && <Compnay />}
        {adminMenu === "user" && <User />}
        {adminMenu === "store" && <Store />}
        {adminMenu === "store_account" && <StoreAccount />}
        {adminMenu === "store_mapping" && <StoreMapping />}
        {adminMenu === "sales_day" && <SalesDay />}
        {adminMenu === "sales_month" && <SalesMonth />}
      </DataLayout>
    </div>
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
