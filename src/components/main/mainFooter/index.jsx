//i18n
import { useTranslation } from "next-i18next";

//styles
import className from "classnames/bind";
import styles from "./mainFooter.module.scss";
const cx = className.bind(styles);

export default function MainFooter() {
  const { t } = useTranslation("common");

  return (
    <footer className={cx("footer")}>
      <div className={cx("footer-wrap")}>
        <div className={cx("text-wrap")}>
          <div className={cx("company")}>{t("main_footer.company")}</div>
          <div className={cx("info")}>
            {t("main_footer.ceo")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <br className={cx("mobile")} />
            {t("main_footer.address")}
            <br />
            {t("main_footer.phone")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {t("main_footer.business_number")}
          </div>
          <div className={cx("copyright")}>{t("main_footer.copyright")}</div>
        </div>
      </div>
    </footer>
  );
}
