import { useState } from "react";
//i18n
import { useTranslation } from "next-i18next";

//styles
import styles from "./popupPlatform.module.scss";
import className from "classnames/bind";
const cx = className.bind(styles);

export default function PopupPlatform() {
  const { t } = useTranslation("popup");

  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={cx("platform")}>
      <div className={cx("platform-wrap")}>
        <div className={cx("tab-wrap")}>
          <div className={cx("tab", { active: activeTab === 1 })} onClick={() => handleTabClick(1)}>
            <span>{t("platform.tab_title1")}</span>
          </div>
          <div className={cx("tab", { active: activeTab === 2 })} onClick={() => handleTabClick(2)}>
            <span>{t("platform.tab_title2")}</span>
          </div>
        </div>
        <div className={cx("content-wrap")}>
          {activeTab === 1 && (
            <div className={cx("image")}>
              <img src="/assets/images/platform_delivery_logo1.png" alt="delivery logo1" />
              <img src="/assets/images/platform_delivery_logo2.png" alt="delivery logo2" />
              <img src="/assets/images/platform_delivery_logo3.png" alt="delivery logo3" />
              <img src="/assets/images/platform_delivery_logo4.png" alt="delivery logo4" />
              <img src="/assets/images/platform_delivery_logo5.png" alt="delivery logo5" />
              <img src="/assets/images/platform_delivery_logo6.png" alt="delivery logo6" />
              <img src="/assets/images/platform_delivery_logo7.png" alt="delivery logo7" />
              <img src="/assets/images/platform_delivery_logo8.png" alt="delivery logo8" />
              <img src="/assets/images/platform_delivery_logo9.png" alt="delivery logo9" />
              <img src="/assets/images/platform_delivery_logo10.png" alt="delivery logo10" />
              <img src="/assets/images/platform_delivery_logo11.png" alt="delivery logo11" />
              <img src="/assets/images/platform_delivery_logo12.png" alt="delivery logo12" />
              <img src="/assets/images/platform_delivery_logo13.png" alt="delivery logo13" />
              <img src="/assets/images/platform_delivery_logo14.png" alt="delivery logo14" />
            </div>
          )}
          {activeTab === 2 && (
            <div className={cx("image")}>
              <img src="/assets/images/platform_pos_logo1.png" alt="pos logo1" />
              <img src="/assets/images/platform_pos_logo2.png" alt="pos logo2" />
              <img src="/assets/images/platform_pos_logo3.png" alt="pos logo3" />
              <img src="/assets/images/platform_pos_logo4.png" alt="pos logo4" />
              <img src="/assets/images/platform_pos_logo5.png" alt="pos logo5" />
              <img src="/assets/images/platform_pos_logo6.png" alt="pos logo6" />
              <img src="/assets/images/platform_pos_logo7.png" alt="pos logo7" />
              <img src="/assets/images/platform_pos_logo8.png" alt="pos logo8" />
              <img src="/assets/images/platform_pos_logo9.png" alt="pos logo9" />
              <img src="/assets/images/platform_pos_logo10.png" alt="pos logo10" />
              <img src="/assets/images/platform_pos_logo11.png" alt="pos logo11" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
