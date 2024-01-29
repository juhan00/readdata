import DataLayout from "@/layouts/dataLayout";
import { USE_TYPE } from "@/consts/common";
import Brand from "./brand";
import { useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import SalesDay from "./salesDay";
import SalesMonth from "./salesMonth";
import { useRouter } from "next/router";
import Store from "./store";
import StoreAccount from "./storeAccount";
import StoreMapping from "./storeMapping";
import BrandTest from "./brandTest";
import SalesTestMonth from "./salesTestMonth";

//styles
import styles from "./user.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const User = () => {
  const router = useRouter();
  const { category = "brand_test" } = router.query;
  const [userMenu, setUserMenu] = useState(category);

  useEffect(() => {
    setUserMenu(category);
    console.log(category);
  }, [category]);

  return (
    <div className={cx("user")}>
      <PopupDataDefault />
      <DataLayout useType={USE_TYPE.USER} userMenu={{ menu: userMenu }}>
        {userMenu === "brand" && <Brand />}
        {userMenu === "store" && <Store />}
        {userMenu === "store_account" && <StoreAccount />}
        {userMenu === "store_mapping" && <StoreMapping />}
        {userMenu === "sales_day" && <SalesDay />}
        {userMenu === "sales_month" && <SalesMonth />}
        {userMenu === "brand_test" && <BrandTest />}
        {userMenu === "sales_test_month" && <SalesTestMonth />}
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
