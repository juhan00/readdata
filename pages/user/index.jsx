import DataLayout from "@/layouts/dataLayout";
import { USE_TYPE_USER } from "@/consts/common";
import Brand from "./Brand";
import Franchisee from "./franchisee";
import { useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

//styles
import styles from "./user.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const User = () => {
  const [userMenu, setUserMenu] = useState(1);

  return (
    <div className={cx("user")}>
      <DataLayout useType={USE_TYPE_USER} userMenu={{ menu: userMenu, setMenu: setUserMenu }}>
        {userMenu === 1 && <Brand />}
        {userMenu === 2 && <Franchisee />}
      </DataLayout>
    </div>
  );
};

export default User;

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "dataUser", "popup"])),
  },
});
