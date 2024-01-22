import Link from "next/link";

//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./mainBanner.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

export default function Header() {
  const { t } = useTranslation("common");

  return (
    <div className={cx("banner")}>
      <div className={cx("banner-wrap")}>
        <div className={cx("text-wrap")}>
          <h3>
            {t("main_banner.title")}
            <br />
            <strong>{t("main_banner.title_strong")}</strong>
          </h3>
          <p>{t("main_banner.sub_title")}</p>
          <Link href="https://leadplanet.kr/" target="_blank" className={cx("button")}>
            {t("main_banner.button")}
          </Link>
        </div>
        <div className={cx("image-wrap")}>
          <img src="/assets/images/main_banner_icon1.png" alt="icon1" className={cx("icon1")} />
          <img src="/assets/images/main_banner_icon2.png" alt="icon2" className={cx("icon2")} />
          <img src="/assets/images/main_banner_icon3.png" alt="icon3" className={cx("icon3")} />
          <img src="/assets/images/main_banner_laptop.png" alt="laptop" />
        </div>
      </div>
    </div>
  );
}
