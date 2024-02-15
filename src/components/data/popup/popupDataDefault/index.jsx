import { useGlobalState } from "@/context/globalStateContext";
import DataPopupLayout from "@/layouts/dataPopupLayout";
import { POPUP_DEFAULT } from "@/consts/popup";

//i18n
import { useTranslation } from "next-i18next";

//styles
import className from "classnames/bind";
import styles from "./popupDataDefault.module.scss";
import { useEffect, useState } from "react";
const cx = className.bind(styles);

export default function PopupDataDefault({}) {
    const [{ popupState }, setGlobalState] = useGlobalState();
    const [isPopup, setIsPopup] = useState(false);
    const { t } = useTranslation("popup");

    useEffect(() => {
        if (popupState.isOn) {
            setIsPopup(true);
        } else {
            setIsPopup(false);
        }
    }, [popupState.isOn]);

    return (
        isPopup && (
            <>
                <DataPopupLayout title={popupState.title} setIsPopup={setIsPopup} setGlobalState={setGlobalState}>
                    <div className={cx("popup_default_wrap")}>{popupState.popup === POPUP_DEFAULT && popupState.content}</div>
                </DataPopupLayout>
            </>
        )
    );
}