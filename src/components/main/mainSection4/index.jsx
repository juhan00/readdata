import Section4Slide from "./section4Slide";
import { POPUP_COST } from "/consts/popup";
import { POPUP_PLATFORM } from "/consts/popup";
//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./mainSection4.module.scss";
import className from "classnames/bind";

const cx = className.bind(styles);

export default function MainSection4() {
  const { t } = useTranslation("common");

  const section4slideData = [
    {
      src: "assets/images/section4_image1.png",
      alt: "section4 slide1",
      title: t("main_section4.box1_title"),
      descript: t("main_section4.box1_descript"),
      descript2: t("main_section4.box1_descript2"),
      button: t("main_section4.button"),
      popup: POPUP_PLATFORM,
    },
    {
      src: "assets/images/section4_image2.png",
      alt: "section4 slide2",
      title: t("main_section4.box2_title"),
      descript: t("main_section4.box2_descript"),
      descript2: false,
      button: false,
    },
    {
      src: "assets/images/section4_image3.png",
      alt: "section4 slide3",
      title: t("main_section4.box3_title"),
      descript: t("main_section4.box3_descript"),
      descript2: false,
      button: t("main_section4.button"),
      popup: POPUP_COST,
    },
  ];

  return (
    <section className={cx("section4")}>
      <div className={cx("section-wrap")}>
        <h3>
          {t("main_section4.title")}
          <br />
          <strong>{t("main_section4.title_strong")}</strong>
        </h3>
        <div className="section4-slide">
          <Section4Slide props={section4slideData} />
        </div>
      </div>
    </section>
  );
}
