import Link from "next/link";

//styles
import styles from "./leftNavigation.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const LeftNavigation = () => {
  return (
    <div className={cx("left-navigation")}>
      <div className={cx("left-nav-wrap")}>
        <div className={cx("logo-wrap")}>
          <img src="/assets/images/logo.png" alt="logo" />
        </div>
        <nav>
          <ul>
            <li>
              <Link href={"none"} className={cx("menu1", "active")}>
                브랜드관리
              </Link>
            </li>
            <li>
              <Link href={"none"} className={cx("menu2")}>
                가맹점관리
              </Link>
            </li>
            <li>
              <Link href={"none"} className={cx("menu3")}>
                매출관리
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default LeftNavigation;
