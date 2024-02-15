import { useGlobalState } from "@/context/globalStateContext";

import { POPUP_CONTACTUS } from "/consts/popup";
//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./mainSection1.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

export default function MainSection1() {
  const [{ popupState }, setGlobalState] = useGlobalState();
  const { t } = useTranslation("common");

  const handlePopupOpenClick = () => {
    setGlobalState((prevGlobalState) => ({
      ...prevGlobalState,
      popupState: {
        isOn: !popupState.isOn,
        popup: POPUP_CONTACTUS,
        title: t("popup:default.contact_us_title"),
      },
    }));
  };

  return (
    <section className={cx("section1")}>
      <div className={cx("section-wrap")}>
        <div className={cx("object")}>
          <div className={cx("object-wrap")}>
            <div className={cx("object1")}>
              <img src="/assets/images/section1_object1.png" alt="image object1" />
            </div>
            <div className={cx("object2")}>
              <img src="/assets/images/section1_object2.png" alt="image object2" />
            </div>
          </div>
        </div>
        <div className={cx("text-wrap")}>
          <div className={cx("sub-title")}>{t("main_section1.sub_title")}</div>
          <h2 className={cx("mobile")}>
            <strong>{t("main_section1.mobile.title_strong")}</strong>
            {t("main_section1.mobile.title")}
          </h2>
          <h2 className={cx("pc")}>
            <strong>{t("main_section1.title_strong")}</strong>
            {t("main_section1.title")}
          </h2>
          <p>{t("main_section1.descript")}</p>
          <button onClick={() => handlePopupOpenClick()}>{t("main_section1.button")}</button>
        </div>
        <div className={cx("screen")}>
          <img src="/assets/images/section1_screen.png" alt="ui screen" />
        </div>
      </div>
    </section>
  );
}
