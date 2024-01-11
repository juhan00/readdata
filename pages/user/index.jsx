import DataLayout from "@/layouts/dataLayout";
import { USE_TYPE_USER } from "@/consts/common";

//styles
import styles from "./user.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const User = () => {
  return (
    <div className={cx("user")}>
      <DataLayout useType={USE_TYPE_USER}>aaa</DataLayout>
    </div>
  );
};

export default User;
