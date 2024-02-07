import { USE_TYPE } from "@/consts/common";
import DataLayout from "@/layouts/dataLayout";
import PopupDataDefault from "@/src/components/data/popup/popupDataDefault";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Compnay from "../common/company";
import SalesDay from "../common/salesDay";
import SalesMonth from "../common/salesMonth";
import User from "../common/user";
import StoreAccount from "../common/storeAccount";
import Store from "../common/store";
import StoreMapping from "../common/storeMapping";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Dashboard from "../common/dashboard";
import SalesRegion from "../common/saleRegion";
import SalesAnalyze from "../common/salesAnalyze";
import Brand from "../common/brand";
import SalesChannel from "../common/salesChannel";

//styles
import className from "classnames/bind";
import styles from "./admin.module.scss";

const cx = className.bind(styles);

const Admin = () => {
    const router = useRouter();
    const { category } = router.query;
    const [useType, setUseType] = useState(USE_TYPE.ADMINSUPER);
    const [adminMenu, setAdminMenu] = useState(category);

    useEffect(() => {
        setAdminMenu(category);
    }, [category]);

    return (
        <div className={cx("admin")}>
            <PopupDataDefault />
            <DataLayout useType={useType} adminMenu={{ menu: adminMenu }}>
                {!adminMenu && <Dashboard />}
                {adminMenu === "company" && <Compnay />}
                {adminMenu === "user" && <User />}
                {adminMenu === "brand" && <Brand />}
                {adminMenu === "store" && <Store />}
                {adminMenu === "store_account" && <StoreAccount />}
                {adminMenu === "store_mapping" && <StoreMapping />}
                {adminMenu === "sales_day" && <SalesDay />}
                {adminMenu === "sales_month" && <SalesMonth />}
                {adminMenu === "sales_region" && <SalesRegion />}
                {adminMenu === "sales_channel" && <SalesChannel />}
                {adminMenu === "sales_analyze" && <SalesAnalyze />}
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