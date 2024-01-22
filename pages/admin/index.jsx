import DataLayout from "@/layouts/dataLayout";
import { USE_TYPE_ADMIN } from "@/consts/common";
import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Compnay from "./company";
import User from "./user";
import SalesDay from "./salesDay";
import SalesMonth from "./salesMonth";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import { useRouter } from "next/router";

//styles
import styles from "./admin.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const Admin = () => {
  const router = useRouter();
  const { category } = router.query;
  const [adminMenu, setAdminMenu] = useState("company");

  useEffect(() => {
    setAdminMenu(category || adminMenu);
  }, [category]);

  return (
    <div className={cx("admin")}>
      <PopupDataDefault />
      <DataLayout useType={USE_TYPE_ADMIN} adminMenu={{ menu: adminMenu, setMenu: setAdminMenu }}>
        {adminMenu === "company" && <Compnay />}
        {adminMenu === "user" && <User />}
        {adminMenu === "sales_day" && <SalesDay />}
        {adminMenu === "sales_month" && <SalesMonth />}
      </DataLayout>
    </div>
  );
};

export default Admin;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "dataAdmin", "popup"])),
  },
});
