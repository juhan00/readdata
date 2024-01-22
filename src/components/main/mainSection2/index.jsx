//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./mainSection2.module.scss";
import className from "classnames/bind";
import { useEffect } from "react";

const cx = className.bind(styles);

export default function MainSection2() {
  const { t } = useTranslation("common");

  return (
    <section className={cx("section2")}>
      <div className={cx("section-wrap")}>
        <h3>
          {t("main_section2.title")} <strong>{t("main_section2.title_strong")}</strong>
          <strong className={cx("box")}>{t("main_section2.title_strong_box")}</strong>
        </h3>

        <article>
          <div className={cx("thumb")}>
            <img src="/assets/images/section2_thumb1.png" alt="thumb1" />
          </div>
          <div className={cx("text-wrap")}>
            <p className={cx("mobile")}>
              <strong>{t("main_section2.mobile.thumb1_text_strong")}</strong>
              {t("main_section2.mobile.thumb1_text")}
              {t("main_section2.mobile.thumb1_text2")}
            </p>
            <p className={cx("pc")}>
              <strong>{t("main_section2.thumb1_text_strong")}</strong>
              {t("main_section2.thumb1_text")}
              {t("main_section2.thumb1_text2")}
            </p>
          </div>
        </article>
        <article>
          <div className={cx("thumb")}>
            <img src="/assets/images/section2_thumb2.png" alt="thumb2" />
          </div>
          <div className={cx("text-wrap")}>
            <p className={cx("mobile")}>
              {t("main_section2.mobile.thumb2_text1")}

              <strong>{t("main_section2.mobile.thumb2_text_strong")}</strong>
              {t("main_section2.mobile.thumb2_text2")}
            </p>

            <p className={cx("pc")}>
              {t("main_section2.thumb2_text1")}

              <strong>{t("main_section2.thumb2_text_strong")}</strong>
              {t("main_section2.thumb2_text2")}
            </p>
          </div>
        </article>
        <article>
          <div className={cx("thumb")}>
            <img src="/assets/images/section2_thumb3.png" alt="thumb3" />
          </div>
          <div className={cx("text-wrap")}>
            <p className={cx("mobile")}>
              {t("main_section2.mobile.thumb3_text1")}

              <strong>{t("main_section2.mobile.thumb3_text_strong")}</strong>
              {t("main_section2.mobile.thumb3_text2")}
            </p>

            <p className={cx("pc")}>
              {t("main_section2.thumb3_text1")}

              <strong>{t("main_section2.thumb3_text_strong")}</strong>
              {t("main_section2.thumb3_text2")}
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
