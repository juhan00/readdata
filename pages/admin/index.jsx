import DataLayout from "@/layouts/dataLayout";
import { USE_TYPE_ADMIN } from "@/consts/common";
import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

//styles
import styles from "./admin.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const Admin = () => {
  const [adminMenu, setAdminMenu] = useState(1);

  return (
    <div className={cx("admin")}>
      <DataLayout useType={USE_TYPE_ADMIN} adminMenu={{ menu: adminMenu, setMenu: setAdminMenu }}>
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
