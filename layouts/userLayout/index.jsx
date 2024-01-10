import TopHeader from "@/src/components/topHeader";
import LeftNavigation from "@/src/components/leftNavigation";

//styles
import styles from "./userLayout.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const UserLayout = ({ children }) => {
  return (
    <div className={cx("container", "user")}>
      <LeftNavigation />

      <div className={cx("content-container")}>
        <TopHeader />
      </div>
    </div>
  );
};

export default UserLayout;
