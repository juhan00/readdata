import DataLayout from "@/layouts/dataLayout";
import { USE_TYPE_USER } from "@/consts/common";
import Brand from "./brand";
import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import SalesDay from "./salesDay";
import SalesMonth from "./salesMonth";
import { useRouter } from "next/router";

//styles
import styles from "./user.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const User = () => {
  const router = useRouter();
  const { category } = router.query;
  const [userMenu, setUserMenu] = useState();

  useEffect(() => {
    if (!userMenu) {
      router.push(`/user?category=brand`);
    }
  }, []);

  useEffect(() => {
    setUserMenu(category);
  }, [category]);

  return (
    <div className={cx("user")}>
      <PopupDataDefault />
      <DataLayout useType={USE_TYPE_USER} userMenu={{ menu: userMenu, setMenu: setUserMenu }}>
        {userMenu === "brand" && <Brand />}
        {userMenu === "sales_day" && <SalesDay />}
        {userMenu === "sales_month" && <SalesMonth />}
      </DataLayout>
    </div>
  );
};

export default User;

export const getServerSideProps = async ({ locale, query }) => {
  const { category = "brand" } = query;

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "dataUser", "popup"])),
      category,
    },
  };
};
