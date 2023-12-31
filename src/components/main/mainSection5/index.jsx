import MainMarquee from "./mainMarquee";

//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./mainSection5.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

const mainMarqueeTopData = [
  {
    src: "assets/images/main_partner_logo1.png",
    alt: "main partner logo1",
  },
  {
    src: "assets/images/main_partner_logo2.png",
    alt: "main partner logo2",
  },
  {
    src: "assets/images/main_partner_logo3.png",
    alt: "main partner logo3",
  },
  {
    src: "assets/images/main_partner_logo4.png",
    alt: "main partner logo4",
  },
];

const mainMarqueeBottomData = [
  {
    src: "assets/images/main_partner_logo5.png",
    alt: "main partner logo5",
  },
  {
    src: "assets/images/main_partner_logo6.png",
    alt: "main partner logo6",
  },
  {
    src: "assets/images/main_partner_logo7.png",
    alt: "main partner logo7",
  },
  {
    src: "assets/images/main_partner_logo8.png",
    alt: "main partner logo8",
  },
];

export default function MainSection5() {
  const { t } = useTranslation("common");

  return (
    <section className={cx("section5")}>
      <div className={cx("section-wrap")}>
        <h3>
          <strong>{t("main_section5.title_strong")}</strong>
          {t("main_section5.title")}
        </h3>
        <div className={cx("partner-logo")}>
          <MainMarquee props={mainMarqueeTopData} direction="left" />
          <MainMarquee props={mainMarqueeBottomData} direction="right" />
        </div>
      </div>
    </section>
  );
}
