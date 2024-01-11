import TopHeader from "@/src/components/topHeader";
import LeftNavigation from "@/src/components/leftNavigation";

//styles
import styles from "./dataLayout.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const DataLayout = ({ children }) => {
  return (
    <div className={cx("container", "user")}>
      <LeftNavigation />

      <div className={cx("content-container")}>
        <TopHeader />
        <div className={cx("content-wrap")}>{children}</div>
      </div>
    </div>
  );
};

export default DataLayout;
