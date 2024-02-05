import TopHeader from "@/src/components/data/topHeader";
import LeftNavigation from "@/src/components/data/leftNavigation";

//styles
import styles from "./dataLayout.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const DataLayout = ({ children, useType, userMenu, adminMenu }) => {
  return (
    <div className={cx("container")}>
      <LeftNavigation useType={useType} userMenu={userMenu} adminMenu={adminMenu} />

      <div className={cx("content-container")}>
        <TopHeader useType={useType} />
        <div className={cx("content-wrap")}>{children}</div>
      </div>
    </div>
  );
};

export default DataLayout;
