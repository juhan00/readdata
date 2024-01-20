import DataLayout from "@/layouts/dataLayout";
import { USE_TYPE_ADMIN } from "@/consts/common";
import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import User from "./user";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";

//styles
import styles from "./admin.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const Admin = () => {
  const [adminMenu, setAdminMenu] = useState(2);

  return (
    <div className={cx("admin")}>
      <PopupDataDefault />
      <DataLayout useType={USE_TYPE_ADMIN} adminMenu={{ menu: adminMenu, setMenu: setAdminMenu }}>
        {adminMenu === 2 && <User />}
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
