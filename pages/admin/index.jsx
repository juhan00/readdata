import DataLayout from "@/layouts/dataLayout";
import { USE_TYPE_ADMIN } from "@/consts/common";
import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Compnay from "./company";
import User from "./user";
import SalesDay from "./salesDay";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";

//styles
import styles from "./admin.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const Admin = () => {
  const [adminMenu, setAdminMenu] = useState(1);

  return (
    <div className={cx("admin")}>
      <PopupDataDefault />
      <DataLayout useType={USE_TYPE_ADMIN} adminMenu={{ menu: adminMenu, setMenu: setAdminMenu }}>
        {adminMenu === 1 && <Compnay />}
        {adminMenu === 2 && <User />}
        {adminMenu === 4 && <SalesDay />}
        admin
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
