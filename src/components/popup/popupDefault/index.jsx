import { useGlobalState } from "@/context/globalStateContext";

import PopupContactUs from "../popupContactUs";
import PopupCost from "../popupCost";
import PopupPlatform from "../popupPlatform";

import { POPUP_DEFAULT, POPUP_CONTACTUS, POPUP_COST, POPUP_PLATFORM } from "@/consts/popup";
//i18n
import { useTranslation } from "next-i18next";

//styles
import className from "classnames/bind";
import styles from "./popupDefault.module.scss";
const cx = className.bind(styles);

export default function PopupDefault() {
  const [{ popupState }, setGlobalState] = useGlobalState();
  const { t } = useTranslation("popup");

  const handleCloseClick = () => {
    setGlobalState((prevGlobalState) => ({
      ...prevGlobalState,
      popupState: {
        isOn: !popupState.isOn,
      },
    }));
  };

  return (
    <>
      {popupState.isOn && (
        <div className={cx("popup-default")}>
          <div className={cx("popup-wrap")}>
            <div className={cx("box")}>
              <button className={cx("close")} onClick={() => handleCloseClick()}></button>

              {popupState.popup === POPUP_DEFAULT && (
                <>
                  {popupState.title ? (
                    <>
                      {" "}
                      <div className={cx("title")}>{popupState.title}</div>
                      <div className={cx("content-wrap", "default")}>{popupState.content}</div>
                    </>
                  ) : (
                    <div className={cx("content-wrap", "default", "no-title")}>{popupState.content}</div>
                  )}
                </>
              )}

              {popupState.popup === POPUP_CONTACTUS && (
                <>
                  <div className={cx("title")}>{popupState.title}</div>
                  <div className={cx("content-wrap")}>{<PopupContactUs />}</div>
                </>
              )}

              {popupState.popup === POPUP_COST && (
                <>
                  <div className={cx("title")}>{t("default.cost_title")}</div>
                  <div className={cx("content-wrap")}>{<PopupCost />}</div>
                </>
              )}

              {popupState.popup === POPUP_PLATFORM && (
                <>
                  <div className={cx("content-wrap")}>{<PopupPlatform />}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
