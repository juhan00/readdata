//styles
import styles from "./topHeader.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

const TopHeader = ({ useType }) => {
  return (
    <div className={cx("top-header")}>
      <div className={cx("use-type", "user")}>사용자</div>
      <div className={cx("right")}>
        <div className={cx("name")}>
          <strong>홍길동</strong>님 로그인 중입니다.
        </div>
        <button className={cx("help")}>도움말</button>
        <button className={cx("logout")}>로그아웃</button>
      </div>
    </div>
  );
};

export default TopHeader;
