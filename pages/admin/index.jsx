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

//styles
import className from "classnames/bind";
import styles from "./admin.module.scss";
const cx = className.bind(styles);

const Admin = ({ category }) => {
  return (
    <div className={cx("admin")}>
      <PopupDataDefault />
      <DataLayout useType={USE_TYPE_ADMIN} adminMenu={{ menu: category }}>
        {category === "company" && <Compnay />}
        {category === "user" && <User />}
        {category === "store" && <Store />}
        {category === "store_account" && <StoreAccount />}
        {category === "store_mapping" && <StoreMapping />}
        {category === "sales_day" && <SalesDay />}
        {category === "sales_month" && <SalesMonth />}
      </DataLayout>
    </div>
  );
};

export default Admin;

export const getServerSideProps = async ({ locale, query }) => {
  const { category = "company" } = query;
  const translations = await serverSideTranslations(locale, ["common", "dataAdmin", "popup"]);

  return {
    props: {
      ...translations,
      category,
    },
  };
};

// export const getStaticProps = async ({ locale }) => {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ["common", "dataAdmin", "popup"])),
//     },
//   };
// };
