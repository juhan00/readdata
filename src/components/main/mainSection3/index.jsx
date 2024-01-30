import Section3Slide from "./section3Slide";

//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./mainSection3.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const section3slideData = [
  {
    src: "assets/images/section3_slide1.png",
    alt: "section3 slide1",
  },
  {
    src: "assets/images/section3_slide2.png",
    alt: "section3 slide2",
  },
  {
    src: "assets/images/section3_slide3.png",
    alt: "section3 slide3",
  },
  {
    src: "assets/images/section3_slide4.png",
    alt: "section3 slide4",
  },
];

export default function MainSection3() {
  const { t } = useTranslation("common");

  return (
    <section className={cx("section3")}>
      <div className={cx("section-wrap")}>
        <div className="section3-slide">
          <Section3Slide props={section3slideData} />
        </div>
      </div>
    </section>
  );
}
